import styles from "./mybooks.module.css";
import { useEffect, useState } from "react";
import { useDisclosure } from '@mantine/hooks';
import { Bookcard, BookModal } from "../dashboardhome/dashboardhome.jsx";

export default function MyBooks(){
    const [booksdata, setBooksdata] = useState(null);
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedbook, setSelectedBook] = useState(null);

    async function fetchmybooks() {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://localhost:8000/api/dashboard/mybooks", {
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

    async function handleUnborrow(book) {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:8000/api/dashboard/mybooks/unborrow", {
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

            if (!res.ok) throw new Error("Unborrow failed");
            console.log("Unborrowed");
            close();
            setSelectedBook(null);
            fetchmybooks();
        } catch (err) {
            console.error(err.message);
        }
    }
    useEffect(() => {
        fetchmybooks();
    }, []);

    if (!booksdata) return null;
    const handleOpenBook = (book) => {
        setSelectedBook(book);
        open();
    };

    return (
        <div className={styles.content}>
            {booksdata.mybooks.length === 0 ? (
        <div className={styles.emptystate}>
            <img
            src="/nobooks.png"
            alt="No borrowed books"
            className={styles.emptyImage}
            loading="lazy"
            />
            <h2>No borrowed books</h2>
            <p>Browse the library and borrow your first book</p>
        </div>
        ) : (
        booksdata.mybooks.map((book) => (
            <Bookcard
            key={book.book_id}
            book={book}
            onOpen={() => handleOpenBook(book)}
            />
        ))
        )}
            <BookModal 
            opened={opened}
            onClose={() => { close(); setSelectedBook(null) }}
            book={selectedbook}
            mode = "borrow"
            onUnborrow={handleUnborrow}
            />
        </div>
    );
}