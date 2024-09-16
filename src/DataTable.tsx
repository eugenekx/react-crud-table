import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  GridSlots,
} from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import AppTheme from "./AppTheme";
import CssBaseline from "@mui/material/CssBaseline";
import { useEffect, useState } from "react";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import { randomId } from "@mui/x-data-grid-generator";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

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

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomId();
    const now = new Date(Date.now());
    setRows((oldRows) => [
      {
        id,
        companySigDate: now,
        companySignatureName: "",
        documentName: "",
        documentStatus: "",
        documentType: "",
        employeeNumber: "",
        employeeSigDate: now,
        employeeSignatureName: "",
        isNew: true,
      },
      ...oldRows,
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "companySigDate" },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

export default function DataTable(props: {
  disableCustomTheme?: boolean;
  host: string;
  authToken: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingData, setIsUpdatingData] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [serverErrorMessage, setServerErrorMessage] = useState("");

  const [rows, setRows] = useState<GridRowModel[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const columns: GridColDef[] = [
    {
      field: "companySigDate",
      headerName: "Company Signature Date",
      type: "date",
      width: 180,
      editable: true,
    },
    {
      field: "companySignatureName",
      headerName: "Company Signature Name",
      type: "string",
      width: 150,
      editable: true,
    },
    {
      field: "documentName",
      headerName: "Document Name",
      type: "string",
      width: 150,
      editable: true,
    },
    {
      field: "documentStatus",
      headerName: "Status",
      type: "singleSelect",
      valueOptions: ["Подписан", "Не подписан"],
      width: 150,
      editable: true,
    },
    {
      field: "documentType",
      headerName: "Type",
      type: "singleSelect",
      valueOptions: ["Трудовой договор", "Приказ о приеме"],
      width: 150,
      editable: true,
    },
    {
      field: "employeeNumber",
      headerName: "Employee Number",
      type: "string",
      width: 150,
      editable: true,
    },
    {
      field: "employeeSigDate",
      headerName: "Employee Signature Date",
      type: "date",
      width: 180,
      editable: true,
    },
    {
      field: "employeeSignatureName",
      headerName: "Employee Signature Name",
      type: "string",
      width: 150,
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const deleteRowOnServer = (id: GridRowId) => {
    setIsUpdatingData(true);
    setServerError(false);
    setServerErrorMessage("");

    const options = {
      method: "POST",
      headers: {
        "x-auth": props.authToken,
      },
    };
    fetch(
      `${props.host}/ru/data/v3/testmethods/docs/userdocs/delete/${id}`,
      options
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.error_code !== 0) {
          console.error(data.error_message);
          setServerError(true);
          setServerErrorMessage(data.error_message);
        }
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setIsUpdatingData(false);
      });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    deleteRowOnServer(id);
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const createOrUpdateRowOnServer = (row: GridRowModel, url: string) => {
    setIsUpdatingData(true);
    setServerError(false);
    setServerErrorMessage("");

    const companySigDate = row.companySigDate.toISOString();
    const employeeSigDate = row.employeeSigDate.toISOString();

    const {
      companySignatureName,
      documentName,
      documentStatus,
      documentType,
      employeeNumber,
      employeeSignatureName,
    } = row;

    const options = {
      method: "POST",
      body: JSON.stringify({
        companySigDate,
        companySignatureName,
        documentName,
        documentStatus,
        documentType,
        employeeNumber,
        employeeSigDate,
        employeeSignatureName,
      }),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "x-auth": props.authToken,
      },
    };

    fetch(`${props.host}${url}`, options)
      .then((response) => response.json())
      .then((data) => {
        if (data.error_code !== 0) {
          console.error(data.title);
          setServerError(true);
          setServerErrorMessage(data.title);
        }
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setIsUpdatingData(false);
      });
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };

    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

    // select the endpoint (create/update)
    const url =
      newRow.isNew === true
        ? "/ru/data/v3/testmethods/docs/userdocs/create"
        : `/ru/data/v3/testmethods/docs/userdocs/set/${newRow.id}`;
    createOrUpdateRowOnServer(newRow, url);

    // TODO: if validation fails -- undo create/update row in the grid
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  // GET data rows
  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "x-auth": props.authToken,
      },
    };

    fetch(`${props.host}/ru/data/v3/testmethods/docs/userdocs/get`, options)
      .then((response) => response.json())
      .then((data) => {
        const processedData = data.data.map(
          (item: { companySigDate: string; employeeSigDate: string }) => {
            const companySigDate = new Date(item.companySigDate);
            const employeeSigDate = new Date(item.employeeSigDate);

            return { ...item, companySigDate, employeeSigDate };
          }
        );
        setRows(processedData);
        setIsLoading(false);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />{" "}
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Card variant="outlined">
          <DataGrid
            autoHeight
            rows={rows}
            columns={columns}
            pageSizeOptions={[5, 10]}
            sx={{ border: 0 }}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            slots={{
              toolbar: EditToolbar as GridSlots["toolbar"],
            }}
            slotProps={{
              toolbar: { setRows, setRowModesModel },
            }}
          />
          <Snackbar open={isUpdatingData} message="Updating Data...">
            <Alert
              severity="info"
              color="success"
              icon={<CircularProgress size={20} />}
              variant="filled"
              sx={{ width: "100%" }}
            >
              Updating...
            </Alert>
          </Snackbar>
          <Snackbar
            open={serverError}
            autoHideDuration={4000}
            onClose={() => {
              setServerError(false);
              setServerErrorMessage("");
            }}
          >
            <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
              Server Error: {serverErrorMessage}
            </Alert>
          </Snackbar>
        </Card>
      )}
    </AppTheme>
  );
}
