import { createElement } from 'react'
import { type IconBaseProps } from 'react-icons'
import { AiOutlineLike, AiFillLike, AiOutlineDislike, AiFillDislike } from 'react-icons/ai'

const icons = {
  likeEmpty: AiOutlineLike,
  likeFilled: AiFillLike,
  dislikeEmpty: AiOutlineDislike,
  dislikeFilled: AiFillDislike,
}

export const Icon = ({ name, ...restProps }: { name: keyof typeof icons } & IconBaseProps) => {
  return createElement(icons[name], restProps)
}
