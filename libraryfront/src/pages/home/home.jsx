import styles from "./home.module.css"
import { IconSearch } from '@tabler/icons-react';
import { TextInput, Button, Anchor } from '@mantine/core';
import { Link } from "react-router-dom";

export default function Home(){
    return (
        <div className={styles.parent}>
            <Header />
        </div>
    )
}

function Header(){
    return (
        <div className={styles.header}>
            <div className={styles.leftsection}>
                <img className={styles.logo} src="/logo.svg" alt="logo"/>
                <div className={styles.searchbar}>
                    <form>
                        <TextInput size="md" type="search" placeholder="Search Books ..." 
                        leftSection={<IconSearch size={18}/>} leftSectionPointerEvents="none"
                        />
                    </form>
                </div>
            </div>
            <div className={styles.rightsection}>
                <Anchor component={Link} to="/plan" underline="hover">Plan</Anchor>
                <Anchor component={Link} to="/signin" underline="hover">Sign In</Anchor>
                <Button component={Link} to="/signup" size="md" variant="filled">Sign Up</Button>
            </div>
        </div>
    )
}