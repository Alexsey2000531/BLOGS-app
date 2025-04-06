import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AppContextProvider } from './lib/ctx'
import * as router from './lib/routes'
import { SentryUser } from './lib/sentry.tsx'
import { TrpcProvider } from './lib/trpc'
import { ProfilePage } from './pages/auth/profilePage'
import { SignInPage } from './pages/auth/signInPage'
import { SignOutPage } from './pages/auth/signOutPage'
import { SignUpPage } from './pages/auth/signUpPage'
import { NotFoundPage } from './pages/other/NotFoundPage'
import { AllPostsPage } from './pages/posts/AllPostsPage'
import { CreatePostPage } from './pages/posts/CreatePostPage'
import { EditPostPage } from './pages/posts/EditPostPage'
import { ViewPostPage } from './pages/posts/ViewPostPage'
import './lib/sentry'
import './styles/global.scss'

export const App = () => {
  return (
    <HelmetProvider>
      <TrpcProvider>
        <AppContextProvider>
          <BrowserRouter>
            <SentryUser />
            <Routes>
              <Route path={router.getSignOutRoute.definition} element={<SignOutPage />} />
              <Route element={<Layout />}>
                <Route path={router.getAllPostsRoute.definition} element={<AllPostsPage />} />
                <Route path={router.getCreatePostRoute.definition} element={<CreatePostPage />} />
                <Route path={router.getViewPostRoute.definition} element={<ViewPostPage />} />
                <Route path={router.getEditPostRoute.definition} element={<EditPostPage />} />
                <Route path={router.getUpdateProfileRoute.definition} element={<ProfilePage />} />
                <Route path={router.getSignInRoute.definition} element={<SignInPage />} />
                <Route path={router.getSignUpRoute.definition} element={<SignUpPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AppContextProvider>
      </TrpcProvider>
    </HelmetProvider>
  )
}
