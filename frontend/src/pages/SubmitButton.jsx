import React from "react";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";

const SubmitButton = ({ code, contest_id }) => {
  const handleClick = () => {
    // console.log(code);
    navigator.clipboard
      .writeText(code)
      .then(() => {
        console.log("Text copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
    alert(
      "Agar codeorces pe Login nahi kiya toh karlo pehle fir Submit click karna vaapas to direct Redirect ho jaoge"
    );
    window.open(
      `https://codeforces.com/contest/${contest_id}/submit`,
      "_blank"
    );
  };

  return (
    <>
      <Button
        variant="contained"
        color="success"
        endIcon={<SendIcon />}
        onClick={handleClick}
        style={{ marginBottom: 10, backgroundColor: "blue" }}
      >
        Submit
      </Button>
    </>
  );
};

export default SubmitButton;
