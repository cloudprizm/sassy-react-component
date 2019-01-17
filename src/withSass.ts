import {
  memo,
  Ref,
  forwardRef,
  createElement,
  FunctionComponent,
  ComponentType,
  HTMLAttributes,
} from 'react'
import { mapWithKey, foldr, separate } from 'fp-ts/lib/Record'
import { left, right, Either } from 'fp-ts/lib/Either'

type PossibleVariant<K> = keyof K
type StylesLookup<K> = Record<PossibleVariant<K>, string>
type SassyDefinitionComponentVariants<V> = Array<keyof V>
export type StyledAs = keyof JSX.IntrinsicElements | ComponentType

interface SassyDefinition<V> {
  lookup: StylesLookup<V>
  className?: string
  variants?: SassyDefinitionComponentVariants<V>
}

const embeddedVariantsToRecord = (variants?: string[]) =>
  variants
    ? variants.reduce((acc, variant) => ({ ...acc, [variant]: true }), {})
    : []

const combineStyles = (a?: string, b?: string) => [a, b].filter(Boolean).join(' ')

const checkInLookup =
  (dict: Record<string, string>) =>
    (key: string, val: unknown): Either<unknown, string> => {
      const valInDict = dict[key]
      return valInDict
        ? right(valInDict)
        : left(val)
    }

const toBeOrNotToBe =
  (dict: Record<string, unknown>) =>
    (k: string, n: string): Either<string, string> => !!dict[k] ? right(n) : left(n)

export const getSassVariantsFromLookup =
  <K>({ variants, lookup: dict }: SassyDefinition<K>) =>
    <P extends Partial<K> & HTMLAttributes<{}>>(props: P) => {
      const embeddedVariants = embeddedVariantsToRecord(variants)
      const propsWithEmbeddedVariants: Record<string, unknown> = { ...props, ...embeddedVariants }
      const maybeCSSKeys = mapWithKey(propsWithEmbeddedVariants, checkInLookup(dict))
      const segregatedProps = separate(maybeCSSKeys)
      const segregateVariants = mapWithKey(segregatedProps.right, toBeOrNotToBe(propsWithEmbeddedVariants))
      const onlyTruthy = separate(segregateVariants)

      return {
        ...segregatedProps.left,
        className: combineStyles(
          props.className,
          foldr(onlyTruthy.right, '', combineStyles)
        )
      } as P
    }

type AnyInputComponent = InputComponent<{}>

export type InputComponent<P> = FunctionComponent<P> | keyof JSX.IntrinsicElements
export interface RefForwarder<T = AnyInputComponent> { forwardedRef?: Ref<T> }
export interface RefAttr<T = AnyInputComponent> { ref?: RefForwarder<T>['forwardedRef'] }

const withDisplayName = <P>(component: FunctionComponent<P>, variants: string[]) => {
  component.displayName = variants[0]
  return component
}

export type ComponentWithVariant<P, V> =
  FunctionComponent<Partial<P & V & RefForwarder & HTMLAttributes<InputComponent<P & V>>>>

export const withVariants =
  <V extends Record<keyof V, boolean>>(lookup: StylesLookup<V>) => (...variants: Array<keyof V>) =>
    <P>(component: InputComponent<P & RefForwarder>): ComponentWithVariant<P, V> =>
      withDisplayName(
        memo((props) =>
          createElement(
            component,
            getSassVariantsFromLookup
              ({ lookup, variants })
              ({ ...props, ref: props.forwardedRef }) as P & RefAttr
          )
        ), variants)

export const styledWithVariants = withVariants
export const staticWithVariants = withVariants

export const withRefForwarding = <K>(Component: FunctionComponent<K>) =>
  forwardRef<InputComponent<any>, K>((props, ref) =>
    createElement(Component, { ...props, forwardedRef: ref }))