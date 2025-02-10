import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export default function FormPropsTextFields() {
  return (
    <div className="flex flex-col items-center justify-center lg:flex-row gap-6">
      <Box
        component="form"
        sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
        noValidate
        autoComplete="off"
      >
        <div>
          <TextField
            required
            id="filled-required"
            label="Required"
            defaultValue="Hello World"
            variant="filled"
          />
          <TextField
            required
            id="filled-required"
            label="required"
            defaultValue="Hello World"
            variant="filled"
          />
          <TextField
            id="filled-password-input"
            label="Password"
            type="password"
            autoComplete="current-password"
            variant="filled"
          />
          <TextField
            id="filled-read-only-input"
            label="Read Only"
            defaultValue="Hello World"
            variant="filled"
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
          />
          <TextField
            id="filled-number"
            label="Number"
            type="number"
            variant="filled"
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />
        </div>
      </Box>
    </div>
  );
}
