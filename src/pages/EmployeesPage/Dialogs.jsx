import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Typography,
} from "@mui/material";
import React from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function DismissDialog({
  dismissDialogOpen,
  closeDismissDialog,
  handleDismissEmployee,
}) {
  return (
    <Dialog
      TransitionComponent={Transition}
      open={dismissDialogOpen}
      onClose={closeDismissDialog}
    >
      <DialogTitle>Deseja demitir o funcionário?</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          Esta ação é irreversivel, confirmando ela você estará removendo o
          funcionario do cargo atual. Seu registro ainda ficará salvo para
          visualização, porém não será mais possivel edita-lo futuramente.
          Deseja mesmo continuar?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDismissDialog} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleDismissEmployee} color="secondary">
          Sim, demitir
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function DeleteDialog({
  deleteDialogOpen,
  closeDeleteDialog,
  handleDeleteEmployee,
}) {
  return (
    <Dialog
      TransitionComponent={Transition}
      open={deleteDialogOpen}
      onClose={closeDeleteDialog}
    >
      <DialogTitle>Deseja excluir o registro do funcionário?</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          Esta ação é irreversivel, confirmando ela você estará removendo o
          registro do funcionario de nossa base de dados. Deseja continuar?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDeleteDialog} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleDeleteEmployee} color="secondary">
          Sim, excluir
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export { DismissDialog, DeleteDialog };
