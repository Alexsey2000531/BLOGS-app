import React from 'react'
import s from './index.module.scss'

export const Segment = ({
  title,
  size = 1,
  description,
  children,
}: {
  title: React.ReactNode
  size?: 1 | 2
  description?: string
  children?: React.ReactNode
}) => {
  return (
    <div className={s.segment}>
      {size === 1 ? <h1 className={s.title}>{title}</h1> : <h2 className={s.title}>{title}</h2>}
      {description && <p className={s.description}>{description}</p>}
      {children && <div className={s.content}>{children}</div>}
    </div>
  )
}
