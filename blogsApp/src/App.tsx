import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AppContextProvider } from './lib/ctx'
import * as router from './lib/routes'
import { TrpcProvider } from './lib/trpc'
import { AllPostsPage } from './pages/AllPostsPage'
import { CreatePostPage } from './pages/CreatePostPage'
import { EditPostPage } from './pages/EditPostPage'
import { ViewPostPage } from './pages/ViewPostPage'
import './styles/global.scss'
import { SignInPage } from './pages/signInPage'
import { SignOutPage } from './pages/signOutPage'
import { SignUpPage } from './pages/signUpPage'

export const App = () => {
  return (
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
              <Route path={router.signInRoute()} element={<SignInPage />} />
              <Route path={router.signUpRoute()} element={<SignUpPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppContextProvider>
    </TrpcProvider>
  )
}
