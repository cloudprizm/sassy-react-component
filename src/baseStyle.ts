import styled, { ThemedStyledFunction } from 'styled-components'
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

// INFO typechecking is failing when using styled<P & BaseStyle>(component) investigate
// or StyledComponent<InputComponent<P>, T, BaseStyle
export const toStyledGenericFromStringOrJSX =
  <P>(component: InputComponent<P>) =>
    styled(component)`${baseStyles}` as FunctionComponent<P & BaseStyle>

export const toStyledGenericFromStyledFunction =
  <C extends object,
    P extends object,
    K extends string | number | symbol,
    >(component: ThemedStyledFunction<any, C, P, K>) =>
    component<BaseStyle>`${baseStyles}` 

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