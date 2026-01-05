import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider } from "@mantine/core";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import '@mantine/core/styles.css';
import './index.css'
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { Home, HomeContent } from './pages/home/home.jsx'
import Signin from './pages/signin/signin.jsx'
import Signup from './pages/signup/signup.jsx'
import Plan from './pages/plan/plan.jsx'
import AppLayout from './applayout.jsx';
import ProtectedRoute from './protected.jsx'
import DashboardHome from './pages/dashboardhome/dashboardhome.jsx';
import MyBooks from './pages/dashboardmybooks/mybooks.jsx';
import Favorites from './pages/dashboardfavorites/favorites.jsx';
import SearchPage from './pages/dashboardsearch/search.jsx';
import Reader from './pages/dashboardread/reader.jsx';
import Category from './pages/dashboardcategories/category.jsx';
import VisitorSearchPage from './pages/visitorsearch/visitorsearch.jsx';


let router = createBrowserRouter([
  { path: "/", element: <Home />, 
    children: [
      {index: true, element: <HomeContent />},
      {path: "search", element: <VisitorSearchPage />},
    ]
  },
  { path: "/signin", element: <Signin />, },
  { path: "/signup", element: <Signup />, },
  { path: "/plan", element: <Plan />, },
  {
    path: "/dashboard", element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {index: true, element: <DashboardHome />},
          {path: "mybooks", element: <MyBooks />},
          {path: "favorites", element: <Favorites />},
          {path: "search", element: <SearchPage />},
          {path: "read", element: <Reader />},
          {path: "categories", element: <Category />},

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