import styles from "./home.module.css"
import { IconSearch } from '@tabler/icons-react';
import { TextInput, Button, Anchor } from '@mantine/core';
import { Link } from "react-router-dom";

export default function Home(){
    
    return (
        <div className={styles.parent}>
            <Header />
            <div className={styles.main}>
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

            </div>
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