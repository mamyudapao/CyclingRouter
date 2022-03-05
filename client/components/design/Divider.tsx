import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import Styles from "./index.module.scss";

type ButtonDefinition = {
  icon: IconDefinition;
  buttonFunction: any;
};

type DividerProps = {
  button?: ButtonDefinition;
  icon: IconDefinition;
  info?: any;
  bgColor: string;
  primary: any;
  secondary: any;
  width: string;
};

const InsetDivider = (props: DividerProps): JSX.Element => {
  return (
    <>
      <List
        sx={{
          width: props.width, //TODO: propsで渡す形にする
          maxWidth: 250,
          bgcolor: "background.paper",
        }}
      >
        <ListItem>
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: props.bgColor }}>
              <FontAwesomeIcon icon={props.icon} />
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
