"use client";

import React, { useState } from "react";
import styles from "./Login.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

const apiurl = process.env.NEXT_PUBLIC_API_URL;

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${apiurl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save token and role in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role); // <-- role must be returned by backend

      // Redirect based on role
      if (data.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/library");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Image
          src="/images/logo.webp"
          alt="Scholar's Scroll Logo"
          className={styles.logo}
          width={100}
          height={100}
        />
        <h2 className={styles.title}>Welcome Back!</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.extraLinks}>
          <p>
            Don&apos;t have an account? <a href="/signup">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
