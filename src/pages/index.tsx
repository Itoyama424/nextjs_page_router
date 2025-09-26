import { Inter } from "next/font/google";
import Link from 'next/link'

const inter = Inter({ subsets:['latin']})

export default function Home() {
  return (
    <main>
      <p>This is sample page.</p>
      <div><Link href="/other">Go "Other".</Link></div>
    </main>
  );
}
