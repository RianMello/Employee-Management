import dayjs from "dayjs";
import "./Register.css";

function PDFToImpress({ employee }) {
  const formatDateTime = (date) => {
    if (date) {
      return dayjs(date).format("DD/MM/YYYY");
    }
    return date;
  };
  return (
    <div className="containerPDF">
      <div className="box">
        <h2>{employee.name}</h2>
        <p>{employee.position}</p>
      </div>
      <div className="box">
        <h3>Informações Pessoais</h3>
        <p>
          <strong>Data de Nascimento:</strong> {formatDateTime(employee.birth)}
        </p>
        <p>
          <strong>Sexo:</strong> {employee.gender}
        </p>
        <p>
          <strong>Telefone:</strong> {employee.phone}
        </p>
        <p>
          <strong>Endereço:</strong> {employee.address}
        </p>
      </div>
      <div className="box">
        <h3>Informações Profissionais</h3>
        <p>
          <strong>Data de Admissão:</strong>{" "}
          {formatDateTime(employee.admission)}
        </p>
        <p>
          <strong>Salario:</strong> R${employee.wage}
        </p>
        <p>
          <strong>Setor:</strong> {employee.sector}
        </p>
      </div>
    </div>
  );
}

export default PDFToImpress;
