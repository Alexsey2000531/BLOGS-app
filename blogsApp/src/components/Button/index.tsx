import cn from 'classnames'
import { Link } from 'react-router-dom'
import s from './index.module.scss'

type ButtonColor = 'red' | 'green' | 'blue'
export type ButtonProps = { children: React.ReactNode; loading?: boolean; color?: ButtonColor }

export const Button = ({ children, loading = false, color }: ButtonProps) => {
  return (
    <button
      className={cn({ [s.button]: true, [s.disabled]: loading, [s.loading]: loading, [s[`color-${color}`]]: true })}
      type="submit"
      disabled={loading}
    >
      <span className={s.text}>{children}</span>
    </button>
  )
}

export const LinkButton = ({
  children,
  to,
  color = 'green',
}: {
  children: React.ReactNode
  to: string
  color?: ButtonColor
}) => {
  return (
    <Link to={to} className={cn({ [s.button]: true, [s[`color-${color}`]]: true })}>
      {children}
    </Link>
  )
}
