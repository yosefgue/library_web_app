import styles from './app.module.css'
import { Navigate, Outlet } from "react-router-dom";

export function App() {
  return (
    <>
      <div className={styles.parent}>
          <div className={styles.sidebar}>
              
          </div>
          <div className={styles.main}>
            <Outlet />
          </div>
      </div>
    </>
  )
}

export function ProtectedRoute() {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/signin" replace />;
}