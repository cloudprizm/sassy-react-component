import styled, { ThemedStyledFunction, ThemedStyledProps } from 'styled-components'
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

export type ToStyledInput<P> = keyof JSX.IntrinsicElements | ComponentType<P>

export interface WithPolymorphicAs {
  as?: keyof JSX.IntrinsicElements
}

export type StyledComponentWithBaseStyleAttached<P, T> = FunctionComponent<
  & P
  & BaseStyle
  & ThemedStyledProps<P, T>
  & WithPolymorphicAs // styled-components does not export variant with as
>

export const toStyledGenericFromStringOrJSX =
  <T, P>(component: ToStyledInput<P>) =>
    styled(component) <P & BaseStyle>`${baseStyles}` as StyledComponentWithBaseStyleAttached<P, T>

export const toStyledGenericFromStyledFunction =
  <T, C extends object,
    P extends object,
    K extends string,
    >(component: ThemedStyledFunction<any, C, P, K>) =>
    component<BaseStyle>`${baseStyles}` as StyledComponentWithBaseStyleAttached<P, T>

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