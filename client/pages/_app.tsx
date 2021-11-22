import "../styles/globals.scss";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import { useState } from "react";
import Cookie from "js-cookie";
const App = ({ Component, pageProps }) => {
  const [auth, setAuth] = useState(Cookie.get("token"));
  pageProps.auth = auth;
  pageProps.setAuth = setAuth;
  //if authがundefined | nullだったらHeaderが非ログイン仕様。
  //else ログイン仕様のHeaderにする
  return (
    <>
      <Header auth={pageProps.auth} />
      <Component {...pageProps} />
      <Footer />
    </>
  );
};

export default App;
