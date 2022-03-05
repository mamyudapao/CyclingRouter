import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ImageUpload from "../components/common/ImageUpload";
import { PinDropTwoTone } from "@mui/icons-material";
import { Dispatch, SetStateAction } from "react";

type PropsType = {
  sendData: (title: string, description: string, image?: File) => void;
  setImage: Dispatch<SetStateAction<File | undefined>>;
};

export default function FormDialog(props: PropsType): JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const handleClick = () => {
    setOpen(!open);
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
          <ImageUpload
            message={"画像を投稿する！"}
            setImage={props.setImage}
          ></ImageUpload>
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
