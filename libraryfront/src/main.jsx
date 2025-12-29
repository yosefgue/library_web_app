import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider } from "@mantine/core";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import '@mantine/core/styles.css';
import './index.css'

import Home from './pages/home/home.jsx'
import Signin from './pages/signin/signin.jsx'
import Signup from './pages/signup/signup.jsx'
import Plan from './pages/plan/plan.jsx'
import { ProtectedRoute, App } from './App.jsx';
import DashboardHome from './pages/dashboardhome/dashboardhome.jsx';


let router = createBrowserRouter([
  { path: "/", element: <Home />, },
  { path: "/signin", element: <Signin />, },
  { path: "/signup", element: <Signup />, },
  { path: "/plan", element: <Plan />, },
  {
    path: "/dashboard",
    element: <ProtectedRoute />,
    children: [
      {
        element: <App />,
        children: [
          {index: true, element: <DashboardHome/>},
        ]
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider>
      <RouterProvider router={router} />
    </MantineProvider>
  </StrictMode>
)