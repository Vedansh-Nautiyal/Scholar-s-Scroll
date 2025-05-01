"use client";

import React, { useState, useEffect } from "react";
import styles from "./Library.module.css";
import TopBar from "@/components/TopBar";
import { FaBookOpen } from "react-icons/fa";

// Define the Book interface
interface Book {
  _id: string;
  title: string;
  author: string;
  image: string;
  pdf: string; // URL or binary data, depending on your use case
}

const LibraryPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>(""); // State for search term
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null); // State for PDF Blob URL

  // Fetching all the books from the API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch("http://localhost:5001/api/admin/books/all");
        const data = await response.json();

        if (response.ok) {
          if (Array.isArray(data) && data.length > 0) {
            setBooks(data);
          } else {
            setError("No books found.");
          }
        } else {
          setError("Failed to fetch books.");
        }
      } catch (error) {
        setError("An error occurred while fetching books.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Handle clicking the "Read Book" button
  const handleReadBook = async (bookId: string) => {
    try {
      const response = await fetch(`http://localhost:5001/api/admin/books/pdf/${bookId}`);
      
      if (response.ok) {
        const pdfBuffer = await response.arrayBuffer();
        const pdfBlob = new Blob([pdfBuffer], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setPdfBlobUrl(pdfUrl);  // Set the Blob URL for the PDF
      } else {
        setError("Failed to load PDF.");
      }
    } catch (error) {
      console.error("Error loading PDF:", error);
      setError("An error occurred while fetching the PDF.");
    }
  };

  // Function to handle search input from TopBar
  const handleSearch = (term: string) => {
    setSearchTerm(term); // Update the search term state
  };

  // Filter books based on the search term
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <TopBar onSearch={handleSearch} /> {/* Pass the search handler to TopBar */}
      <div className={styles.main}>
        <h1 className={styles.heading}>Library</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className={styles.booksGrid}>
            {filteredBooks.length === 0 ? (
              <p>No books found.</p>
            ) : (
              filteredBooks.map((book) => (
                <div key={book._id} className={styles.bookCard}>
                  {book.image && (
                    <img
                      src={`http://localhost:5001/${book.image.replace(/\\/g, "/")}`}
                      alt={book.title}
                    />
                  )}
                  <h3 className={styles.bookTitle}>{book.title}</h3>
                  <p className={styles.bookAuthor}>{book.author}</p>
                  <button
                    className={styles.readButton}
                    onClick={() => handleReadBook(book._id)}
                  >
                    <FaBookOpen className={styles.buttonIcon} />
                    Read Book
                  </button>
                </div>
              ))
            )}
          </div>
        )}
        {pdfBlobUrl && (
          <iframe
            src={pdfBlobUrl}
            width="100%"
            height="600px"
            title="PDF Viewer"
            style={{ border: 'none' }} // Optional: Remove border for a cleaner look
          ></iframe>
        )}
      </div>
    </div>
  );
};

export default LibraryPage;
