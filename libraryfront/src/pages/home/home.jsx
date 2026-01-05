import styles from "./home.module.css"
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { IconSearch } from '@tabler/icons-react';
import { TextInput, Button, Anchor } from '@mantine/core';
import { Link, useNavigate } from "react-router-dom";

export function Home(){
    
    return (
        <div className={styles.parent}>
            <Header />
            <div className={styles.main}>
                <Outlet />
            </div>
        </div>
    )
}

function Header(){
    const [q, setQ] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        const keyword = q.trim();
        if (!keyword) return;
        navigate(`/search?q=${encodeURIComponent(keyword)}`);
  };
    return (
        <div className={styles.header}>
            <div className={styles.leftsection}>
                <Link to="/">
                    <img className={styles.logo} src="/logo.svg" alt="logo"/>
                </Link>
                <div className={styles.searchbar}>
                    <form onSubmit={handleSearch}>
                        <TextInput size="md" type="search" placeholder="Search Books" 
                        leftSection={<IconSearch size={18}/>} leftSectionPointerEvents="none"
                        value={q} onChange={(e) => setQ(e.currentTarget.value)}
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

export function HomeContent(){
    return (
        <div className={styles.herosection}>
            <div className={styles.heroleft}>
                <div>
                    <h1 className={styles.herotitle}>Discover Your Next Favorite Book</h1>
                    <p className={styles.herosubtitle}>Explore a world of stories, ideas, and knowledge all in one place. From bestselling novels to inspiring nonfiction, our collection is carefully selected to help you find the perfect book for every moment.</p>
                </div>
                <Button component={Link} to="/signup" className={styles.herobutton} variant="filled">Get Started</Button>
            </div>
            <div className={styles.heroright}>
                <img src="/hero.jpg" alt="hero"/>
            </div>
        </div>
    )
}