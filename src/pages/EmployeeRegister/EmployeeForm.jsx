import React, { useState } from "react";
import {
  Button,
  TextField,
  MenuItem,
  Typography,
  Grid2,
  CircularProgress,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useEmployeeStore } from "../../store/store";
import { ArrowBack, AddPhotoAlternate } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/styles.module.css";
import "./Register.css";
import * as Yup from "yup";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../../firebaseConfig";
import { VisuallyHiddenInput } from "../../styles/components/styled_components";
import defaultProfileImg from "../../assets/defaultProfile.png";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import SnackbarComponent from "../../components/feedback/SnackbarComponent";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Nome é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  gender: Yup.string()
    .required("Gênero é obrigatório")
    .oneOf(
      ["Masculino", "Feminino", "Outro"],
      'Gênero deve ser "Masculino", "Feminino" ou "Outro"'
    ),
  address: Yup.string().max(255, "Endereço deve ter no máximo 255 caracteres"),
  birth: Yup.string()
    .required("Data de nascimento é obrigatória")
    .test("age", "Deve ter pelo menos 14 anos", (value) => {
      if (!value) return false;
      const [year, month, day] = value.split("-");
      const birthDate = new Date(year, month - 1, day);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return (
        age > 14 ||
        (age === 14 && today >= new Date(today.getFullYear(), month - 1, day))
      );
    }),
  phone: Yup.string()
    .required("Telefone é obrigatório")
    .matches(/^\d+$/, "Telefone deve conter apenas números")
    .max(15, "Telefone deve ter no máximo 15 caracteres"),
  position: Yup.string()
    .required("Cargo é obrigatório")
    .max(50, "Cargo deve ter no máximo 50 caracteres"),
  admission: Yup.string()
    .required("Data de admissão é obrigatória")
    .test(
      "notFutureDate",
      "Data de admissão não pode ser no futuro",
      (value) => {
        if (!value) return false;
        const [year, month, day] = value.split("-");
        const admissionDate = new Date(year, month - 1, day);
        return admissionDate <= new Date();
      }
    ),
  sector: Yup.string()
    .required("Setor é obrigatório")
    .max(50, "Setor deve ter no máximo 50 caracteres"),
  wage: Yup.number()
    .required("Salário é obrigatório")
    .typeError("Salário deve ser um número")
    .positive("Salário deve ser um número positivo"),
});

