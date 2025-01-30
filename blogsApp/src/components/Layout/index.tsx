import { Link, Outlet } from 'react-router-dom'
import { useMe } from '../../lib/ctx'
import {
  getAllPostsRoute,
  getCreatePostRoute,
  signInRoute,
  signOutRoute,
  signUpRoute,
  updateProfileRoute,
} from '../../lib/routes'
import s from './index.module.scss'

export const Layout = () => {
  const me = useMe()
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
          {me ? (
            <>
              <li className={s.item}>
                <Link className={s.link} to={getCreatePostRoute()}>
                  Создать пост
                </Link>
              </li>
              <li className={s.item}>
                <Link className={s.link} to={updateProfileRoute()}>
                  Мой профиль
                </Link>
              </li>
              <li className={s.item}>
                <Link className={s.link} to={signOutRoute()}>
                  Выйти ({me.nick})
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className={s.item}>
                <Link className={s.link} to={signInRoute()}>
                  Войти
                </Link>
              </li>
              <li className={s.item}>
                <Link className={s.link} to={signUpRoute()}>
                  Регистрация
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
      <div className={s.content}>
        <Outlet />
      </div>
    </div>
  )
}
