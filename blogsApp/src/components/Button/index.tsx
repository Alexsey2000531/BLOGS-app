import cn from 'classnames'
import React from 'react'
import { Link } from 'react-router-dom'
import s from './index.module.scss'

type ButtonColor = 'red' | 'green' | 'blue'
export type ButtonProps = {
  type?: 'submit' | 'button'
  children: React.ReactNode
  loading?: boolean
  color?: ButtonColor
  onClick?: () => void
  disabled?: boolean
}

export const Button = ({ type = 'submit', children, loading = false, color, onClick, disabled }: ButtonProps) => {
  return (
    <button
      className={cn({
        [s.button]: true,
        [s.disabled]: disabled || loading,
        [s.disabled]: loading,
        [s.loading]: loading,
        [s[`color-${color}`]]: true,
      })}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
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

export const Buttons = ({ children }: { children: React.ReactNode }) => {
  return <div className={s.buttons}>{children}</div>
}
