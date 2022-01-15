import "../styles/globals.scss";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import { useState } from "react";
import Cookie from "js-cookie";

import { Provider } from "react-redux";
import { useSelector } from "react-redux";
import store from "../reducks/store/store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
const persistor = persistStore(store);

const App = ({ Component, pageProps }: any) => {
  const [auth, setAuth] = useState(Cookie.get("token"));
  pageProps.auth = auth;
  pageProps.setAuth = setAuth;
  //if authがundefined | nullだったらHeaderが非ログイン仕様。
  //else ログイン仕様のHeaderにする
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Header auth={pageProps.auth} />
          <Component {...pageProps} />
          <Footer />
        </PersistGate>
      </Provider>
    </>
  );
};

export default App;
