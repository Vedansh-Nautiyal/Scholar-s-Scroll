"use client";

import styles from "./Signup.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const apiurl = process.env.NEXT_PUBLIC_API_URL;

const SignupPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const userData = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      const response = await fetch(`${apiurl}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed.");
      }

      // Save token and role
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role); // Assumes backend sends role in response

      alert("Signup successful!");

      // Redirect based on role
      if (data.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/library");
      }

    } catch (error: any) {
      console.error("Signup error:", error);
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <Image
          src="/images/logo.webp"
          alt="Scholar's Scroll Logo"
          width={100}
          height={100}
          className={styles.logo}
        />
        <h1 className={styles.title}>Create Account</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>Your Name</label>
          <input type="text" name="name" placeholder="First and last name" required />

          <label>Email</label>
          <input type="email" name="email" placeholder="Enter your email" required />

          <label>Password</label>
          <input type="password" name="password" placeholder="Enter your password" required />

          <button type="submit" className={styles.signupButton} disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.extraLinks}>
          <p>
            Already have an account? <a href="/login">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
