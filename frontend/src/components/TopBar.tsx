"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";  // Using Link for navigation
import styles from "./TopBar.module.css";
import { FaSearch, FaFilter, FaSortAmountDown, FaTh, FaShoppingCart } from "react-icons/fa";
import { useState } from "react"; // Import useState

// Define the props type for TopBar
interface TopBarProps {
  onSearch: (term: string) => void; // Define the type for the onSearch prop
}

const TopBar: React.FC<TopBarProps> = ({ onSearch }) => { // Use the defined props type
  const currentPath = usePathname();  // Get the current path using usePathname()
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  // Log the current path to the console to ensure it's correct
  console.log("Current Path:", currentPath);  // Check if it's '/'

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => { // Specify the event type
    const term = event.target.value;
    setSearchTerm(term);
    onSearch(term); // Call the search function passed from the parent
  };

  return (
    <div className={styles.topBar}>
      <div className={styles.left}>
        <span className={styles.logo}>📜 Scholar&apos;s Scroll</span>
      </div>

      <div className={styles.searchBar}>
        <FaSearch className={styles.searchIcon} />
        <input 
          type="text" 
          placeholder="Search your Library" 
          value={searchTerm} // Bind the input value to the state
          onChange={handleSearchChange} // Handle input changes
        />
      </div>

      {/* Conditional rendering based on current path */}
      {currentPath === "/" && (
        <div className={styles.adminLoginContainer}>
          <Link href="/admin/login" className={styles.adminLoginButton}>Admin Login</Link>
        </div>
      )}

      <div className={styles.rightIcons}>
        <FaFilter title="Filter" />
        <FaSortAmountDown title="Sort by: Recent" />
        <FaTh title="View" />
        <FaShoppingCart title="Cart" />
      </div>
    </div>
  );
};

export default TopBar;