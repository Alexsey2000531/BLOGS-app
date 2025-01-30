import Cookies from 'js-cookie'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInRoute } from '../../../lib/routes'
import { trpc } from '../../../lib/trpc'

export const SignOutPage = () => {
  const navigate = useNavigate()
  const trpcUtils = trpc.useContext()
  useEffect(() => {
    Cookies.remove('token')
    void trpcUtils.invalidate().then(() => {
      void navigate(signInRoute(), { replace: true })
    })
  }, [navigate])

  return <p>Loading...</p>
}
