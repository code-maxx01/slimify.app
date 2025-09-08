import React, { useState, useRef } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { FaFileUpload } from "react-icons/fa";

const ffmpeg = createFFmpeg({ log: true });

export default function VideoCompressor({ darkMode }) {
  const [videoFile, setVideoFile] = useState(null);
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [compressionMode, setCompressionMode] = useState("fast");
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
    setVideoFile(e.target.files?.[0] || null);
    setOutput(null);
    setProgress(0);
    setStatusMessage("");
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const compressVideo = async () => {
    if (!videoFile) return;

    setIsRunning(true);
    setProgress(0);
    setStatusMessage("Compressing...");
    cancelRef.current = false;

    await loadFFmpeg();

    try {
      ffmpeg.FS("writeFile", "input.mp4", await fetchFile(videoFile));

      let params = [];
      if (compressionMode === "fast") {
        params = ["-x264-params", "ref=1:subme=1:me=dia:trellis=0:fast_pskip=1"];
      } else if (compressionMode === "balanced") {
        params = ["-x264-params", "ref=3:subme=6:me=hex:trellis=1"];
      } else if (compressionMode === "high") {
        params = ["-x264-params", "ref=5:subme=8:me=umh:trellis=2"];
      }

      await ffmpeg.run(
        "-i", "input.mp4",
        "-vcodec", "libx264",
        "-crf", "28",
        ...params,
        "output.mp4"
      );

      if (cancelRef.current) {
        setIsRunning(false);
        return;
      }

      const data = ffmpeg.FS("readFile", "output.mp4");
      const url = URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }));
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

  const cancelVideo = () => {
    cancelRef.current = true;
    setStatusMessage("Compression canceled OR Video removed");
    setIsRunning(false);
    setOutput(null);
    setProgress(0);
    setVideoFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div style={darkMode ? styles.containerDark : styles.containerLight}>
      <h2 style={styles.title}>🎬 Video Compressor</h2>

      <div style={styles.uploadBox} onClick={handleUploadClick}>
        <FaFileUpload size={65} color={darkMode ? "#6FB98F" : "#004445"} />
        <p style={styles.uploadText}>
          {videoFile ? `Selected: ${videoFile.name}` : "Click to upload video"}
        </p>
      </div>
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: "none" }}
      />

      <select
        value={compressionMode}
        onChange={(e) => setCompressionMode(e.target.value)}
        style={styles.select}
      >
        <option value="fast">⚡ Fast</option>
        <option value="balanced">⚖️ Balanced</option>
        <option value="high">🎥 High Quality</option>
      </select>

      {videoFile && (
        <button onClick={cancelVideo} style={styles.cancelButton}>
          Cancel / Remove Video
        </button>
      )}

      <button
        onClick={compressVideo}
        disabled={!videoFile || isRunning}
        style={isRunning ? styles.buttonDisabled : styles.button}
      >
        {isRunning ? "Compressing..." : "Compress Video"}
      </button>

      {videoFile && (isRunning || statusMessage) && (
        <div style={styles.progressWrapper}>
          <div style={{ ...styles.progressBar, width: isRunning ? `${progress}%` : "100%" }}>
            {statusMessage || `${progress}%`}
          </div>
        </div>
      )}

      {output && (
        <div style={styles.videoWrapper}>
          <video src={output} controls style={styles.video} />
          <a href={output} download="compressed.mp4" style={styles.downloadLink}>
            ⬇️ Download Compressed Video
          </a>
        </div>
      )}
    </div>
  );
}

/* 🎨 Styles for Video Compressor */
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
    border: "none",
    borderRadius: "0.8rem",
    padding: "2rem",
    cursor: "pointer",
    margin: "1rem 0",
  },
  uploadText: {
    marginTop: "0.5rem",
    fontWeight: "600",
  },
  select: {
    padding: "0.7rem",
    borderRadius: "0.6rem",
    marginBottom: "1rem",
    cursor: "pointer",
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
  videoWrapper: {
    marginTop: "1rem",
  },
  video: {
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
