import styles from "./favorites.module.css";
import { useEffect, useState } from "react";
import { useDisclosure } from '@mantine/hooks';
import { Bookcard, BookModal } from "../dashboardhome/dashboardhome.jsx";

export default function Favorites(){
    const [booksdata, setBooksdata] = useState(null);
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedbook, setSelectedBook] = useState(null);

    async function fetchfavorites() {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://localhost:8000/api/dashboard/favorites", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });
            if (!res.ok) {
                throw new Error("Unauthorized")
            }
            const data = await res.json();
            setBooksdata(data);
        } catch (err) {
            console.error(err.message);
        }
    }

    async function removeFavorite(book) {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://localhost:8000/api/dashboard/favorites/remove", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                book_id: book.book_id,
            }),
            });

            if (!res.ok) {
            throw new Error("Remove favorite failed");
            }
            console.log("Favorite removed");
            close();
            setSelectedBook(null);
            fetchfavorites();
        } catch (err) {
            console.error(err.message);
        }
    }


    async function handleBorrow(book) {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/api/dashboard/borrow", {
            method: "POST",
            headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            },
            body: JSON.stringify({
            book_id: book.book_id,
        }),
        });

        if (res.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/signin";
            return;
        }
        if (!res.ok) throw new Error("Borrow failed");
        close();
        setSelectedBook(null);
        console.log("Book borrowed");
    } catch (err) {
        console.error(err.message);
        }
    }

    useEffect(() => {
        fetchfavorites();
    }, []);

    if (!booksdata) return null;
    const handleOpenBook = (book) => {
        setSelectedBook(book);
        open();
    };
    return (
        <div className={styles.content}>
            {booksdata.favorites.map((book) => (
                <Bookcard book={book} key={book.book_id} onOpen={() => handleOpenBook(book)} />
            ))}
            <BookModal 
            opened={opened}
            onClose={() => { close(); setSelectedBook(null) }}
            book={selectedbook}
            mode = "favorite"
            onBorrow={handleBorrow}
            onUnfavorite={removeFavorite}
            />
        </div>
    );
}