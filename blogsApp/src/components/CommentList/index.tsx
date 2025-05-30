import { getAvatarUrl } from '@BLOGS/shared/src/cloudinary'
import { format } from 'date-fns'
import s from './index.module.scss'
import { trpc } from '../../lib/trpc'

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
            <img width={40} height={40} className={s.avatar} alt="avatar" src={getAvatarUrl(null, 'small')} />
            <span className={s.author}>{comment.author.nick}</span>
            <span className={s.date}>{format(new Date(comment.createdAt), 'dd.MM.yyyy HH:mm')}</span>
          </div>
          <div className={s.commentContent}>{comment.content}</div>
        </div>
      ))}
    </div>
  )
}
