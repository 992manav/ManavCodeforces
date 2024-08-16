import React from "react";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";

const SubmitButton = ({ contest_id }) => {
  const handleClick = () => {
    window.open(
      `https://codeforces.com/contest/${contest_id}/submit`,
      "_blank"
    );
    alert(
      "Agar codeorces pe Login nahi kiya toh karlo pehle fir Submit click karna vaapas to direct Redirect ho jaoge"
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
