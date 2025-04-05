import { createRef } from 'react'
import { Link, Outlet } from 'react-router-dom'
import s from './index.module.scss'
import Logo from '../../assets/images/logo.svg?react'
import { useMe } from '../../lib/ctx'
import {
  getAllPostsRoute,
  getCreatePostRoute,
  getSignOutRoute,
  getSignUpRoute,
  getUpdateProfileRoute,
} from '../../lib/routes'

export const layoutContentElRef = createRef<HTMLDivElement>()

export const Layout = () => {
  const me = useMe()
  return (
    <div className={s.layout}>
      <div className={s.navigation}>
        <Logo className={s.logo} />
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
                <Link className={s.link} to={getUpdateProfileRoute()}>
                  Мой профиль
                </Link>
              </li>
              <li className={s.item}>
                <Link className={s.link} to={getSignOutRoute()}>
                  Выйти ({me.nick})
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className={s.item}>
                <Link className={s.link} to={getSignOutRoute()}>
                  Войти
                </Link>
              </li>
              <li className={s.item}>
                <Link className={s.link} to={getSignUpRoute()}>
                  Регистрация
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
      <div className={s.content} ref={layoutContentElRef}>
        <Outlet />
      </div>
    </div>
  )
}
