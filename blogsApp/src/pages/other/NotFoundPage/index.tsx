import s from './index.module.scss'
import notFoundImage from '../../../assets/images/404.png'
import { ErrorPageComponent } from '../../../components/ErrorPageComponent'

export const NotFoundPage = ({
  title = 'Страница не найдена!',
  message = 'Эта страница не существует!',
}: {
  title?: string
  message?: string
}) => {
  return (
    <ErrorPageComponent title={title} message={message}>
      <img className={s.image} src={notFoundImage} alt="Ошибка 404" />
    </ErrorPageComponent>
  )
}
