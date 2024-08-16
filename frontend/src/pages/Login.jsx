import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import "./css/login.css";

const Login = () => {
  const [codeforcesId, setCodeforcesId] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setCodeforcesId(event.target.value);
  };

  const handleLoginClick = () => {
    navigate(`/home/${codeforcesId}`);
  };

  return (
    <div className="loginbackground">
      <h1 className="logintitle">Login Page</h1>
      <form className="loginbox" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="outlined-basic">Codeforces_id: </label>
        <TextField
          id="outlined-basic"
          label="Please Enter your codeforces_id"
          variant="filled"
          value={codeforcesId}
          onChange={handleInputChange}
          style={{
            color: "white",
            backgroundColor: "white",
            borderRadius: "10px",
          }}
        />
        <Button
          variant="contained"
          className="loginbutton"
          onClick={handleLoginClick}
        >
          Login
        </Button>
      </form>
    </div>
  );
};

export default Login;
