import { Inter } from 'next/font/google'
import Link from 'next/link'
import { types } from '../types/types'

const inter = Inter({subsets:['latin']})

export default function Other() {
    return(
        <main className={inter.className}>
            <h1>Other page.</h1>
            <p>これは別のページです。</p>
            <div><Link href="/">Go Back!!</Link></div>
        </main>
    )
}

export const getStaticProps = ({params}:types) => {
    const data = {
        title:'Other Page',
        msg:'これは静的プロパティーのページです。'
    }
}