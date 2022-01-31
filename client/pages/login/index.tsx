import { Container, TextField, Button, Card } from "@mui/material";
import Styles from "./index.module.scss";
import { useState } from "react";
import Cookie from "js-cookie";

import axios from "../../axisoApi";

const Login = (props) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const sendInfo = async () => {
    await axios
      .post("auth/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        console.log(response);
        Cookie.set("token", response.data.token);
        Cookie.set("refresh_token", response.data.refresh_token);
        props.setAuth(response.data.token);
      });
  };

  return (
    <>
      <div className={Styles.wrapper}>
        <h1>Login!!</h1>
        <Card className={Styles.card}>
          <div className={Styles.forms}>
            <TextField
              id="email-form"
              label="Email"
              variant="outlined"
              onChange={(e) => {
                setEmail(e.target.value);
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
          </div>
          <Button
            className={Styles.sendButton}
            variant="contained"
            onClick={sendInfo}
          >
            送信する
          </Button>
        </Card>
      </div>
    </>
  );
};

export default Login;
