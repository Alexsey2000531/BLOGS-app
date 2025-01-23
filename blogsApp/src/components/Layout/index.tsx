import { Link, Outlet } from 'react-router-dom'
import { getAllPostsRoute, getCreatePostRoute } from '../../lib/routes'
import s from './index.module.scss'

export const Layout = () => {
  return (
    <div className={s.layout}>
      <div className={s.navigation}>
        <div className={s.logo}>BLOGS</div>
        <ul className={s.menu}>
          <li className={s.item}>
            <Link className={s.link} to={getAllPostsRoute()}>
              Все посты
            </Link>
          </li>
          <li className={s.item}>
            <Link className={s.link} to={getCreatePostRoute()}>
              Создать пост
            </Link>
          </li>
          <li className={s.item}>
            <Link className={s.link} to={getCreatePostRoute()}>
              Редактировать пост
            </Link>
          </li>
          <li className={s.item}>
            <Link className={s.link} to={getCreatePostRoute()}>
              Мои посты
            </Link>
          </li>
          <li className={s.item}>
            <Link className={s.link} to={getCreatePostRoute()}>
              Понравившиеся посты
            </Link>
          </li>
          <li className={s.itemBottom}>
            <Link className={s.link} to={getCreatePostRoute()}>
              Мой профиль
            </Link>
          </li>
          <li className={s.item}>
            <Link className={s.link} to={getCreatePostRoute()}>
              Войти
            </Link>
          </li>
          <li className={s.item}>
            <Link className={s.link} to={getCreatePostRoute()}>
              Регистрация
            </Link>
          </li>
        </ul>
      </div>
      <div className={s.content}>
        <Outlet />
      </div>
    </div>
  )
}
