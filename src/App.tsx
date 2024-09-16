import { useState } from "react";
import SignIn from "./SignIn";
import Box from "@mui/material/Box";
import Cookies from "js-cookie";
import DataTable from "./DataTable";
import Button from "@mui/material/Button";

const HOST = "https://test.v5.pryaniky.com";

function App() {
  const [authToken, setAuthToken] = useState(Cookies.get("auth"));

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Box position="absolute" top={20} right={20}>
        <Button
          variant="text"
          onClick={() => {
            setAuthToken(undefined);
          }}
        >
          Sign Out
        </Button>
      </Box>

      {authToken ? (
        <DataTable host={HOST} authToken={authToken} />
      ) : (
        <SignIn host={HOST} setAuthToken={setAuthToken} />
      )}
    </Box>
  );
}

export default App;
