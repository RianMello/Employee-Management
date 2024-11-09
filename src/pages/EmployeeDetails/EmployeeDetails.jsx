import React from "react";

import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";

import { useEmployeeStore } from "../../store/store";
import defaultProfileImg from "../../assets/defaultProfile.png";
import { EmployeeFieldLabels } from "../../enums/enums";

function EmployeeDetails() {
  const employee = useEmployeeStore((state) => state.employee);

  const sortedHistory = [...employee.history].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );
  const formatDateTime = (date) => {
    return dayjs(date).format("DD/MM/YYYY");
  };

  return (
    <div>
      <Card
        sx={{
          maxWidth: 800,
          width: 500,
          boxShadow: 3,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <CardMedia
          component="img"
          height="200px"
          image={employee.profileImgUrl || defaultProfileImg}
          alt="Foto do Funcionário"
          sx={{ objectFit: "cover" }}
        />
        <CardContent>
          <Typography
            variant="h5"
            component="div"
            sx={{ fontWeight: "bold", mb: 1 }}
          >
            {employee.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {employee.position} - {employee.sector}
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              <strong>Data de Admissão:</strong>{" "}
              {formatDateTime(employee.admission)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Data de Nascimento:</strong>{" "}
              {formatDateTime(employee.birth)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Salário:</strong> R$ {employee.wage.toFixed(2)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Sexo:</strong> {employee.gender}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Telefone:</strong> {employee.phone}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Endereço:</strong> {employee.address}
            </Typography>
          </Box>
        </CardContent>
      </Card>
      <br />
      <Typography variant="h6" gutterBottom>
        Histórico de Alterações
      </Typography>
      <List>
        {sortedHistory.map((history, index) => (
          <ListItem
            key={index}
            sx={{
              boxShadow: "#c4c4c4 2px 5px 6px 0",
              padding: "10px",
              marginBottom: "6px",
              borderRadius: "6px",
            }}
          >
            <ListItemText
              primary={`Data da modificação: ${formatDateTime(
                history.timestamp
              )}`}
              secondary={Object.entries(history.changes).map(
                ([field, value]) => (
                  <div key={field}>
                    {EmployeeFieldLabels[field]}:{" "}
                    {value === true ? "Sim" : value}
                  </div>
                )
              )}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default EmployeeDetails;
