import styles from "./dashboardhome.module.css";
import { useEffect, useState } from "react";
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Text, ActionIcon } from '@mantine/core';
import { IconSquarePlus, IconShoppingCart, IconHeartPlus, IconHeartMinus, IconSquareMinus, IconBook } from '@tabler/icons-react';

export default function DashboardHome(){
    const [booksdata, setBooksdata] = useState(null);
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedbook, setSelectedBook] = useState(null);

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
        async function fetchbooks() {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch("http://localhost:8000/api/dashboard/home", {
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
                localStorage.removeItem("token");
            }
        }
        fetchbooks();
    }, []);

    if (!booksdata) return null;

    const handleOpenBook = (book) => {
    setSelectedBook(book);
    open();
    };
    const popularbooks = booksdata.popularbooks.map((item) => (
        <Bookcard book={item} key={item.book_id} onOpen={() => handleOpenBook(item)}/>
    ))
    const recommendedbooks = booksdata.recommendedbooks.map((item) => (
        <Bookcard book={item} key={item.book_id} onOpen={() => handleOpenBook(item)}/>
    ))
    return(
        <>
            <div className={styles.content}>
                <div className={styles.booksection}>
                    <p className={styles.sectiontitle}>Popular Books</p>
                    <div className={styles.books}>
                        {popularbooks}
                    </div>
                </div>
                <div className={styles.booksection}>
                    <p className={styles.sectiontitle}>Recommended Books</p>
                    <div className={styles.books}>
                        {recommendedbooks}
                    </div>
                </div>
            </div>
            <BookModal
            opened={opened}
            onClose={() => { close(); setSelectedBook(null) }}
            book={selectedbook}
            onBorrow={handleBorrow}
            onAddFavorite={handleAddFavorite}
            />
        </>
    )
}

export function Bookcard({ book, onOpen }) {
    const API_BASE = "http://localhost:8000/storage/";
    return (
        <div className={styles.bookcard} onClick={ onOpen }>
            <img src={`${API_BASE}${book.cover_path}`} alt={`${book.title}`}/>
            <p>{book.title}</p>
        </div>
    )
}

export function BookModal({ opened, onClose, book, mode = "home", onBorrow, onUnborrow, onAddFavorite, onUnfavorite }) {
    const API_BASE = "http://localhost:8000/storage/";
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Text size="lg" fw={700}>{book?.title ?? "Title"}</Text>}
      size="lg"
      centered
    >
      {!book ? null : (
        <div className={styles.modalcontainer}>
            <div className={styles.modalhead}>
                <div className={styles.imgcontainer}>
                <img src={`${API_BASE}${book.cover_path}`} alt="book popup" />
                </div>
                <div className={styles.modalcontent}>
                    <p className={styles.modaltitle}>
                        <b>Author:</b> {book.author}
                    </p>
                    <h4>Description</h4>
                    <p>{book.description}</p>
                </div>
            </div>

          <div className={styles.modalbuttons}>
            <div>
                <Button
                    onClick={() => onBorrow?.(book)}
                    leftSection={mode === "borrow" ? <IconBook size={20} /> : <IconSquarePlus size={20} />}
                    >
                    {mode === "borrow" ? "Read" : "Borrow"}
                </Button>
                <Button
                    leftSection={<IconShoppingCart size={20} />}
                    variant="default"
                >
                    Buy Physical Copy
                </Button>
            </div>
            <ActionIcon variant="default" size="lg"
            onClick={() => {
                if (mode === "borrow") onUnborrow(book);
                if (mode === "favorite") onUnfavorite(book);
                if (mode === "home") onAddFavorite(book);
            }}
            >
                {mode === "borrow" && <IconSquareMinus/>}
                {mode === "favorite" && <IconHeartMinus />}
                {mode === "home" && <IconHeartPlus />}
            </ActionIcon>
          </div>
        </div>
      )
      }
    </Modal>
  );
}