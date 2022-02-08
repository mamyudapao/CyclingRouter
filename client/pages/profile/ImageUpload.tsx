import { Button } from "@mui/material";
import Styles from "./profile.module.scss";
import { useRef, useState } from "react";
import React from "react";
import axios from "../../axisoApi";

type propsType = {
  image: File | undefined;
  updateFunction: (image: File | undefined) => void;
};

const UploadButton = (props: propsType): JSX.Element => {
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
        プロフィール画像を投稿する
        <input
          type="file"
          ref={inputEl}
          accept="image/*"
          id={Styles.uploadProfile}
          onChange={(e) => {
            if (e.target.files) {
              props.updateFunction(e.target.files[0]);
            }
          }}
        />
      </Button>
    </div>
  );
};

export default UploadButton;
