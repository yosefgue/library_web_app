import styles from "./shell.module.css"
import { IconSearch } from '@tabler/icons-react';
import { TextInput, Button } from '@mantine/core';

export default function Shell(){
    return (
        <div className={styles.parent}>
            <div className={styles.sidebar}>
                <img className={styles.logo} src="public/logo.svg" alt="logo"/>
            </div>
            <div className={styles.main}>
                <div className={styles.header}>
                    <div className={styles.searchbar}>
                        <form>
                            <TextInput size="md" type="search" placeholder="Search Books ..." 
                            leftSection={<IconSearch size={18}/>} leftSectionPointerEvents="none"
                            />
                        </form>
                    </div>
                    <Button size="md" variant="filled">Sign In</Button>
                </div>

            </div>
        </div>
    )
}