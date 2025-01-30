import { ErrorPageComponent } from '../../../components/ErrorPageComponent'

export const NotFoundPage = ({
  title = 'Страница не найдена!',
  message = 'Эта страница не существует!',
}: {
  title?: string
  message?: string
}) => {
  return <ErrorPageComponent title={title} message={message} />
}
