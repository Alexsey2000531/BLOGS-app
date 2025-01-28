import cn from 'classnames'
import s from './index.module.scss'

export type AlertProps = { color: 'red' | 'green'; hidden?: boolean; children: React.ReactNode }

export const Alert = ({ color, hidden, children }: AlertProps) => {
  if (hidden) {
    return null
  }

  return <div className={cn({ [s.alert]: true, [s[color]]: true })}>{children}</div>
}
