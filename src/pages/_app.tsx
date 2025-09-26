import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Component } from "react";
import Lyout from './layout'

// 引数で渡されたComponentとpagePropsというものを使い
// Component {...pagePropes}という風に、呼び出されるページのコンポーネントとプロパティが渡される
export default function App({ Component, pageProps }: AppProps) {
  return(
    <Lyout>
    <Component {...pageProps} />;
    </Lyout>
  )
}
