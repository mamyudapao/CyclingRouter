import {
  TextField,
  Button,
  Card,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  OutlinedInput,
} from "@mui/material";
import Styles from "./index.module.scss";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginAction } from "../../reducks/user/userSlice";
import Image from "next/image";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = (): JSX.Element => {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const dispatch = useDispatch();

  const sendInfo = async () => {
    if (email && password) {
      dispatch(loginAction({ email, password }));
    }
  };

  const handleClickShowPassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <>
      <div className={Styles.wrapper}>
        <Card className={Styles.card}>
          <div className={Styles.contentWrapper}>
            <Image
              src={`https://ddx5fuyp1f5xu.cloudfront.net/5243.jpg`}
              width="450vh"
              height="250vh"
            />
            <div className={Styles.forms}>
              <TextField
                sx={{ m: 2 }}
                id="email-form"
                label="Email"
                variant="outlined"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <FormControl variant="outlined" sx={{ m: 2 }}>
                <InputLabel htmlFor="filled-adornment-password">
                  Password
                </InputLabel>
                <OutlinedInput
                  type={passwordVisible ? "text" : "password"}
                  value={password}
                  id="password-form"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {passwordVisible ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </div>
            <Button
              className={Styles.sendButton}
              variant="contained"
              onClick={sendInfo}
            >
              ログインする
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Login;
