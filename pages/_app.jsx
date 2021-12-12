import { SessionProvider } from "next-auth/react";
import Navbar from "../components/Navbar";
import "../styles/globals.css";
import "react-circular-progressbar/dist/styles.css";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Practice Parrot</title>
        <meta
          name="description"
          content="Practice Parrot makes practicing more rewarding, with a practice
          parrot buddy, rainbow colors and a competitive leaderboard!"
        />
        <meta property="og:title" content="Practice Parrot" />
        <meta property="og:url" content="https://practice-parrot.vercel.app" />
        <meta
          property="og:description"
          content="Practice Parrot makes practicing more rewarding, with a practice parrot buddy, rainbow colors and a competitive leaderboard!"
        />
        <meta property="og:image" content="/og.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Navbar />
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
