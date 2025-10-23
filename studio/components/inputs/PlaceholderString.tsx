import { TextInput } from '@sanity/ui'
import { uuid } from '@sanity/uuid'
import get from 'lodash.get'
import React, { forwardRef, useCallback } from 'react'
import { ObjectInputProps, set, unset, StringInputProps } from 'sanity'

type Props = StringInputProps & {
  schemaType: {
    options?: {
      field?: string
    }
  }
}

const PlaceholderStringInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const {
    elementProps,
    onChange,
    schemaType,
    validation,
    value
  } = props

  // Access document from props
  const document = (props as any).document

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.currentTarget.value

      // if the value exists, set the data, if not, unset the data
      onChange(inputValue ? set(inputValue) : unset())
    },
    [onChange]
  )

  const proxyValue = get(document, schemaType?.options?.field)
  const inputId = uuid()

  return (
    <TextInput
      {...elementProps}
      defaultValue={value}
      id={inputId}
      onChange={handleChange}
      placeholder={proxyValue}
      ref={ref}
    />
  )
})

PlaceholderStringInput.displayName = 'PlaceholderStringInput'

export default PlaceholderStringInput