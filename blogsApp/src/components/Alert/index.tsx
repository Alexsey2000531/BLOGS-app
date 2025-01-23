import cn from 'classnames'
import s from './index.module.scss'

export const Alert = ({ color, children }: { color: 'red' | 'green'; children: React.ReactNode }) => {
  return <div className={cn({ [s.alert]: true, [s[color]]: true })}>{children}</div>
}
