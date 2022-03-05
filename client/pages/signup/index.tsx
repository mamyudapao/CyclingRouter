import Image from "next/image";
import styles from "./index.module.scss";
import { useState } from "react";
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import { useDispatch, useSelector } from "react-redux";
import { signInAction, UserState } from "../../reducks/user/userSlice";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const SignUp = (): JSX.Element => {
  const [email, setEmail] = useState<string>();
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const handleClickShowPassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const dispatch = useDispatch();

  const sendAccountInfo = async () => {
    if (email && username && password) {
      dispatch(
        signInAction({
          email: email,
          username: username,
          password: password,
        })
      );
    }
  };
  return (
    <>
      <div className={styles.signIn}>
        <div className={styles.card}>
          <h1>Make A Good Workout Habits!</h1>
          <h2>Make and Share Your Course!!</h2>
          <h1>
            <PeopleIcon />
          </h1>
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
            <FormControl variant="outlined">
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
            <Button
              variant="contained"
              onClick={sendAccountInfo}
              className={styles.button}
            >
              送信する
            </Button>
          </div>
          <div className={styles.imageWrapper}>
            <Image
              src={`https://ddx5fuyp1f5xu.cloudfront.net/undraw_bike_ride_7xit.png`}
              width="300vh"
              height="300vh"
            ></Image>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
