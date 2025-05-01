"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/TopBar";
import styles from "./Book.module.css";
import { useParams, useRouter } from "next/navigation";
import Image from 'next/image';
import { pdfjs } from 'react-pdf';  // Import pdfjs for worker configuration

// Ensure that we use the local worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs-worker/pdf.worker.min.js';

const apiurl = process.env.NEXT_PUBLIC_API_URL;

interface Book {
  _id: string;
  image: string;
  title: string;
  author: string;
  description: string;
  category: string;
  pdf: string;
}

const Page = () => {
  const { bookid } = useParams<{ bookid: string }>();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch book data on initial render
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`${apiurl}/api/books/${bookid}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`, // Include token in header
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch book data");
        }
        const data = await response.json();
        setBook(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    if (bookid) {
      fetchBook();
    }
  }, [bookid]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!book) {
    return <p>Book not found.</p>;
  }

  return (
    <div className={styles.main}>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.imageContainer}>
          {book.image && (
            <Image
              src={book.image}
              alt={book.title}
              className={styles.bookImage}
              width={300}
              height={450}
            />
          )}
        </div>
        <div className={styles.details}>
          <h1 className={styles.bookTitle}>{book.title}</h1>
          <p className={styles.bookAuthor}>by {book.author}</p>
          <p className={styles.bookCategory}><strong>Category:</strong> {book.category}</p> {/* Displaying the category */}
          <div
            className={styles.bookDescription}
            dangerouslySetInnerHTML={{ __html: book.description }}
          />
          <button
            className={styles.purchaseButton}
            onClick={() => {
              router.push(`/read/${bookid}`);
            }}
          >
            Start Reading
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
