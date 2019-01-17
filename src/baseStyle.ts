import styled, { ThemedStyledFunction, StyledComponentProps } from 'styled-components'
import { ComponentType, FunctionComponent } from 'react'

import {
  FontSizeProps,
  FontWeightProps,
  zIndex,
  ZIndexProps,
  LineHeightProps,
  compose,
  SpaceProps,
  BorderRadiusProps,
  BorderProps,
  fontSize,
  fontWeight,
  WidthProps,
  MinWidthProps,
  MinHeightProps,
  width,
  minHeight,
  minWidth,
  lineHeight,
  space,
  borderRadius,
  border,
} from 'styled-system'

export type BaseStyle =
  & FontSizeProps
  & FontWeightProps
  & LineHeightProps
  & SpaceProps
  & BorderRadiusProps
  & BorderProps
  & ZIndexProps
  & (WidthProps & MinWidthProps & MinHeightProps)

export const baseStyles = <K = BaseStyle>(props: K) => compose(
  space,
  zIndex,
  compose(fontSize, fontWeight, lineHeight),
  compose(border, borderRadius),
  compose(width, minHeight, minWidth),
)

type InputComponent<P> = keyof JSX.IntrinsicElements | ComponentType<P>

interface WithPolymorphicAs {
  as?: keyof JSX.IntrinsicElements
}

type StyledComponentWithBaseStyleAttached<P> = FunctionComponent<
  & P
  & BaseStyle
  & StyledComponentProps<InputComponent<P>, BaseStyle, never, never>
  & WithPolymorphicAs // styled-components does not export variant with as
  >

export const toStyledGenericFromStringOrJSX =
  <P>(component: InputComponent<P>) =>
    styled(component)<P & BaseStyle>`${baseStyles}` as StyledComponentWithBaseStyleAttached<P>

export const toStyledGenericFromStyledFunction =
  <C extends object,
    P extends object,
    K extends string,
    >(component: ThemedStyledFunction<any, C, P, K>) =>
    component<BaseStyle>`${baseStyles}` as StyledComponentWithBaseStyleAttached<P>

export const div = toStyledGenericFromStringOrJSX('div')
export const section = toStyledGenericFromStringOrJSX('section')
export const span = toStyledGenericFromStringOrJSX('span')
export const label = toStyledGenericFromStringOrJSX('label')
export const button = toStyledGenericFromStringOrJSX('button')
export const a = toStyledGenericFromStringOrJSX('a')
export const form = toStyledGenericFromStringOrJSX('form')

export const Primitives = {
  div,
  span,
  label,
  button,
  form,
  a,
  section
}

export const extendComponent = styled