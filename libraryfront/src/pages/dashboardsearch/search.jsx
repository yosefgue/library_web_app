import styles from "../dashboardmybooks/mybooks.module.css";

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Bookcard, BookModal } from "../dashboardhome/dashboardhome.jsx";
import { useDisclosure } from "@mantine/hooks";

export default function SearchPage() {
    const [params] = useSearchParams();
    const query = params.get("q") || "";

    const [data, setData] = useState(null);
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedBook, setSelectedBook] = useState(null);

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
    async function handleAddFavorite(book) {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:8000/api/dashboard/favorites/add", {
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

            if (!res.ok) throw new Error("Favorite failed");

            close();
            setSelectedBook(null);
            console.log("Added to favorites");
        } catch (err) {
            console.error(err.message);
        }
    }

    useEffect(() => {
        const controller = new AbortController();
        const trimmed = query.trim();

        const run = async () => {
            if (!trimmed) {
            setData({ results: [] });
            return;
            }

            const token = localStorage.getItem("token");
            if (!token) {
            window.location.href = "/signin";
            return;
            }

            try {
            const res = await fetch("http://localhost:8000/api/dashboard/search", {
                method: "POST",
                headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
                },
                body: JSON.stringify({ query: trimmed }),
                signal: controller.signal,
            });

            if (res.status === 401) {
                localStorage.removeItem("token");
                window.location.href = "/signin";
                return;
            }

            if (!res.ok) {
                console.error("Search failed", res.status);
                return;
            }

            const json = await res.json();
            setData(json);
            } catch (err) {
            console.error("Search error", err);
            }
    };
    run();
    return () => controller.abort();
    }, [query]);

    if (!data) return null;

    return (
        <div className={styles.content}>
        {data.results.map((book) => (
            <Bookcard
            key={book.book_id}
            book={book}
            onOpen={() => {
                setSelectedBook(book);
                open();
            }}
            />
        ))}

        <BookModal
            opened={opened}
            onClose={() => { close(); setSelectedBook(null); }}
            book={selectedBook}
            mode="home"
            onBorrow={handleBorrow}
            onAddFavorite={handleAddFavorite}
        />
        </div>
    );
}
