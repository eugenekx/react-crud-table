import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import AppTheme from "./AppTheme";
import CssBaseline from "@mui/material/CssBaseline";
import { useEffect, useState } from "react";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";

const columns: GridColDef[] = [
  { field: "companySigDate", headerName: "Company Signature Date", width: 150 },
  {
    field: "companySignatureName",
    headerName: "Company Signature Name",
    width: 150,
  },
  { field: "documentName", headerName: "Document Name", width: 150 },
  { field: "documentStatus", headerName: "Status", width: 150 },
  { field: "documentType", headerName: "Type", width: 150 },
  { field: "employeeNumber", headerName: "Employee Number", width: 150 },
  {
    field: "employeeSigDate",
    headerName: "Employee Signature Date",
    width: 150,
  },
  {
    field: "employeeSignatureName",
    headerName: "Employee Signature Name",
    width: 150,
  },
];

const Card = styled(MuiCard)(({ theme }) => ({
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: theme.spacing(4),
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

export default function DataTable(props: {
  disableCustomTheme?: boolean;
  host: string;
  authToken: string;
}) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "x-auth": props.authToken,
      },
    };
    const query = fetch(
      `${props.host}/ru/data/v3/testmethods/docs/userdocs/get`,
      options
    )
      .then((response) => response.json())
      .then((data) => {
        setRows(data.data);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Card variant="outlined">
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </Card>
    </AppTheme>
  );
}
