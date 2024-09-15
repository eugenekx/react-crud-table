import { useState } from "react";
import SignIn from "./SignIn";
import Box from "@mui/material/Box";
function App() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      minWidth="100vw"
    >
      <SignIn />
    </Box>
  );
}

export default App;
