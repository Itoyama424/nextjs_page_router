import { Inter } from 'next/font/google'
import Link from 'next/link'
import { useRouter } from 'next/router'

const inter = Inter({ subsets:['latin']})

export default function Name() {
    const router = useRouter()

    return(
        <main>
            <h1>Name page.</h1>
            <ol>Parameter:
                <li>Name:{router.query.name}</li>
                <li>Pass:{router.query.pass}</li>
            </ol>
            <div><Link href="/">Go Back!!</Link></div>
        </main>
    )
}