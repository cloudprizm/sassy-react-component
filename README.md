`sassy-react-component`
===

Allow to define `BEM` like attributes on your `react` components.
There is no need to used `className` attribute or concatenate styles at all - all magic happen inside.

Real world example [`@hungry/bulma-element`](https://github.com/hungry-consulting/bulma-element).

[Docs](https://hungry-consulting.github.io/sassy-react-component/)

### Why
* one way to define any `sass` component for `react` with type-checking
* improve soundness and correctness of defined components with easy ability to detect changes between `sass` and `typescript` (to catch bug easily)
* creating `styled-component` from scratch is ok when you starting green field project but for me it is not necessary effort since there is a lot of `sass` frameworks out there ready for modification, so `sass` framework provide a `base` component and `styled-components` some context related overriding with correct isolation.

### Implementation details
This is high order component to wrap typings and css modules and provide them as BEM-ish component.
There are two variants, one based on `styled-components` second one, on simple html primitives.

## Examples

### Usage
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


### Implementation
#### Button - `single component`

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

// make styles lookup for bulma-modifiers and button - "Cascading"SS augmentation
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

#### Notification - `compound component`

```ts
import {
  styledWithVariants,
  toStyledGenericFromStringOrJSX,
  div
} from '@hungry/sassy-react-component'

import { combineCSSWithModifiers, WithModifiers } from './modifiers'

import CSS, { BEM } from './Notification.sass'

const asBulmaVariant =
  styledWithVariants<WithModifiers<BEM >>(
    combineCSSWithModifiers(CSS))

const Block =
  asBulmaVariant('notification')
    (div)

const DeleteButton =
  asBulmaVariant('button', 'isDelete', 'delete')
    (toStyledGenericFromStringOrJSX('button'))

const Title =
  asBulmaVariant('title')
    (div)

const Subtitle =
  asBulmaVariant('subtitle')
    (div)

const Content =
  asBulmaVariant('content')
    (div)

export const Notification = {
  Block,
  DeleteButton,
  Title,
  Subtitle,
  Content
}
```

#### `styled-system` support
To provide some basic css alteration, like changing `padding` or `margin`, you can leverage `styled-system` integration. `sassy-react-component` comes with basic support from [`styled-system`](https://github.com/jxnblk/styled-system) and enables following properties [`space`](https://github.com/jxnblk/styled-system/blob/master/docs/api.md#space), [`fontSize, fontWeight, lineHeight`](https://github.com/jxnblk/styled-system/blob/master/docs/api.md#fontsize), [`border, borderRadius`](https://github.com/jxnblk/styled-system/blob/master/docs/api.md#borders), [`width, minHeight, minWidth`](https://github.com/jxnblk/styled-system/blob/master/docs/api.md#width).

##### If you encounter some performance issues
It happen to me when I was rendering `bulma-calendar` even with `withMemo` enabled, so if there is no need to make any runtime modification you can make fully static component, to do so, instead of using `styledWithVariants` go with `staticWithVariants` function instead.