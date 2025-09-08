// src/App.jsx
import Footer from "./components/Footer";
import React, { useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import ImageCompressor from "./components/ImageCompressor";
import VideoCompressor from "./components/VideoCompressor";
import logo from './assets/slimify-logo.png';

function App() {
  const [darkMode, setDarkMode] = useState(false); // default dark mode

  return (
    <div style={darkMode ? styles.appDark : styles.   appLight}>
      {/* Navbar */}
      <nav style={darkMode ? styles.navDark : styles.navLight}>
         <img 
        src={logo} 
        alt="Slimify Logo" 
        style={{ width: "120px", height: "40px", marginBottom: "0rem" }} 
      />
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={styles.toggleButton}
        >
          {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
          {darkMode ? " Light Mode" : " Dark Mode"}
        </button>
      </nav>

      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{color:"#004445", fontSize:"30px", fontWeight:"bold"}}>Compress images and videos directly in your browser!</p>

        {/* Image Compressor */}
        <ImageCompressor darkMode={darkMode} />

        <hr style={{ margin: "2rem 0" }} />

        {/* Video Compressor */}
        <VideoCompressor darkMode={darkMode} />

        {/* AdSense Placeholder */}
        <div style={{ marginTop: "3rem" }}>
          <script type="text/javascript">
	atOptions = {
		'key' : '35e022604ea2d8741ba2b1871b1f941e',
		'format' : 'iframe',
		'height' : 300,
		'width' : 160,
		'params' : {}
	};
</script>
<script type="text/javascript" src="//www.highperformanceformat.com/35e022604ea2d8741ba2b1871b1f941e/invoke.js"></script>
        </div>
      </div>
        <div>
          {/* Your app content here */}
          <Footer />
        </div>
    </div>
  );
}

export default App;

/* 🎨 Shared styles */
const styles = {
  body:{
    padding:"0"
  },
  appDark: {
    backgroundColor: "#021C1E",
    minHeight: "100vh",
  },
  appLight: {
    backgroundColor: "#f4f4f4",
    minHeight: "100vh",
  },
  navDark: {
    backgroundColor: "#2C7873",
    color: "#6FB98F",
    padding: "1rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navLight: {
    backgroundColor: "#2C7873",
    color: "#021C1E",
    padding: "1rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontSize: "1.4rem",
    fontWeight: "700",
  },
  toggleButton: {
    border: "none",
    borderRadius: "0.5rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#2C7873",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
};
