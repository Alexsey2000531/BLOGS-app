import cn from 'classnames'
import s from './index.module.scss'

export const Loader = ({ type }: { type: 'page' | 'section' }) => {
  return <span className={cn({ [s.loader]: true, [s[`type-${type}`]]: true })} />
}
