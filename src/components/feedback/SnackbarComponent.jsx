import { Alert, Snackbar } from "@mui/material";

export default function SnackbarComponent({
  open,
  severity,
  message,
  handleSnackbarClose,
}) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleSnackbarClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={handleSnackbarClose}
        severity={severity}
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
