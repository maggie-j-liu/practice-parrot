import { SessionProvider } from "next-auth/react";
import Navbar from "../components/Navbar";
import "../styles/globals.css";
import "react-circular-progressbar/dist/styles.css";
import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Navbar />
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
