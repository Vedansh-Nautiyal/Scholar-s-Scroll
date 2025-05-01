'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./admin.module.css";

const apiurl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

const AdminPage = () => {
  const router = useRouter();
  const [books, setBooks] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [newBook, setNewBook] = useState<{
    title: string;
    author: string;
    description: string;
    category: string;
    pdf: File | null;
    image: File | null;
  }>({
    title: "",
    author: "",
    description: "",
    category: "",
    pdf: null,
    image: null,
  });
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      router.push("/login");
    } else {
      fetchBooks();
      fetchUsers();
      setCategories(["Computer Science", "Geology", "Electrical Engineering", "Mechanical Engineering", "Chemical Engineering"])
    }
  }, [router]);

  const fetchBooks = async () => {
    setLoadingBooks(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${apiurl}/api/admin/books/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setBooks(data);
      } else {
        setError(data.message || "Failed to fetch books.");
      }
    } catch (err) {
      setError("Error fetching books.");
    } finally {
      setLoadingBooks(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${apiurl}/api/admin/panel/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(data);
      } else {
        setError(data.message || "Failed to fetch users.");
      }
    } catch (err) {
      setError("Error fetching users.");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    setLoadingBooks(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${apiurl}/api/admin/books/${bookId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        fetchBooks();
      } else {
        setError(data.message || "Failed to delete book.");
      }
    } catch (err) {
      setError("Error deleting book.");
    } finally {
      setLoadingBooks(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setLoadingUsers(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${apiurl}/api/admin/panel/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        fetchUsers();
      } else {
        setError(data.message || "Failed to delete user.");
      }
    } catch (err) {
      setError("Error deleting user.");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleBookInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewBook((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "pdf" | "image") => {
    const files = e.target.files;
    if (files && files[0]) {
      setNewBook((prev) => ({
        ...prev,
        [type]: files[0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingBooks(true);

    const formData = new FormData();
    formData.append("title", newBook.title);
    formData.append("author", newBook.author);
    formData.append("description", newBook.description);
    formData.append("category", newBook.category);

    if (newBook.pdf) {
      formData.append("pdf", newBook.pdf);
    }
    if (newBook.image) {
      formData.append("image", newBook.image);
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${apiurl}/api/admin/books/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setNewBook({
          title: "",
          author: "",
          description: "",
          category: "",
          pdf: null,
          image: null,
        });
        fetchBooks();
      } else {
        setError(data.message || "Failed to add book.");
      }
    } catch (err) {
      setError("Error adding book.");
    } finally {
      setLoadingBooks(false);
    }
  };

  return (
    <div className={styles.adminContainer}>
      <div className={styles.sidebar}>
        <div className={styles.logoContainer}>
          <img src="/images/logo.webp" alt="Website Logo" className={styles.logo} />
        </div>
        <nav>
          <a href="/admin" className={styles.navItem}>Dashboard</a>
          <a
            href="/admin/login"
            className={styles.navItem}
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
            }}
          >
            Logout
          </a>
        </nav>
      </div>

      <div className={styles.content}>
        <header className={styles.topBar}>
          <h1>Admin Dashboard</h1>
        </header>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.cardContainer}>
          <h2 className={styles.subtitle}>Create Book</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="text"
              name="title"
              value={newBook.title}
              placeholder="Book Title"
              onChange={handleBookInputChange}
              required
              className={styles.input}
            />
            <input
              type="text"
              name="author"
              value={newBook.author}
              placeholder="Author"
              onChange={handleBookInputChange}
              required
              className={styles.input}
            />
            <textarea
              name="description"
              value={newBook.description}
              placeholder="Description"
              onChange={handleBookInputChange}
              required
              className={styles.textarea}
            ></textarea>

            {/* Category Dropdown */}
            <select
              name="category"
              value={newBook.category}
              onChange={handleBookInputChange}
              required
              className={styles.input}
            >
              <option value="">Select Category</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <input
              type="file"
              name="pdf"
              onChange={(e) => handleFileChange(e, "pdf")}
              accept="application/pdf"
              required
              className={styles.input}
            />
            <input
              type="file"
              name="image"
              onChange={(e) => handleFileChange(e, "image")}
              accept="image/*"
              className={styles.input}
            />

            <button type="submit" className={styles.button}>
              {loadingBooks ? "Creating..." : "Create Book"}
            </button>
          </form>
        </div>

        <div className={styles.cardContainer}>
          <h2 className={styles.subtitle}>All Books</h2>
          {loadingBooks ? (
            <p>Loading books...</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book._id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>
                      <button
                        className={styles.button}
                        onClick={() => handleDeleteBook(book._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className={styles.cardContainer}>
          <h2 className={styles.subtitle}>All Users</h2>
          {loadingUsers ? (
            <p>Loading users...</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <button
                        className={styles.button}
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
