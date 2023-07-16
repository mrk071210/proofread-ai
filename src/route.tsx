import React from 'react'
// import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
// import { useAuth } from './components/Auth/authProvider'
import { ProtectedRoute } from './components/Auth/ProtectedRoute'

import Login from './pages/Login/containers'
import Proofread from './pages/Proofread/containers'

// export default function Router () {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/profread" element={<Proofread />} />
//       </Routes>
//     </BrowserRouter>
//   )
// }

const Routes = () => {
  // const { token } = useAuth()
  // 路由配置
  const routesForPublic = [
    {
      path: '/login',
      element: <Login />
    }
  ]
  const routesForAuthenticatedOnly = [
    {
      path: '/',
      element: <ProtectedRoute />,
      children: [
        {
          path: '/proofread',
          element: <Proofread />
        }
      ]
    }
  ]
  // const routesForNotAuthenticatedOnly = [
  //   {
  //     path: '/login',
  //     element: <Login />
  //   }
  // ]

  const router = createBrowserRouter([
    ...routesForPublic,
    // ...(!token ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly
  ])

  return <RouterProvider router={router} />
}

export default Routes
