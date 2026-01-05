import styles from './applayout.module.css'
import { Outlet, useOutletContext, useNavigate, useLocation } from "react-router-dom";
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { NavLink, Box, TextInput, Avatar, ActionIcon } from '@mantine/core';
import { IconSearch, IconBooks, IconHeart, IconClipboardText, IconHome, IconLogout2, IconCategory, IconStar, IconStarFilled, IconShoppingCart } from '@tabler/icons-react';

const data = [
  { icon: IconHome, label: 'Home', href: '/dashboard' },
  { icon: IconBooks, label: 'My Books', href: '/dashboard/mybooks' },
  { icon: IconCategory, label: 'Categories', href: '/dashboard/categories' },
  { icon: IconHeart, label: 'Favorites', href: '/dashboard/favorites' },
  { icon: IconClipboardText, label: 'My Orders', href: '/dashboard/orders' },
];

export default function AppLayout() {
  const ctx = useOutletContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [loading, { open, close }] = useDisclosure();

  const is_premium = ctx?.userdata?.is_premium;

  const navlinks = data.map((item, index) => (
    <NavLink
      key={index}
      color="#0066ffff"
      label={item.label}
      leftSection={<item.icon size={22} stroke={1.5} />}
      active={location.pathname === item.href}
      onClick={() => navigate(item.href)}
    />
  ));

  const handleSignout = () => {
    localStorage.removeItem("token");
    sessionStorage.clear();
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const keyword = query.trim();
    if (!keyword) return;
    navigate(`/dashboard/search?q=${encodeURIComponent(keyword)}`);
  };

  const handleUpgradePremium = async () => {
    open();
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/dashboard/premium/upgrade", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upgrade failed");

      localStorage.setItem("token", data.token);

      navigate(0);
    } catch (err) {
      console.error(err);
    } finally {
      close();
    }
  };

  const handleRemovePremium = async () => {
    open();
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/dashboard/premium/remove", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Remove premium failed");

      localStorage.setItem("token", data.token);

      navigate(0);
    } catch (err) {
      console.error(err);
    } finally {
      close();
    }
  };

  return (
    <div className={styles.parent}>
      <div className={styles.sidebar}>
        <a href="/"><img className={styles.logo} src="/logo.svg" alt="logo" loading="lazy"/></a>

        <Box w={225}>
          {navlinks}
        </Box>

        <NavLink
          className={styles.signout}
          onClick={handleSignout}
          label="Log out"
          leftSection={<IconLogout2 size={22} stroke={1.5} />}
        />
      </div>

      <div className={styles.main}>
        <div className={styles.header}>
          <div className={styles.searchbar}>
            <form onSubmit={handleSearch}>
              <TextInput
                size="md"
                type="search"
                placeholder="Search Books"
                leftSection={<IconSearch size={18} />}
                leftSectionPointerEvents="none"
                value={query}
                onChange={(e) => setQuery(e.currentTarget.value)}
              />
            </form>
          </div>
          <div className={styles.rightheader}>
            <ActionIcon size={30} variant="subtle" color="blue" >
              <IconShoppingCart size={22} stroke={1.5} />
            </ActionIcon>
            <ActionIcon
              loading={loading}
              size={30} variant="subtle" color="yellow" 
              onClick={is_premium ? handleRemovePremium : handleUpgradePremium}
             >
              {is_premium ? <IconStarFilled size={22} stroke={1.7} /> : <IconStar size={22} stroke={1.7} />}
            </ActionIcon>
            <div className={styles.useravatar}>
              <Avatar src="/penguin.png" alt="user avatar" />
              <p>{ctx?.userdata?.username}</p>
            </div>
          </div>
        </div>

        <Outlet context={ctx} />
      </div>
    </div>
  );
}