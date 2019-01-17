import * as React from 'react'
import styled from 'styled-components'
import { withVariants } from '../src/withSass'

interface BEM {
  buttonBlock: boolean
  hasModifier: boolean
}

const CSS = { buttonBlock: 'buttonBlockStyle', hasModifier: 'hasModifierStyle' }

const withEmbeddedVariants =
  withVariants<BEM>(CSS)

const staticVariants = withVariants<BEM>(CSS)
const StaticButton = staticVariants('buttonBlock')('div')

const staticInstanceButton = <StaticButton><StaticButton>test</StaticButton></StaticButton>

const makeButton = withEmbeddedVariants('buttonBlock')
const makeButtonWithModifier = withEmbeddedVariants('buttonBlock', 'hasModifier')

const ButtonFromString = makeButton('button')

interface Props { extraProp1: boolean, extraProp2: boolean }
const ButtonFromJSX = makeButton((props: Props) => <button />)

const buttonFromStringInstance = <ButtonFromString hasModifier buttonBlock />
const buttonFromJSX = <ButtonFromJSX hasModifier buttonBlock extraProp1 extraProp2 />

const styledDivWithExtraProps = styled.div<{ extraAttr?: string } & BEM>`
  ${p => p.extraAttr}
  ${p => p.buttonBlock ? 'hasButtonStyle' : ''}
  ${p => p.hasModifier ? 'hasModifierStyle' : ''}
`

const ButtonWithExtraStyles = makeButton(styledDivWithExtraProps)

const buttonWithExtraStylesInstance = <ButtonWithExtraStyles
  as="abbr"
  extraAttr="test"
  hasModifier
  buttonBlock
/>

// #### CHILDREN
const buttonFromJSXWithLabel = <ButtonFromJSX>test label</ButtonFromJSX>
const buttonFromStringWithLabel = <ButtonFromString>test label</ButtonFromString>

const handlers = <ButtonFromJSX
  onClick={(e) => { }}
>test label</ButtonFromJSX>

// #### ERRORS

// $ExpectError
const errorInstance1 = <ButtonFromString notExistingProp />

// $ExpectError
const errorInstance2 = <ButtonFromJSX notExistingProp />

// $ExpectError
const errorInstance3 = <ButtonWithExtraStyles notExistingProp />
