import { Link, Outlet } from 'react-router-dom'
import { getAllPostsRoute, getCreatePostRoute, signUpRoute } from '../../lib/routes'
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
            <Link className={s.link} to={signUpRoute()}>
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
