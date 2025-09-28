import { Inter } from "next/font/google";
import Link from 'next/link'

const inter = Inter({ subsets:['latin']})

export default function Home() {
  return (
    <main>
      <h1>Static Page.</h1>
      <p>これは、静的ページです。ビルド時にレンダリングされています。</p>
    </main>
  );
}
