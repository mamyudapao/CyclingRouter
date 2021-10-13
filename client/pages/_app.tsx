import '../styles/globals.css';
import Header from '../components/layout/header';
const App = ({Component, pageProps}) => {
  return (
    <div>

      <Header />
      <Component {...pageProps} />
    </div>
  )
}

export default App