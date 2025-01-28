import { Link, Outlet } from 'react-router-dom'
import { getAllPostsRoute, getCreatePostRoute, signInRoute, signOutRoute, signUpRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'
import s from './index.module.scss'

export const Layout = () => {
  const { data, isLoading, isFetching, isError } = trpc.getMe.useQuery()
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
          {isLoading || isFetching || isError ? null : data.me ? (
            <>
              <li className={s.item}>
                <Link className={s.link} to={getCreatePostRoute()}>
                  Создать пост
                </Link>
              </li>
              {/* <li className={s.item}>
                <Link className={s.link} to={getEditPostRoute({ postNick: post })}>
                  Редактировать пост
                </Link>
              </li> */}
              <li className={s.item}>
                <Link className={s.link} to={signOutRoute()}>
                  Выйти ({data.me.nick})
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
