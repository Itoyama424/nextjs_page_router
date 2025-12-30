import { Inter } from 'next/font/google'
import Link from 'next/link'
import  { GetStaticProps, GetStaticPropsContext } from 'next'
import {PageData, props} from '../types/types'

const inter = Inter({subsets:['latin']})

export const getStaticProps: GetStaticProps<props> = async (context: GetStaticPropsContext) => {
    const data: PageData = {
        title:"Other page.",
        title2:"This page is Other",
        msg:"これは静的プロパティのサンプルです。"
    }
    /*  画面のパラメータは常にこの形でdataの部分を自由に設定できるのかも なのでgetStaticPropsも
    　　この形で渡そうとする
            props: {
            data: 
    */    
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