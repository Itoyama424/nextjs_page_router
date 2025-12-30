import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from '../components/Layout'

  const data = {
    title: "Next Application",
    msg: "My Website"
  };
// 引数で渡されたComponentとpagePropsというものを使い
// Component {...pageProps}という風に、呼び出されるページのコンポーネントとプロパティが渡される
export default function App({ Component, pageProps }: AppProps) {
  // pagePropsにdataが含まれている場合はそれを使用、なければデフォルトのdataを使用
  const layoutData = pageProps.data || data;
  
  return(
    <Layout pagedatas={layoutData}>
      <Component {...pageProps} />
    </Layout>
  )
}
