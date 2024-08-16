import React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function SelectVariants({ language, setLanguage }) {
  const handleChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <div>
      <FormControl
        variant="filled"
        sx={{ m: 1, minWidth: 120 }}
        style={{ backgroundColor: "white", borderRadius: "15px" }}
      >
        <InputLabel id="demo-simple-select-filled-label">Language</InputLabel>
        <Select
          labelId="demo-simple-select-filled-label"
          id="demo-simple-select-filled"
          value={language}
          onChange={handleChange}
        >
          <MenuItem value="cpp">C++</MenuItem>
          <MenuItem value="c">C</MenuItem>
          <MenuItem value="python">Python</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
