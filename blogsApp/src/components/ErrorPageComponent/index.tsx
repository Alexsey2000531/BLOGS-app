import { Alert } from '../Alert'
import { Segment } from '../Segment'

export const ErrorPageComponent = ({
  title = 'УПС, ошибка!',
  message = 'Что-то пошло не так!',
}: {
  title?: string
  message?: string
}) => {
  return (
    <Segment title={title}>
      <Alert color="red">{message}</Alert>
    </Segment>
  )
}
