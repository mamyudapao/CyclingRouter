import { useState } from "react";
import {
  Dialog,
  Button,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
} from "@mui/material";
import AdapterDayjs from "@mui/lab/AdapterDayjs";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { DatePicker } from "@mui/lab";
import ImageUploader from "./ImageUpload";

type PropsType = {
  name: string;
  biography: string | null;
  location: string | null;
  birthday: Date | null;
  weight: number;
  height: number;
  image: File | undefined;
  updateProps: (
    newName?: string,
    newBiography?: string,
    newLocation?: string,
    newWeight?: number,
    newHeight?: number,
    newBirthday?: Date | string
  ) => void;
  updateImageProps: (newImage: File | undefined) => void;
  update: () => void;
};

const AlertDialog = (props: PropsType): JSX.Element => {
  const [open, setOpen] = useState(false);
  const [birthday, setBirthday] = useState<Date | null>(props.birthday);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleEmitUserProfile = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        プロフィールを編集する
      </Button>
      <Dialog open={open}>
        <DialogTitle id="alert-dialog-title">
          プロフィールを編集する
        </DialogTitle>
        <DialogContent>
          <TextField
            label="ユーザー名"
            fullWidth
            value={props.name}
            onChange={(event) => {
              console.log(event);
              props.updateProps(event.target.value);
            }}
          ></TextField>
          <TextField
            label="自己紹介"
            fullWidth
            multiline
            rows={4}
            value={props.biography}
            onChange={(event) => {
              props.updateProps(
                undefined,
                event.target.value,
                undefined,
                undefined,
                undefined,
                undefined
              );
            }}
          ></TextField>
          <TextField
            label="場所"
            fullWidth
            value={props.location}
            onChange={(event) => {
              props.updateProps(
                undefined,
                undefined,
                event.target.value,
                undefined,
                undefined,
                undefined
              );
            }}
          ></TextField>
          <TextField
            label="体重"
            value={props.weight}
            type="number"
            onChange={(event) => {
              props.updateProps(
                undefined,
                undefined,
                undefined,
                Number.parseInt(event.target.value),
                undefined,
                undefined
              );
            }}
          ></TextField>
          <TextField
            label="身長"
            value={props.height}
            type="number"
            onChange={(event) => {
              props.updateProps(
                undefined,
                undefined,
                undefined,
                undefined,
                Number.parseInt(event.target.value),
                undefined
              );
            }}
          ></TextField>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="誕生日"
              value={props.birthday}
              onChange={(newValue) => {
                setBirthday(newValue);
                props.updateProps(
                  undefined,
                  undefined,
                  undefined,
                  undefined,
                  undefined,
                  newValue!
                );
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <ImageUploader
            image={props.image}
            updateFunction={props.updateImageProps}
          ></ImageUploader>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取り消す</Button>
          <Button
            onClick={() => {
              props.update();
              handleClose();
            }}
          >
            変更する
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AlertDialog;
