import Image from "next/image";
import styles from "./index.module.scss";
import { useState } from "react";
import { TextField, Button } from "@mui/material";

import axios from "../../axisoApi";

const Login = () => {
  const [email, setEmail] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [password2, setPassword2] = useState(null);

  const sendAccountInfo = async () => {
    if (password === password2) {
      await axios
        .post("/users/", {
          email: email,
          username: username,
          password: password,
        })
        .then((response) => {
          console.log(response);
        });
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
    </>
  );
};

export default Login;
