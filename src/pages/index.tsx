import Image from "next/image";
import { Inter } from "next/font/google";
import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <h1>SSG application.</h1>
      <p>This is sample page.</p>
      <div><Link href="/other">Go "Other".</Link></div>
    </main>
  );
}
