import React, { useState } from "react";
import { auth } from "../../firebaseConfig";
import { Button, Container, TextField, Typography } from "@mui/material";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logoTaugor.png";
import "./LoginPage.css";
import styles from "../../styles/styles.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");

  const toNavigate = useNavigate();
  const handleAuth = async () => {
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      toNavigate("/employees");
    } catch (error) {
      switch (error.message) {
        case "Firebase: Error (auth/invalid-credential).":
          setError("Email ou Senha estão incorretos");
          break;
        case "Firebase: Error (auth/invalid-email).":
          setError(
            "Usuário não encontrado, registre-se primeiro ou verifique os dados"
          );
          break;
        default:
          setError(error.message);
      }
    }
  };
  return (
    <Container maxWidth="sm">
      <img src={logo} alt="Logo Taugor" />
      <Typography class={styles.title} variant="h2">
        {isSignUp ? "Cadastre-se" : "Login"}
      </Typography>
      <Typography class={styles.subtitle} variant="h4">
        {isSignUp
          ? "Registre um email e uma senha para ter acesso ao sistema"
          : "Informe seu email e senha"}
      </Typography>
      <TextField
        label="Email"
        variant="filled"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Senha"
        variant="filled"
        fullWidth
        margin="normal"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <Typography color="error">{error}</Typography>}
      <div className="buttons">
        <Button onClick={handleAuth} variant="contained" color="primary">
          {isSignUp ? "Cadastre-se" : "Entrar"}
        </Button>
        <Button onClick={() => setIsSignUp(!isSignUp)} variant="text">
          {isSignUp
            ? "Já tem uma conta? Entre com ela"
            : "Não tem um conta? Cadastre-se aqui"}
        </Button>
      </div>
    </Container>
  );
}
