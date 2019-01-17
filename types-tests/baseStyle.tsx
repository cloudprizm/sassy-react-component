import * as React from 'react'
import { Primitives } from '../src/baseStyle'

const primitiveInitialization = <Primitives.div as="abbr" />
const primitiveWithProps = <Primitives.div fontSize={10} />

// $ExpectError
const notExistingPropOnDiv = <Primitives.div fontSize2={10} />
