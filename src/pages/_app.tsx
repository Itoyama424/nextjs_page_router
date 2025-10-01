import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from './layout'

  const data = {
    title: "Next Application",
    msg: "My Website"
  };
// 引数で渡されたComponentとpagePropsというものを使い
// Component {...pageProps}という風に、呼び出されるページのコンポーネントとプロパティが渡される
export default function App({ Component, pageProps }: AppProps) {
  return(
    <Layout {...pageProps}>
    <Component {...pageProps} />
    </Layout>
  )
}
