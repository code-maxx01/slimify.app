// src/components/ImageCompressor.jsx
import React, { useState, useRef } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { FaFileUpload } from "react-icons/fa";

const ffmpeg = createFFmpeg({ log: true });

export default function ImageCompressor({ darkMode }) {
  const [imageFile, setImageFile] = useState(null);
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const cancelRef = useRef(false);
  const fileInputRef = useRef(null);

  const loadFFmpeg = async () => {
    if (!isLoaded) {
      ffmpeg.setProgress(({ ratio }) => {
        if (cancelRef.current) return;
        setProgress(Math.round(ratio * 100));
      });
      await ffmpeg.load();
      setIsLoaded(true);
    }
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files?.[0] || null);
    setOutput(null);
    setProgress(0);
    setStatusMessage("");
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const compressImage = async () => {
    if (!imageFile) return;
    setIsRunning(true);
    setProgress(0);
    setStatusMessage("Compressing...");
    cancelRef.current = false;

    await loadFFmpeg();

    try {
      ffmpeg.FS("writeFile", "input.png", await fetchFile(imageFile));
      await ffmpeg.run("-i", "input.png", "-q:v", "7", "output.jpg");

      if (cancelRef.current) {
        setIsRunning(false);
        return;
      }

      const data = ffmpeg.FS("readFile", "output.jpg");
      const url = URL.createObjectURL(new Blob([data.buffer], { type: "image/jpeg" }));
      setOutput(url);
      setStatusMessage("Compression completed ✅");
    } catch (err) {
      if (!cancelRef.current) {
        setStatusMessage("Compression failed ❌");
        console.error(err);
      }
    }

    setIsRunning(false);
  };

  const cancelImage = () => {
    cancelRef.current = true;
    setStatusMessage("Compression canceled OR Image removed");
    setIsRunning(false);
    setOutput(null);
    setProgress(0);
    setImageFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div style={darkMode ? styles.containerDark : styles.containerLight}>
      <h2 style={styles.title}>🖼️ Image Compressor</h2>

      <div style={styles.uploadBox} onClick={handleUploadClick}>
        <FaFileUpload size={65} color={darkMode ? "#6FB98F" : "#004445"} />
        <p style={styles.uploadText}>
          {imageFile ? `Selected: ${imageFile.name}` : "Click to upload image"}
        </p>
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: "none" }}
      />

      {imageFile && (
        <button onClick={cancelImage} style={styles.cancelButton}>
          Cancel / Remove Image
        </button>
      )}

      <button
        onClick={compressImage}
        disabled={!imageFile || isRunning}
        style={isRunning ? styles.buttonDisabled : styles.button}
      >
        {isRunning ? "Compressing..." : "Compress Image"}
      </button>

      {imageFile && (isRunning || statusMessage) && (
        <div style={styles.progressWrapper}>
          <div style={{ ...styles.progressBar, width: isRunning ? `${progress}%` : "100%" }}>
            {statusMessage || `${progress}%`}
          </div>
        </div>
      )}

      {output && (
        <div style={styles.imageWrapper}>
          <img src={output} alt="Compressed" style={styles.image} />
          <a href={output} download="compressed.jpg" style={styles.downloadLink}>
            ⬇️ Download Compressed Image
          </a>
        </div>
      )}
    </div>
  );
}

/* 🎨 Styles for Image Compressor */
const styles = {
  containerDark: {
    maxWidth: "650px",
    margin: "2rem auto",
    padding: "2rem",
    borderRadius: "1.2rem",
    backgroundColor: "#004445",
    color: "#6FB98F",
    textAlign: "center",
  },
  containerLight: {
    maxWidth: "650px",
    margin: "2rem auto",
    padding: "2rem",
    borderRadius: "1.2rem",
    backgroundColor: "#fff",
    color: "#004445",
    textAlign: "center",
    boxShadow: "0 0 25px 5px rgba(44, 120, 115, 0.6)",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "700",
  },
  uploadBox: {
    borderRadius: "0.8rem",
    padding: "2rem",
    cursor: "pointer",
    border:"none",
    margin: "1rem 0",
  },
  uploadText: {
    marginTop: "0.5rem",
    fontWeight: "600",
  },
  button: {
    padding: "0.8rem 1.6rem",
    border: "none",
    borderRadius: "0.6rem",
    backgroundColor: "#2C7873",
    color: "white",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "1rem",
    margin: "0.5rem",
  },
  buttonDisabled: {
    padding: "0.8rem 1.6rem",
    borderRadius: "0.6rem",
    backgroundColor: "#95a5a6",
    color: "white",
    fontWeight: "700",
    cursor: "not-allowed",
  },
  cancelButton: {
    padding: "0.7rem 1.3rem",
    border: "none",
    borderRadius: "0.6rem",
    backgroundColor: "#e74c3c",
    color: "white",
    cursor: "pointer",
    fontWeight: "700",
    margin: "0.5rem",
  },
  imageWrapper: {
    marginTop: "1rem",
  },
  image: {
    width: "100%",
    borderRadius: "0.8rem",
    border: "3px solid #2C7873",
  },
  downloadLink: {
    textDecoration: "none",
    display: "inline-block",
    marginTop: "0.5rem",
    padding: "0.6rem 1.3rem",
    backgroundColor: "#2C7873",
    color: "white",
    borderRadius: "0.6rem",
    fontWeight: "700",
  },
  progressWrapper: {
    width: "100%",
    backgroundColor: "#021C1E",
    borderRadius: "0.6rem",
    overflow: "hidden",
    marginTop: "1rem",
  },
  progressBar: {
    height: "1.6rem",
    backgroundColor: "#6FB98F",
    color: "black",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    transition: "width 0.2s",
  },
};
