import { Alert } from '../Alert'
import { Segment } from '../Segment'

export const ErrorPageComponent = ({ title = 'Упс, Ошибка...', message }: { title?: string; message?: string }) => {
  return (
    <Segment title={title}>
      <Alert color="red">{message}</Alert>
    </Segment>
  )
}
