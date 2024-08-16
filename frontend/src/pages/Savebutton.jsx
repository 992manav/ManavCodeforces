import React from "react";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";

const SaveButton = ({ onClick }) => {
  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<SaveIcon />}
      onClick={onClick}
      style={{ marginBottom: 10, backgroundColor: "green" }}
    >
      Save
    </Button>
  );
};

export default SaveButton;
