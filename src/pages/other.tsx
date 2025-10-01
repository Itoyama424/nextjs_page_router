import { Inter } from 'next/font/google'
import Link from 'next/link'
import  { GetStaticProps, GetStaticPropsContext } from 'next'
import {PageData, props} from '../types/types'

const inter = Inter({subsets:['latin']})

export const getStaticProps: GetStaticProps<props> = async (context: GetStaticPropsContext) => {
    const data = {
        title:"Other page.",
        msg:"これは静的プロパティのサンプルです。"
    }
    return {
        props: {
            data: data
        }
    }
}
export default function Other({ data }: props) {
    return (
        <main className={inter.className}>
            <p>{data.msg}</p>
            <div><Link href="/">Go Back!!</Link></div>
        </main>
    )
}