function EmployeeForm({ generatePDF }) {
  const toNavigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const setEmployee = useEmployeeStore((state) => state.setEmployee);
  const employee = useEmployeeStore((state) => state.employee);
  const employeeSelected = useEmployeeStore((state) => state.employeeSelected);

  const handleUploadImg = (event) => {
    event.preventDefault();
    const file = event.target?.files[0];
    if (!file) return;

    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        console.log(snapshot);
      },
      (error) => alert(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setEmployee({ profileImgUrl: url });
        });
      }
    );
  };

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const pdfUrl = await generatePDF();
      if (employee.id) {
        const employeeToEdit = doc(db, "employees", employee.id);
        const employeeSnap = await getDoc(employeeToEdit);

        if (employeeSnap.exists()) {
          const currentData = employeeSnap.data();
          const changes = {};

          Object.keys(values).forEach((key) => {
            if (values[key] !== currentData[key]) {
              changes[key] = values[key];
            }
          });

          if (Object.keys(changes).length > 0) {
            const historyEntry = {
              timestamp: new Date().toISOString(),
              changes,
            };
            await updateDoc(employeeToEdit, {
              ...employee,
              history: [...(currentData.history || []), historyEntry],
            });
          } else {
            await updateDoc(employeeToEdit, {
              ...employee,
              pdfUrl: pdfUrl,
            });
          }
        }
        setSnackbar({
          open: true,
          message: "Registro do funcionário editado com sucesso!",
          severity: "success",
        });
      } else {
        await addDoc(collection(db, "employees"), {
          ...employee,
          id: crypto.randomUUID(),
          pdfUrl: pdfUrl,
        });
        setSnackbar({
          open: true,
          message: "Funcionário cadastrado com sucesso!",
          severity: "success",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erro ao salvar o funcionário. Tente novamente!",
        severity: "error",
      });
    } finally {
      setLoading(false);
      resetForm();
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
    toNavigate("/employees");
  };

  const initialValues = () => {
    if (employeeSelected) {
      return {
        name: employee.name,
        gender: employee.gender,
        address: employee.address,
        birth: employee.birth,
        phone: employee.phone,
        position: employee.position,
        admission: employee.admission,
        sector: employee.sector,
        wage: employee.wage,
      };
    }
    return {
      name: "",
      gender: "",
      address: "",
      birth: "",
      phone: "",
      position: "",
      admission: "",
      sector: "",
      wage: "",
    };
  };

  return (
    <div className="containerForm">
      <Typography class={styles.title}>Cadastro de Funcionário</Typography>

      <Formik
        initialValues={initialValues()}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        validateOnChange
        validate={(values) => {
          setEmployee(values);
        }}
      >
        {() => (
          <Form>
            <Grid2 container spacing={4}>
              <Grid2 item size={6}>
                <Field name="name">
                  {({ field }) => (
                    <TextField
                      {...field}
                      label="Nome"
                      fullWidth
                      margin="normal"
                      variant="filled"
                      helperText={
                        <ErrorMessage className="errorMessage" name="name" />
                      }
                    />
                  )}
                </Field>
                <Field name="gender">
                  {({ field }) => (
                    <TextField
                      {...field}
                      label="Gênero"
                      select
                      fullWidth
                      margin="normal"
                      variant="filled"
                      helperText={<ErrorMessage name="gender" />}
                    >
                      <MenuItem value="Masculino">Masculino</MenuItem>
                      <MenuItem value="Feminino">Feminino</MenuItem>
                      <MenuItem value="Outro">Outro</MenuItem>
                    </TextField>
                  )}
                </Field>
              </Grid2>
              <Grid2 item size={6}>
                <div className="profileImgContainer">
                  {!employee.profileImgUrl && (
                    <img
                      className="profileImg"
                      src={defaultProfileImg}
                      alt="User"
                    />
                  )}
                  {employee.profileImgUrl && (
                    <img
                      className="profileImg"
                      src={employee.profileImgUrl}
                      alt="User"
                    />
                  )}
                  <div className="profileImgActions">
                    <div className="label">
                      <Typography
                        className="text"
                        variant="subtitle1"
                        component="span"
                      >
                        Foto do Perfil
                      </Typography>
                    </div>
                    <Button
                      component="label"
                      tabIndex={-1}
                      startIcon={<AddPhotoAlternate />}
                    >
                      Adicionar
                      <VisuallyHiddenInput
                        type="file"
                        onChange={handleUploadImg}
                      />
                    </Button>
                  </div>
                </div>
              </Grid2>
            </Grid2>

            <Field name="address">
              {({ field }) => (
                <TextField
                  {...field}
                  label="Endereço"
                  fullWidth
                  margin="normal"
                  variant="filled"
                  helperText={<ErrorMessage name="address" />}
                />
              )}
            </Field>
            <Grid2 container spacing={2} className={styles.row}>
              <Grid2 item size={6}>
                <Field name="phone">
                  {({ field }) => (
                    <TextField
                      {...field}
                      label="Telefone"
                      fullWidth
                      margin="normal"
                      variant="filled"
                      helperText={<ErrorMessage name="phone" />}
                    />
                  )}
                </Field>
              </Grid2>
              <Grid2 item size={6}>
                <Field name="birth">
                  {({ field }) => (
                    <TextField
                      {...field}
                      label="Data de Nascimento"
                      type="date"
                      fullWidth
                      margin="normal"
                      variant="filled"
                      helperText={<ErrorMessage name="birth" />}
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                </Field>
              </Grid2>
            </Grid2>

            <Field name="position">
              {({ field }) => (
                <TextField
                  {...field}
                  label="Cargo"
                  fullWidth
                  margin="normal"
                  variant="filled"
                  helperText={<ErrorMessage name="position" />}
                />
              )}
            </Field>
            <Field name="admission">
              {({ field }) => (
                <TextField
                  {...field}
                  label="Data de Admissão"
                  type="date"
                  fullWidth
                  margin="normal"
                  variant="filled"
                  helperText={<ErrorMessage name="admission" />}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            </Field>
            <Field name="sector">
              {({ field }) => (
                <TextField
                  {...field}
                  label="Setor"
                  fullWidth
                  margin="normal"
                  variant="filled"
                  helperText={<ErrorMessage name="sector" />}
                />
              )}
            </Field>
            <Field name="wage">
              {({ field }) => (
                <TextField
                  {...field}
                  label="Salário"
                  type="number"
                  fullWidth
                  margin="normal"
                  variant="filled"
                  helperText={<ErrorMessage name="wage" />}
                />
              )}
            </Field>

            <div className="buttons">
              <Button
                startIcon={<ArrowBack />}
                onClick={() => toNavigate("/employees")}
              >
                Anterior
              </Button>
              <Button
                type="submit"
                disabled={loading}
                startIcon={loading && <CircularProgress size="1rem" />}
                variant="contained"
              >
                Proximo
              </Button>
            </div>
          </Form>
        )}
      </Formik>
      <SnackbarComponent
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        handleSnackbarClose={handleSnackbarClose}
      />
    </div>
  );
}

export default EmployeeForm;
