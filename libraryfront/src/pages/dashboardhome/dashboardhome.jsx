import styles from "./dashboardhome.module.css";
import { useEffect } from "react";

export default function DashboardHome(){
    useEffect(() => {
    async function fetchDashboard() {
      try {
        const token = localStorage.getItem("token");
        console.log(token);
        const res = await fetch("http://localhost:8000/api/dashboard", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Unauthorized");
        }
        const data = await res.json();
        console.log(data.user);
      } catch (err) {
        console.error(err.message);
      }
    }

    fetchDashboard();
    }, []);

    return(
        <>
        <div className={styles.nothing}>
            hi
        </div>
        </>
    )
}