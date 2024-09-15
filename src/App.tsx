import { useState } from "react";
import SignIn from "./SignIn";
import Box from "@mui/material/Box";
import Cookies from "js-cookie";

function App() {
  const [authToken, setAuthToken] = useState(Cookies.get("auth"));

  console.log(authToken);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      minWidth="100vw"
    >
      {authToken ? <div>Table</div> : <SignIn setAuthToken={setAuthToken} />}
    </Box>
  );
}

export default App;
