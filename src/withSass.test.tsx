import * as React from 'react'
import renderer from 'react-test-renderer'

import { styledWithVariants } from './withSass'
import styled from 'styled-components'

type Style = 'asSth' | 'sthDifferent' | 'someBlockStyle'
type Props = { [k in Style]: boolean }

test('attach bulma variants and functional component with variant as props', () => {
  const withEmbeddedVariants = styledWithVariants<Props>({
    someBlockStyle: 'asButton-style',
    asSth: 'asSth-style',
    sthDifferent: 'sthDifferent-style'
  })

  const sassy = withEmbeddedVariants('someBlockStyle')
  const Button = sassy(styled.button``)
  const component = <Button
    className="existingCSSClassName"
    asSth
    sthDifferent
  />

  const tree = renderer.create(component).toJSON()
  expect(tree).toMatchSnapshot()
})