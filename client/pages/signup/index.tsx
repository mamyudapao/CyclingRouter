import Image from "next/image";
import styles from "./index.module.scss";
import { useState } from "react";
import { TextField, Button } from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { signInAction, UserState } from "../../reducks/user/userSlice";

import axios from "../../axisoApi"; //TODO: スペル修正
import store from "../../reducks/store/store";
import router from "next/router";

const SignUp = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [password2, setPassword2] = useState<string | null>(null);

  const dispatch = useDispatch();
  const store = useSelector((state: UserState) => state);

  const sendAccountInfo = async () => {
    if (email !== null && username !== null && password !== null) {
      dispatch(
        signInAction({
          email: email!,
          username: username!,
          password: password!,
        })
      );
    }
  };
  return (
    <>
      <div className={styles.signIn}>
        <div className={styles.leftSide}>
          <h1>SignUp</h1>
          <div className={styles.formWrapper}>
            <TextField
              id="email-form"
              label="Email"
              variant="outlined"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <TextField
              id="username-form"
              label="Username"
              variant="outlined"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <TextField
              id="password-form"
              label="Password"
              variant="outlined"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <TextField
              id="password2-form"
              label="Paddword2"
              variant="outlined"
              onChange={(e) => {
                setPassword2(e.target.value);
              }}
            />
            <Button variant="contained" onClick={sendAccountInfo}>
              送信する
            </Button>
          </div>
        </div>
        <div className={styles.rightSide}>
          <h1>Make A Good Workout Habits!</h1>
          <h2>Make and Shere Your Cours!!</h2>
          <div className={styles.imageWrapper}>
            <Image
              src="/../public/undraw_bike_ride_7xit.svg"
              width="300"
              height="300"
            ></Image>
          </div>
        </div>
      </div>
      <h1>Username {}</h1>
    </>
  );
};

export default SignUp;
