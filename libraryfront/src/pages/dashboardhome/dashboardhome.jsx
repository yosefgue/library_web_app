// import styles from "./dashboardhome.module.css";
import { useOutletContext } from "react-router-dom";

export default function DashboardHome(){
    const { userdata } = useOutletContext();
    console.log(userdata)
    return(
        <>
        </>
    )
}