import "../styles/globals.css";
import Header from "../components/layout/header";
import { useState } from "react";
import Cookie from "js-cookie";
const App = ({ Component, pageProps }) => {
  const [auth, setAuth] = useState(Cookie.get("auth"));
  pageProps.auth = auth;
  pageProps.setAuth = setAuth;
  //if authがundefined | nullだったらHeaderが非ログイン仕様。
  //else ログイン仕様のHeaderにする
  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  );
};

export default App;
