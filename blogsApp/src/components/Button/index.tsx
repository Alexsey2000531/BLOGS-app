import cn from 'classnames'
import s from './index.module.scss'

export const Button = ({ children, loading = false }: { children: React.ReactNode; loading?: boolean }) => {
  return (
    <button className={cn({ [s.button]: true, [s.disabled]: loading })} type="submit" disabled={loading}>
      {loading ? 'Отправк...' : children}
    </button>
  )
}
