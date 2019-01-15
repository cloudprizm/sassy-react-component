import {
  memo,
  Ref,
  forwardRef,
  createElement,
  Props,
  HTMLProps,
  FunctionComponent,
  ComponentType,
  RefAttributes,
  AllHTMLAttributes,
  DOMAttributes
} from 'react'
import { StyledComponent, AnyStyledComponent } from 'styled-components'
import { mapWithKey, foldr, separate } from 'fp-ts/lib/Record'
import { left, right, Either } from 'fp-ts/lib/Either'

type PossibleVariant<K> = keyof K | string
type StylesLookup<K> = Record<PossibleVariant<K>, string>
type SassyDefinitionComponentVariants<V> = Array<keyof V>
type ToggleableSassVariant<V> = { [k in keyof V]?: boolean }
type StyledAs = keyof JSX.IntrinsicElements | ComponentType

interface SassyDefinition<V> {
  lookup: StylesLookup<V>
  className?: string
  variants?: SassyDefinitionComponentVariants<V>
}

interface WithPolymorphicAs {
  as?: StyledAs
}

type HTMLComponentProps<T> = {
  id?: string
  style?: React.CSSProperties
} & Partial<Pick<HTMLProps<T>, 'className' | 'type' | 'disabled'>>

type UnionToRecord<A extends string> = Partial<Record<A, unknown>>

export type VariantStrategy = (val: string) => string

export type SassyComponent<V, T = AnyStyledComponent> =
  & Partial<ToggleableSassVariant<V>>
  & AllHTMLAttributes<T & Element> // to avoid issues with different types within handler - covariant
  & Props<T>
  & RefAttributes<T>
  & HTMLComponentProps<T>
  & WithPolymorphicAs

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

const getSassVariantsFromProps =
  <K>({ variants, lookup: dict, ...props }: SassyDefinition<K>) => {
    const embeddedVariants = embeddedVariantsToRecord(variants as string[])
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
    }
  }

export interface RefForwarder<T = AnyStyledComponent> { forwardedRef?: Ref<T> }

export type StyledFunctionalComponentProps
  <Variants extends ToggleableSassVariant<Variants>, SCProps extends object, SCAttribs extends string> =
  & Partial<Variants>
  & Partial<SCProps>
  & Partial<UnionToRecord<SCAttribs>>
  & Partial<SassyComponent<Variants>>
  & RefForwarder

export type ComponentWithVariants = FunctionComponent<StyledFunctionalComponentProps<{}, {}, ''>>

export type InputComponent<P extends object, A extends string> =
  StyledComponent<StyledAs, any, P, A> | FunctionComponent<P>

const withDisplayName = <P>(component: FunctionComponent<P>, variants: string[]) => {
  component.displayName = variants[0]
  return component
}

// TODO combine these functions
export const styledWithVariants =
  <V extends Record<keyof V, boolean>>(lookup: StylesLookup<V>) =>
    <HTMLType = DOMAttributes<unknown>>(...variants: Array<keyof V>) =>
      <P extends object, A extends string>(component: InputComponent<P, A>):
        FunctionComponent<StyledFunctionalComponentProps<V, P, A> & Partial<HTMLType>> =>
        withDisplayName(
          memo((props) =>
            createElement(
              component as InputComponent<any, never>,
              getSassVariantsFromProps({ lookup, variants, ...props, ref: props.forwardedRef })
            )
          ), variants)

export const staticWithVariants =
  <V extends Record<keyof V, boolean>>(lookup: StylesLookup<V>) =>
    (...variants: Array<keyof V>) =>
      (component: keyof JSX.IntrinsicElements):
        FunctionComponent<Partial<V & RefForwarder<ComponentType>>> =>
        withDisplayName(
          memo((props) =>
            createElement(
              component,
              getSassVariantsFromProps({ lookup, variants, ...props, ref: props.forwardedRef })
            )
          ), variants)

export const withRefForwarding = <K>(Component: FunctionComponent<K>) =>
  forwardRef<AnyStyledComponent, K>((props, ref) =>
    createElement(Component, { ...props, forwardedRef: ref }))

export { AnyStyledComponent } from 'styled-components'