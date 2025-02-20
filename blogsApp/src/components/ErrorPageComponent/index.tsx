import React from 'react'
import { Alert } from '../Alert'
import { Segment } from '../Segment'

export const ErrorPageComponent = ({
  title = 'Упс, Ошибка...',
  message,
  children,
}: {
  title?: string
  message?: string
  children?: React.ReactNode
}) => {
  return (
    <Segment title={title}>
      <Alert color="red">{message}</Alert>
      {children}
    </Segment>
  )
}
