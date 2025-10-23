import { LockIcon } from '@sanity/icons'
import { Box, Text, TextInput, Tooltip } from '@sanity/ui'
import { uuid } from '@sanity/uuid'
import get from 'lodash.get'
import React, { forwardRef } from 'react'
import { StringInputProps } from 'sanity'

type Props = StringInputProps & {
  schemaType: {
    options?: {
      field?: string
    }
  }
}

const ProxyString = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const {
    elementProps,
    schemaType
  } = props

  // Access document from props
  const document = (props as any).document

  const path = schemaType?.options?.field
  const proxyValue = get(document, path)

  const inputId = uuid()

  return (
    <Tooltip
      content={
        <Box padding={2}>
          <Text muted size={1}>
            This value is set in Shopify (<code>{path}</code>)
          </Text>
        </Box>
      }
      portal
    >
      <TextInput
        {...elementProps}
        iconRight={LockIcon}
        id={inputId}
        readOnly={true}
        ref={ref}
        value={proxyValue || ''}
      />
    </Tooltip>
  )
})

ProxyString.displayName = 'ProxyString'

export default ProxyString