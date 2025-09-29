import { Inter } from 'next/font/google'
import Link from 'next/link'
import { useRouter } from 'next/router'

const inter = Inter({ subsets:['latin']})

export default function Name({ data }) {
    const router = useRouter();
    return (
        <main>
            <h1 className="header"></h1>
        </main>
    )
}