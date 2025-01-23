import s from './index.module.scss'

export const FormItems = ({ children }: { children: React.ReactNode }) => {
  return <div className={s.formItems}>{children}</div>
}
