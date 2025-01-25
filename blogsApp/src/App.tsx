import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import * as router from './lib/routes'
import { TrpcProvider } from './lib/trpc'
import { AllPostsPage } from './pages/AllPostsPage'
import { CreatePostPage } from './pages/CreatePostPage'
import { ViewPostPage } from './pages/ViewPostPage'
import './styles/global.scss'
import { SignUpPage } from './pages/signUpPage'

export const App = () => {
  return (
    <TrpcProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path={router.getAllPostsRoute()} element={<AllPostsPage />} />
            <Route path={router.getCreatePostRoute()} element={<CreatePostPage />} />
            <Route path={router.getViewPostRoute(router.viewPostRouteParams)} element={<ViewPostPage />} />
            <Route path={router.signUpRoute()} element={<SignUpPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TrpcProvider>
  )
}
