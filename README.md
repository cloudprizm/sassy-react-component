`sassy-react-component`
===

Allow to define `BEM` like attributes on your react components.
There is no need to used `className` attribute or concatenate styles manually - all happen under the hood when defining component.

### Why
* one way to define any `sass` components for `react1 with type-checking
* to improve soundness and correctness of defined components with easy ability to catch the bug
* creating `styled-component` from scratch is ok when you starting green field project but for me it is not necessary effort since there is a lot of `sass` frameworks out there ready for modification, so `sass` framework provide a `base` component and `styled-components` some context related overriding with correct isolation.

### Implementation details
This is high order component to wrap typings and css modules and provide them as BEM-ish component.
There are two variants, one based on `styled-components` second one, on simple html primitives.

### Example
```tsx
    <Button 
      isActive        // button property 
      isDanger        // button property 
      hasTextWarning  // modifiers property
      as="section"    // styled-component property
    />

    <Button 
      p={10}          // styled-system property
      m={1}           // styled-system property
      isWarning       // button property 
      isLoading       // button property 
    />
```

### Some why`s

### Component definition from scratch

#### Button
```ts
// styled-components are used to define primitives
import styled from 'styled-components'

// apply styled-system features - handling padding, margins
import {
  styledWithVariants,
  toStyledGenericFromStringOrJSX,
  toStyledGenericFromStyledFunction
} from '@hungry/sassy-react-component'

// bulma modifiers helpers to make modifiers reachable from button perspective
import { WithModifiers, combineCSSWithModifiers } from './modifiers'

// css-modules
import CSS, { BEM } from './Button.sass'

// make styles lookup for bulma-modifiers and button - cascading augmentation
const withEmbeddedVariants =
  styledWithVariants<WithModifiers<BEM>>(
    combineCSSWithModifiers(CSS))

// define BEM blocks factory with lookup attached
export const makeButton = withEmbeddedVariants('button')

// provide specific implementation by wrapping styled-component primitive
export const Button = makeButton(
  toStyledGenericFromStringOrJSX('button'))

export const SubmitButton = makeButton(
  toStyledGenericFromStyledFunction(
    styled
      .button
      .attrs({ type: 'submit' })))
```