import styles from "./dashboardhome.module.css";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Text, ActionIcon } from '@mantine/core';
import { IconSquarePlus, IconShoppingCart, IconHeartFilled, IconHeartPlus } from '@tabler/icons-react';

export default function DashboardHome(){
    const { userdata, booksdata } = useOutletContext();
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedbook, setSelectedBook] = useState(null);
    const API_BASE = "http://localhost:8000/storage/";
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
            <Modal opened={opened} onClose={() => { close(); setSelectedBook(null) }} title={<Text size="lg" fw={700}>{selectedbook?.title ?? "Title"}</Text>} size="lg" centered>
                {selectedbook ? (
                <div className={styles.modalcontainer}>
                    <div className={styles.modalhead}>
                        <div className={styles.imgcontainer}>
                            <img src={`${API_BASE}${selectedbook.cover_path}`} alt="book popup" />

                        </div>
                        <div className={styles.modalcontent}>
                            <p className={styles.modaltitle}><b>Author:</b> {selectedbook.author}</p>
                            <h4>Description</h4>
                            <p>{selectedbook.description}</p>
                        </div>
                    </div>
                    <div className={styles.modalbuttons}>
                        <div>
                            <Button leftSection={<IconSquarePlus size={20} />} >Borrow</Button>
                            <Button leftSection={<IconShoppingCart size={20} />} variant="default" >Buy Physical Copy</Button>
                        </div>
                        <ActionIcon variant="default" size="lg" > <IconHeartPlus/> </ActionIcon>
                    </div>
                </div>
                ) : (
                <p>No book selected</p>
                )}
            </Modal>
        </>
    )
}

function Bookcard({ book, onOpen }) {
    const API_BASE = "http://localhost:8000/storage/";
    return (
        <div className={styles.bookcard} onClick={ onOpen }>
            <img src={`${API_BASE}${book.cover_path}`} alt={`${book.title}`}/>
            <p>{book.title}</p>
        </div>
    )
}