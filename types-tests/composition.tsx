import * as React from 'react'
import { Primitives } from '../src/baseStyle'
import { withVariants } from '../src/withSass'

interface BEM {
  buttonBlock: boolean
  hasModifier: boolean
}

const CSS = { buttonBlock: 'buttonBlockStyle', hasModifier: 'hasModifierStyle' }

const staticVariants = withVariants<BEM>(CSS)
const Div = staticVariants('buttonBlock')(Primitives.div)

const DivWithAsAndBaseStylesAttached = <Div
  as="abbr"
  fontSize={10}
  onClick={(e) => { }}
  onMouseDown={(e => { })}
/>
