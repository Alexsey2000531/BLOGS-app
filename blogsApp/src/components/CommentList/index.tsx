import { trpc } from '../../lib/trpc'
import { format } from 'date-fns'
import s from './index.module.scss'

export const CommentsList = ({ postNick }: { postNick: string }) => {
  const { data, isLoading } = trpc.getPost.useQuery({ postNick })

  if (isLoading) {
    return <div>Загрузка комментариев...</div>
  }

  return (
    <div className={s.commentsList}>
      {data?.post?.Comments.map((comment) => (
        <div key={comment.id} className={s.comment}>
          <div className={s.commentHeader}>
            <span className={s.author}>{comment.author.nick}</span>
            <span className={s.date}>{format(new Date(comment.createdAt), 'dd.MM.yyyy HH:mm')}</span>
          </div>
          <div className={s.commentContent}>{comment.content}</div>
        </div>
      ))}
    </div>
  )
}
