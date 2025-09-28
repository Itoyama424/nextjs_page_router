import { Inter } from 'next/font/google'
import Link from 'next/link'
import { props , PropsValue } from '../types/types'
import { GetStaticProps } from 'next'

const inter = Inter({subsets:['latin']})

export default function Other({data}:props) {
    return(
        <main className={inter.className}>
            <h1>{data.title}</h1>
            <p>{data.msg}</p>
            <div><Link href="/">Go Back!!</Link></div>
        </main>
    )
}

export const getStaticProps:GetStaticProps<props> = () => {
    const data:PropsValue = {
        title:'Other Page',
        msg:'これは静的プロパティーのページです。'
    }
    return {props:{data:data}}
}