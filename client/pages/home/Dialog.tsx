import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Props } from "@fortawesome/react-fontawesome";

type PropsType = {
  sendData: (title: string, description: string) => void;
};

export default function FormDialog(props: PropsType) {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");

  const handleClick = () => {
    setOpen(!open);
  };
  const sendData = () => {
    console.log("send!");
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClick}>
        コースを保存する
      </Button>
      <Dialog open={open} onClose={handleClick}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            保存するコースについて入力してください。
          </DialogContentText>
          <TextField
            fullWidth
            label="タイトル"
            variant="standard"
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
          <TextField
            fullWidth
            label="説明"
            variant="standard"
            multiline
            onChange={(event) => {
              setDescription(event.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClick}>キャンセル</Button>
          <Button
            onClick={() => {
              props.sendData(title, description);
            }}
          >
            保存する！
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
