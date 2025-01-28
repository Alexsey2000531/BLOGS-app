import cn from 'classnames'
import { Link } from 'react-router-dom'
import s from './index.module.scss'

export const Button = ({ children, loading = false }: { children: React.ReactNode; loading?: boolean }) => {
  return (
    <button className={cn({ [s.button]: true, [s.disabled]: loading })} type="submit" disabled={loading}>
      {loading ? 'Отправка...' : children}
    </button>
  )
}

export const LinkButton = ({ children, to }: { children: React.ReactNode; to: string }) => {
  return (
    <Link to={to} className={s.editButton}>
      {children}
    </Link>
  )
}
