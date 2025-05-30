import { MessageOutlined, FormOutlined, UserOutlined } from '@ant-design/icons'
import { createRef } from 'react'
import { Link, Outlet } from 'react-router-dom'
import s from './index.module.scss'
import Logo from '../../assets/images/blog.png'
import Exit from '../../assets/images/exit.png'
import Registration from '../../assets/images/registration.png'
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
        <img src={Logo} className={s.logo} alt="Логотип" />
        <ul className={s.menu}>
          <li className={s.item}>
            <Link className={s.link} to={getAllPostsRoute()}>
              <MessageOutlined />
              Все посты
            </Link>
          </li>
          {me ? (
            <>
              <li className={s.item}>
                <Link className={s.link} to={getCreatePostRoute()}>
                  <FormOutlined />
                  Создать пост
                </Link>
              </li>
              <li className={s.item}>
                <Link className={s.link} to={getUpdateProfileRoute()}>
                  <UserOutlined />
                  Мой профиль
                </Link>
              </li>
              <li className={s.item}>
                <Link className={s.link} to={getSignOutRoute()}>
                  <img style={{ color: '#fff' }} width={20} height={20} src={Exit} alt="Выход" />
                  Выйти ({me.nick})
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className={s.item}>
                <Link className={s.link} to={getSignOutRoute()}>
                  <img style={{ color: '#fff' }} width={20} height={20} src={Exit} alt="Выход" />
                  Войти
                </Link>
              </li>
              <li className={s.item}>
                <Link className={s.link} to={getSignUpRoute()}>
                  <img style={{ color: '#fff' }} width={20} height={20} src={Registration} alt="Выход" />
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
