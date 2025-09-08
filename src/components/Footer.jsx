import React from "react";

export default function Footer() {
  const styles = {
    footer: {
      marginTop: "auto",
      padding: "1.5rem",
      backgroundColor: "#2C7873",
      color: "white",
      textAlign: "center",
    },
    text: {
      margin: "0.5rem 0",
      fontSize: "0.9rem",
    },
    links: {
      display: "flex",
      justifyContent: "center",
      gap: "1.5rem",
      marginBottom: "0.5rem",
      flexWrap: "wrap", // allows stacking on smaller screens
    },
    link: {
      color: "white",
      textDecoration: "none",
      fontWeight: "600",
    },
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.links}>
        <a
          href="/privacy-policy.html"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.link}
        >
          Privacy Policy
        </a>
        <a
          href="/terms-and-conditions.html"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.link}
        >
          Terms & Conditions
        </a>
      </div>
      <p style={styles.text}>© {new Date().getFullYear()} Slimify. All rights reserved.</p>
    </footer>
  );
}
