import React from "react";

function PageNotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f8d7da",
        color: "#721c24",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "5rem", marginBottom: "20px" }}>404</h1>
      <h2 style={{ fontSize: "2rem", marginBottom: "20px" }}>Page Not Found</h2>
      <h1> Bhaai tu galat jagah pe aagaya hai</h1>
      <p style={{ fontSize: "1.2rem", maxWidth: "600px" }}>
        Sorry, the page you are looking for does not exist. It might have been
        moved or deleted.
        <br></br>
      </p>
    </div>
  );
}

export default PageNotFound;
