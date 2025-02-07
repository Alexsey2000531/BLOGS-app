import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AppContextProvider } from './lib/ctx'
import * as router from './lib/routes'
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
import './styles/global.scss'

export const App = () => {
  return (
    <HelmetProvider>
      <TrpcProvider>
        <AppContextProvider>
          <BrowserRouter>
            <Routes>
              <Route path={router.signOutRoute()} element={<SignOutPage />} />
              <Route element={<Layout />}>
                <Route path={router.getAllPostsRoute()} element={<AllPostsPage />} />
                <Route path={router.getCreatePostRoute()} element={<CreatePostPage />} />
                <Route path={router.getViewPostRoute(router.viewPostRouteParams)} element={<ViewPostPage />} />
                <Route path={router.getEditPostRoute(router.editPostRouteParams)} element={<EditPostPage />} />
                <Route path={router.updateProfileRoute()} element={<ProfilePage />} />
                <Route path={router.signInRoute()} element={<SignInPage />} />
                <Route path={router.signUpRoute()} element={<SignUpPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AppContextProvider>
      </TrpcProvider>
    </HelmetProvider>
  )
}
