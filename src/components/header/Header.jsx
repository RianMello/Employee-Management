import { Button, Grid2, Typography } from "@mui/material";
import Logo from "../../assets/logoTaugor.png";
import "./Header.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import { useAuth } from "../../context/AuthContext";

function Header() {
  const local = useLocation();
  const toNavigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("");

  const { logout, currentUser } = useAuth();

  useEffect(() => {
    switch (local.pathname) {
      case "/employees":
        setCurrentPage("Listagem de Funcionários");
        break;
      case "/register":
        setCurrentPage("Cadastro e Edição de Funcionário");
        break;
      case "/employee":
        setCurrentPage("Detalhes do Funcionário");
        break;
      default:
        setCurrentPage(
          "Bem vindo ao sistema de gerenciamento de funcionários Taugor"
        );
    }
  }, [local.pathname]);
  return (
    <div className="header">
      <Grid2 container direction="row">
        <Grid2 size={2}>
          <img className="logo" src={Logo} alt="logo" />
        </Grid2>
        <Grid2 size={8.5}>
          <div className="steps">
            <Typography
              variant="subtitle1"
              component="span"
              class="stepCurrent"
            >
              {currentPage}
            </Typography>
          </div>
        </Grid2>
        <Grid2 size={1.5}>
          <div className="button">
            <Button onClick={() => toNavigate("/employees")}>
              <HomeIcon />
            </Button>
            {currentUser && (
              <Button onClick={logout}>
                <LogoutIcon color="disabled" />
              </Button>
            )}
          </div>
        </Grid2>
      </Grid2>
    </div>
  );
}

export default Header;
