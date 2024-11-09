import { Grid2 } from "@mui/material";
import EmployeeForm from "./EmployeeForm";
import { storage } from "../../firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useEmployeeStore } from "../../store/store";
import EmployeePDFDocument from "./PDFViewer";
import { PDFViewer as ReactPDFViewer } from "@react-pdf/renderer";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useMediaQuery } from "@mui/material";
import PDFToImpress from "./PDFToImpress";

function EmployeeRegisterPage() {
  const employee = useEmployeeStore((state) => state.employee);
  const setEmployee = useEmployeeStore((state) => state.setEmployee);

  const isLargeScreen = useMediaQuery("(min-width:720px)");

  const generateAndUploadPDF = async () => {
    const storageRef = ref(storage, `pdfDocuments/${employee.name}`);

    try {
      const canvas = await html2canvas(document.querySelector("#pdf-content"));
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      const pdfBlob = pdf.output("blob");

      const uploadTask = await uploadBytesResumable(storageRef, pdfBlob);

      const pdfUrl = await getDownloadURL(uploadTask.ref).then((url) => {
        setEmployee({ pdfUrl: url });
        return url;
      });
      return pdfUrl;
    } catch (error) {
      console.error("Erro ao gerar e enviar o PDF:", error);
    }
  };

  return (
    <Grid2 container spacing={4}>
      <Grid2 item size={isLargeScreen ? 7 : 12}>
        <EmployeeForm generatePDF={generateAndUploadPDF} />
      </Grid2>
      <Grid2 item size={isLargeScreen ? 5 : 0}>
        <ReactPDFViewer showToolbar={false} width="100%" height="100%">
          <EmployeePDFDocument employee={employee} />
        </ReactPDFViewer>
        <div
          id="pdf-content"
          style={{ position: "absolute", top: "-9999px", left: "-9999px" }}
        >
          <PDFToImpress employee={employee} />
        </div>
      </Grid2>
    </Grid2>
  );
}

export default EmployeeRegisterPage;
