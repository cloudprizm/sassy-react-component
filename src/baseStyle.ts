import styled, { ThemedStyledFunction } from 'styled-components'
import { ComponentType } from 'react'

import {
  FontSizeProps,
  FontWeightProps,
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
  & (WidthProps & MinWidthProps & MinHeightProps)

export const baseStyles = <K = BaseStyle>(props: K) => compose(
  space,
  compose(fontSize, fontWeight, lineHeight),
  compose(border, borderRadius),
  compose(width, minHeight, minWidth),
)

export const toStyledGenericFromStringOrJSX =
  <P>(component: keyof JSX.IntrinsicElements | ComponentType<P>) =>
    styled(component) <BaseStyle & P>`${baseStyles}`

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