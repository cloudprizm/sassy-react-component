`sassy-react-component`
HOC to wrap typings and css modules as BEM styles within react component definition.
There are two variants, one based on `styled-components` second one, on simple html primitives.

to increase soundness of declarative approach, like so

```tsx
    <Button 
      isActive 
      isDanger 
      hasTextWarning 
      as="section"
    />

    <Button 
      p={10} 
      m={1} 
      isWarning 
      isLoading 
    />
```

### Some why`s