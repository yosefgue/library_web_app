import styles from './applayout.module.css'
import { Outlet, useOutletContext } from "react-router-dom";
import { useState } from "react";
import { NavLink, Box, TextInput, Avatar } from '@mantine/core';
import { IconSearch, IconBooks, IconHeart, IconClipboardText, IconHome, IconLogout2 } from '@tabler/icons-react';

const data = [
{ icon: IconHome, label: 'Home' },
{ icon: IconBooks, label: 'My Books' },
{ icon: IconHeart, label: 'Favorites' },
{ icon: IconClipboardText, label: 'My Orders' },
];

export default function AppLayout() {
  const ctx = useOutletContext();
  const [active, setActive] = useState(0);
 
  const navlinks = data.map((item, index) => (
    <NavLink color="#0066ffff" href={item.href} label={item.label} leftSection={<item.icon size={22} stroke={1.5}/>} active={active === index} onClick={()=>setActive(index)}/>
  ))
  return (
    <>
      <div className={styles.parent}>
          <div className={styles.sidebar}>
            <a href=""><img className={styles.logo} src="/logo.svg" alt="logo"/></a>
            <Box w={225}>
              {navlinks}
            </Box>
            <NavLink className={styles.signout} label="Log out" leftSection={<IconLogout2 size={22} stroke={1.5}/>}/>
          </div>
          <div className={styles.main}>
            <div className={styles.header}>
              <div className={styles.searchbar}>
                  <form>
                      <TextInput size="md" type="search" placeholder="Search Books" 
                      leftSection={<IconSearch size={18}/>} leftSectionPointerEvents="none"
                      />
                  </form>
              </div>
              <div className={styles.useravatar}>
                <Avatar src="penguin.png" alt="user avatar" />
                <p>username</p>
              </div>
            </div>
            <Outlet context={ctx}/>
          </div>
      </div>
    </>
  )
}