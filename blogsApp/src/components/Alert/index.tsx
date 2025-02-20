import cn from 'classnames'
import React from 'react'
import s from './index.module.scss'

export type AlertProps = { color: 'red' | 'green' | 'brown'; hidden?: boolean; children: React.ReactNode }

export const Alert = ({ color, hidden, children }: AlertProps) => {
  if (hidden) {
    return null
  }

  return <div className={cn({ [s.alert]: true, [s[color]]: true })}>{children}</div>
}
