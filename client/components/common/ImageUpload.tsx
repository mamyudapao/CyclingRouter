import { Button } from "@mui/material";
import { Dispatch, SetStateAction, useRef } from "react";
import Styles from "./index.module.scss";

type PropsType = {
  setImage: Dispatch<SetStateAction<File | undefined>>;
  message: string;
};

const UploadButton = (props: PropsType): JSX.Element => {
  const inputEl = useRef<HTMLInputElement>(null!);

  return (
    <div>
      <Button
        variant="contained"
        onClick={() => {
          console.log(inputEl.current);
          inputEl.current.click();
        }}
      >
        {props.message}
        <input
          type="file"
          ref={inputEl}
          id={Styles.uploadButton}
          accept="image/*"
          onChange={(e) => {
            if (e.target.files) {
              console.log("aaa");
              props.setImage(e.target.files[0]);
            }
          }}
        />
      </Button>
    </div>
  );
};

export default UploadButton;
