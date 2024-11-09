import React from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import dayjs from "dayjs";

function EmployeePDFDocument({ employee }) {
  const formatDateTime = (date) => {
    if (date) {
      return dayjs(date).format("DD/MM/YYYY");
    }
    return date;
  };

  return (
    <Document title={`${employee.name}.pdf`}>
      <Page size="A4" style={{ padding: 20 }}>
        <View
          style={{ marginBottom: 10, border: "1px solid #c4c4c4", padding: 10 }}
        >
          <Text style={{ fontSize: 32, fontWeight: 700, color: "#2582c4" }}>
            {employee.name || "Nome"}
          </Text>
          <Text style={{ color: "#7d8991" }}>{employee.position}</Text>
        </View>
        <View
          style={{ marginBottom: 10, border: "1px solid #c4c4c4", padding: 10 }}
        >
          <Text
            style={{
              marginBottom: 10,
              fontSize: 28,
              fontWeight: "bold",
              color: "#040f17",
            }}
          >
            Informações Pessoais
          </Text>
          <Text style={{ marginBottom: 5 }}>
            <Text>Data de Nascimento:</Text>{" "}
            <Text style={{ color: "#7d8991" }}>
              {" "}
              {formatDateTime(employee.birth)}
            </Text>
          </Text>
          <Text style={{ marginBottom: 5 }}>
            Gênero: <Text style={{ color: "#7d8991" }}>{employee.gender}</Text>{" "}
          </Text>
          <Text style={{ marginBottom: 5 }}>
            Endereço:{" "}
            <Text style={{ color: "#7d8991" }}>{employee.address}</Text>
          </Text>
          <Text style={{ marginBottom: 5 }}>
            Telefone:{" "}
            <Text style={{ color: "#7d8991" }}> {employee.phone}</Text>
          </Text>
        </View>
        <View
          style={{ marginBottom: 10, border: "1px solid #c4c4c4", padding: 10 }}
        >
          <Text
            style={{
              marginBottom: 10,
              fontSize: 28,
              fontWeight: "bold",
              color: "#040f17",
            }}
          >
            Informações Profissionais
          </Text>
          <Text style={{ marginBottom: 5 }}>
            Data de Admissão:
            <Text style={{ color: "#7d8991" }}>
              {formatDateTime(employee.admission)}
            </Text>
          </Text>
          <Text style={{ marginBottom: 5 }}>
            Setor: <Text style={{ color: "#7d8991" }}>{employee.sector}</Text>{" "}
          </Text>
          <Text style={{ marginBottom: 5 }}>
            Salário:{" "}
            <Text style={{ color: "#7d8991" }}>R$ {employee.wage}</Text>{" "}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
export default EmployeePDFDocument;
