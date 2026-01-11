import styles from "./category.module.css";

import { useEffect, useMemo, useState } from "react";
import { SegmentedControl, LoadingOverlay, Box } from "@mantine/core";
import { Bookcard, BookModal } from "../dashboardhome/dashboardhome.jsx";
import { useDisclosure } from "@mantine/hooks";

const categories = [
    { label: "Technology", value: "technology" },
    { label: "Self Help", value: "self_help" },
    { label: "Fantasy", value: "fantasy" },
    { label: "Fiction", value: "fiction" },
    { label: "Science Fiction", value: "science_fiction" },
    { label: "Mystery", value: "mystery" },
    { label: "History", value: "history" },
    { label: "Children", value: "children" },
    { label: "Science", value: "science" },
];

    export default function CategoriesPage() {
    const [opened, { open, close }] = useDisclosure(false);
    const [visible, { open: openVisible, close: closeVisible }] = useDisclosure(false);

    const [selectedBook, setSelectedBook] = useState(null);

    const [activeCategory, setActiveCategory] = useState("technology");
    const [cats, setCats] = useState(null);

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
    const fetchCategories = async () => {
        openVisible();
        try {

        const token = localStorage.getItem("token");

        const res = await fetch("/api/dashboard/categories", {
            method: "GET",
            headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            },
        });

        const data = await res.json();
        console.log(data);

        if (!res.ok) {
            throw new Error(data?.error || "Failed to fetch categories");
        }
        setCats(data.categories || {});
        } catch (e) {
        console.error(e.message);
        } finally {
        closeVisible();
        }
    };

    fetchCategories();
    }, []);

    const books = useMemo(() => {
    if (!cats) return [];
    return cats[activeCategory] || [];
    }, [cats, activeCategory]);

    return (
    <div className={styles.content} >
        <div>
            <SegmentedControl
                fullWidth
                radius="md"
                size="md"
                value={activeCategory}
                onChange={setActiveCategory}
                data={categories}
            />
        </div>

        <Box className={styles.books} pos="relative">
        <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: "sm", blur: 1 }} />
        {books.map((book) => (
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
            onClose={() => {
            close();
            setSelectedBook(null);
            }}
            book={selectedBook}
            mode="home"
            onBorrow={handleBorrow}
            onAddFavorite={handleAddFavorite}
        />
        </Box>
    </div>
    );
    }