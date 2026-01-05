import styles from "./visitorsearch.module.css";
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Bookcard, BookModal } from "../dashboardhome/dashboardhome.jsx";
import { useDisclosure } from "@mantine/hooks";
import { Button, Text, LoadingOverlay, Box } from "@mantine/core";

export default function VisitorSearchPage() {
  const [params] = useSearchParams();
  const query = params.get("q") || "";

  const [data, setData] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [visible, { open: openVisible, close: closeVisible }] = useDisclosure(false);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const trimmed = query.trim();

    const run = async () => {
      if (!trimmed) {
        setData({ results: [] });
        return;
      }

      openVisible();

      try {
        const res = await fetch("/api/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ query: trimmed }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}));
          throw new Error(errJson?.error || "Search failed");
        }

        const json = await res.json();
        setData(json);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Search error", err);
        setData({ results: [] });
      } finally {
        closeVisible();
      }
    };

    run();
    return () => controller.abort();
  }, [query]);

  return (
    <Box className={styles.content} pos="relative">
      <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: "sm", blur: 1 }} />

      {(data?.results ?? []).map((book) => (
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
        mode="visitor"
      />

      {(data?.results ?? []).length === 0 && (
        <div style={{ padding: 20 }}>
          <Text>No books found.</Text>
        </div>
      )}
    </Box>
  );
}
