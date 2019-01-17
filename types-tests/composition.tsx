import * as React from 'react'
import { Primitives } from '../src/baseStyle'
import { withVariants } from '../src/withSass'

interface BEM {
  buttonBlock: boolean
  hasModifier: boolean
}

const CSS = { buttonBlock: 'buttonBlockStyle', hasModifier: 'hasModifierStyle' }

const staticVariants = withVariants<BEM>(CSS)
const StaticButton = staticVariants('buttonBlock')(Primitives.div)

const UsingAsAndBaseStyles = <StaticButton
  as="abbr"
  fontSize={10}
/>
