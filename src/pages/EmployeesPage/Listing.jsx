import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
} from "@mui/material";
import defaultProfileImg from "../../assets/defaultProfile.png";
import {
  Delete,
  Edit,
  PersonRemoveAlt1,
  PictureAsPdf,
  Visibility,
} from "@mui/icons-material";

function Listing({
  employees,
  openDeleteDialog,
  openDismissDialog,
  onEdit,
  onViewDetails,
}) {
  return (
    <List
      sx={{
        width: "100%",
      }}
    >
      {employees.map((employee) => {
        return (
          <ListItem
            key={employee.id}
            sx={{
              boxShadow: "#c4c4c4 2px 5px 6px 0",
              padding: "10px",
              marginBottom: "6px",
              borderRadius: "6px",
            }}
          >
            <ListItemAvatar>
              <Avatar>
                <img
                  src={employee.profileImgUrl || defaultProfileImg}
                  alt="unckown"
                  width="100%"
                  height="100%"
                />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={employee.name}
              secondary={employee.position}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              {!employee.dismiss && (
                <Tooltip title="Editar">
                  <IconButton onClick={() => onEdit(employee)} color="primary">
                    <Edit />
                  </IconButton>
                </Tooltip>
              )}
              {!employee.dismiss && (
                <Tooltip title="Demitir">
                  <IconButton
                    onClick={() => openDismissDialog(employee)}
                    color="error"
                  >
                    <PersonRemoveAlt1 />
                  </IconButton>
                </Tooltip>
              )}
              {employee.dismiss && (
                <Tooltip title="Excluir Registro">
                  <IconButton
                    onClick={() => openDeleteDialog(employee)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Ver mais">
                <IconButton
                  onClick={() => onViewDetails(employee)}
                  color="default"
                >
                  <Visibility />
                </IconButton>
              </Tooltip>
              <Tooltip title="Ver PDF">
                <a
                  href={employee.pdfUrl}
                  download={`${employee.name}.pdf`}
                  rel="noreferrer noopener"
                  target="_blank"
                  style={{ textDecoration: "none" }}
                >
                  <IconButton>
                    <PictureAsPdf />
                  </IconButton>
                </a>
              </Tooltip>
            </div>
          </ListItem>
        );
      })}
    </List>
  );
}

export default Listing;
