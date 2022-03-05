import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";

type PropsType = {
  buttonText: string;
  title: string;
  titleValue: string;
  descriptionValue: string;
  contentText: string;
  sendData: (title: string, description: string) => void;
  onClickText: string;
};

const FormDialog = (props: PropsType) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState<string | undefined>("");
  const [description, setDescription] = useState<string | undefined>("");

  const handleClick = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (title === "" || description === "") {
      console.log(title);
      setTitle(props.titleValue);
      setDescription(props.descriptionValue);
    }
  });

  return (
    <>
      <Button variant="outlined" onClick={handleClick}>
        {props.buttonText}
      </Button>
      <Dialog open={open} onClose={handleClick}>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{props.contentText}</DialogContentText>
          <TextField
            fullWidth
            label="タイトル"
            variant="standard"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
          <TextField
            fullWidth
            label="説明"
            variant="standard"
            value={description}
            multiline
            onChange={(event) => {
              console.log(event.target.value);
              setDescription(event.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClick}>キャンセル</Button>
          <Button
            onClick={() => {
              if (typeof title === "string" && typeof description === "string")
                props.sendData(title, description);
            }}
          >
            {props.onClickText}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FormDialog;
