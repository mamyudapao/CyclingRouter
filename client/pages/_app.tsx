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
import Head from "next/head";
const persistor = persistStore(store);

const App = ({ Component, pageProps }: any): JSX.Element => {
  const [auth, setAuth] = useState(Cookie.get("token"));
  pageProps.auth = auth;
  pageProps.setAuth = setAuth;
  return (
    <>
      <Head>
        <title>CyclingRouter</title>
      </Head>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Header auth={pageProps.auth} />
          <Component {...pageProps} />
        </PersistGate>
      </Provider>
    </>
  );
};

export default App;
