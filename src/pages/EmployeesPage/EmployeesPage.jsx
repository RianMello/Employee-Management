import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { db } from "../../firebaseConfig";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useEmployeeStore } from "../../store/store";

import { Button, Typography, Container } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import styles from "../../styles/styles.module.css";
import noData from "../../assets/noData.png";

import SkeletonList from "../../components/feedback/SkeletonList";

import SnackbarComponent from "../../components/feedback/SnackbarComponent";
import { DeleteDialog, DismissDialog } from "./Dialogs";
import Listing from "./Listing";

function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dismissDialogOpen, setDismissDialogOpen] = useState(false);
  const [employeeToDismiss, setEmployeeToDismiss] = useState(null);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const setEmployee = useEmployeeStore((state) => state.setEmployee);
  const setEmployeeSelected = useEmployeeStore(
    (state) => state.setEmployeeSelected
  );
  const toNavigate = useNavigate();
  const getEmployees = async () => {
    try {
      const response = await getDocs(collection(db, "employees"));
      const datas = response.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setEmployees(datas);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Ocorreu algum erro, tente novamente!",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEmployees();
  }, []);

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
    toNavigate("/employees");
  };

  const openDismissDialog = (employee) => {
    setEmployeeToDismiss(employee);
    setDismissDialogOpen(true);
  };

  const closeDismissDialog = () => {
    setDismissDialogOpen(false);
    setEmployeeToDismiss(null);
  };

  const openDeleteDialog = (employee) => {
    setEmployeeToDelete(employee);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

  const handleDismissEmployee = async () => {
    if (!employeeToDismiss) return;
    try {
      const employeeDoc = doc(db, "employees", employeeToDismiss.id);
      const changes = {
        dismiss: true,
        sector: "Nenhum",
        position: "Nenhum",
        wage: 0,
      };

      const historyEntry = {
        timestamp: new Date().toISOString(),
        changes,
      };
      await updateDoc(employeeDoc, {
        ...employeeToDismiss,
        dismiss: true,
        sector: "Nenhum",
        position: "Nenhum",
        wage: 0,
        history: [...(employeeToDismiss.history || []), historyEntry],
      });

      setSnackbar({
        open: true,
        message: "Funcionário Demitido com sucesso!",
        severity: "sucess",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          "Ocorreu algum erro ao tentar demitir o funcionário, tente novamente!",
        severity: "error",
      });
    } finally {
      closeDismissDialog();
      getEmployees();
    }
  };

  const handleDeleteEmployee = async () => {
    if (!employeeToDelete) return;
    try {
      const employeeDoc = doc(db, "employees", employeeToDelete.id);
      await deleteDoc(employeeDoc);
      setSnackbar({
        open: true,
        message: "Registro apagado com sucesso!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          "Ocorreu um erro ao tentar excluir o registro, tente novamente!",
        severity: "error",
      });
    } finally {
      closeDeleteDialog();
      getEmployees();
    }
  };

  const onViewDetails = (employee) => {
    setEmployee(employee);
    toNavigate("/employee");
  };

  const onEdit = (employee) => {
    setEmployee(employee);
    setEmployeeSelected(employee.id);
    toNavigate("/register");
  };

  const onCreate = () => {
    setEmployee({
      id: "",
      name: "",
      gender: "",
      address: "",
      phone: "",
      birth: "",
      position: "",
      admission: "",
      sector: "",
      wage: "",
      profileImgUrl: "",
      pdfUrl: "",
      history: [],
      dismiss: false,
    });
    setEmployeeSelected(null);
    toNavigate("/register");
  };

  return (
    <Container maxWidth="md">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Typography class={styles.title}>Funcionários</Typography>
        <Button startIcon={<AddIcon />} onClick={() => onCreate()}>
          Cadastrar Novo
        </Button>
      </div>

      <Typography class={styles.subtitle}>
        Esses são todos os funcionários registrados em nossa base de dados
      </Typography>
      {loading ? (
        <SkeletonList />
      ) : employees.length > 0 ? (
        <Listing
          employees={employees}
          openDeleteDialog={openDeleteDialog}
          openDismissDialog={openDismissDialog}
          onEdit={onEdit}
          onViewDetails={onViewDetails}
        />
      ) : (
        <img
          src={noData}
          alt="Sem dados cadastrados"
          width={500}
          height={500}
        />
      )}
      <DeleteDialog
        deleteDialogOpen={deleteDialogOpen}
        closeDeleteDialog={closeDeleteDialog}
        handleDeleteEmployee={handleDeleteEmployee}
      />
      <DismissDialog
        dismissDialogOpen={dismissDialogOpen}
        closeDismissDialog={closeDismissDialog}
        handleDismissEmployee={handleDismissEmployee}
      />
      <SnackbarComponent
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        handleSnackbarClose={handleSnackbarClose}
      />
    </Container>
  );
}

export default EmployeesPage;
