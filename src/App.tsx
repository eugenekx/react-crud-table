import { useState } from "react";
import SignIn from "./SignIn";
import Box from "@mui/material/Box";
import Cookies from "js-cookie";
import DataTable from "./DataTable";

const HOST = "https://test.v5.pryaniky.com";

function App() {
  const [authToken, setAuthToken] = useState(Cookies.get("auth"));

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      minWidth="100vw"
    >
      {authToken ? (
        <DataTable host={HOST} authToken={authToken} />
      ) : (
        <SignIn host={HOST} setAuthToken={setAuthToken} />
      )}
    </Box>
  );
}

export default App;
