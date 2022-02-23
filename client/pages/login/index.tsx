import { TextField, Button, Card } from "@mui/material";
import Styles from "./index.module.scss";
import { useState } from "react";

import axios from "../../axisoApi";
import { useDispatch, useSelector } from "react-redux";
import { loginAction } from "../../reducks/user/userSlice";

const Login = (props: any): JSX.Element => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const dispatch = useDispatch();

  const sendInfo = async () => {
    if (email !== null && password !== null) {
      dispatch(loginAction({ email, password }));
    }
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
