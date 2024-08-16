import React from "react";

const OutputComponent = ({ output }) => {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Output</h2>

      <div style={styles.outputContainer}>{output}</div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#1e1e1e",
  },
  heading: {
    marginBottom: "10px",
    fontSize: "20px",
    color: "#e0e0e0",
  },
  outputContainer: {
    padding: "10px",
    backgroundColor: "#2e2e2e",
    border: "1px solid #444",
    borderRadius: "5px",
    minHeight: "200px",
    overflow: "auto",
    wordWrap: "break-word",
    whiteSpace: "pre-wrap",
    color: "white",
  },
};

export default OutputComponent;
