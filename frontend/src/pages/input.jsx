import React from "react";

const InputComponent = ({ input, setInput }) => {
  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Input</h2>
      <textarea
        style={styles.textarea}
        placeholder={input}
        value={input}
        onChange={handleInputChange}
      />
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
  textarea: {
    width: "96%",
    height: "150px",
    marginBottom: "10px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #444",
    backgroundColor: "#2e2e2e",
    color: "#e0e0e0",
    fontFamily: "monospace",
  },
};

export default InputComponent;
