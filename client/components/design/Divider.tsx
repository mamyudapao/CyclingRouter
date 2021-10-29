import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const InsetDivider = (props) => {
  return (
    <>
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
        }}
      >
        <ListItem>
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: "#ff3d00" }}>
              <FontAwesomeIcon icon={props.icon}></FontAwesomeIcon>
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={props.primary} secondary={props.secondary} />
        </ListItem>
        <Divider />
      </List>
    </>
  );
};

export default InsetDivider;
