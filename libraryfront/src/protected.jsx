import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";


export default function ProtectedRoute() {
  const [status, setStatus ] = useState("loading");
  const [userdata, setUserdata] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Unauthorized")
        }
        const res = await fetch("http://localhost:8000/api/dashboard", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!res.ok) {
         throw new Error("Unauthorized")
        }
        const data = await res.json();
        setUserdata(data.user);
        setStatus("ok");
      } catch (err) {
        console.error(err.message);
        localStorage.removeItem("token");
        setStatus("unauthorized");
      }
    }

    checkAuth();
    }, []);
  if (status === "loading" || !userdata) return null;
  return status === "ok" ? <Outlet context={{ userdata }} /> : <Navigate to="/signup" replace />;
}