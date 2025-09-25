import { Inter } from 'next/font/google'
import Lnk from 'next/link'
import { useRouter } from 'next/router'

const inter = Inter({ subsets:['latin']})

export default function Name() {
    const router = useRouter()
    return(
        <main>
            <h1>Name Page.</h1>
            <p>Your name:<b>"{router.query.name}"</b></p>
            <div><Lnk href="/">Go Back!!</Lnk></div>
        </main>
    )
}
