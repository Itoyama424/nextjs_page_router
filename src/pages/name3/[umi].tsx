import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import { PageData , props, dataMap } from '../../types/types'
import { useRouter } from 'next/router';
import Link from 'next/link'

export default function Umi({data} : props) {

    const router = useRouter();
    return (
        <main>
            <p>name:{router.query.umi}</p>
            <p>message:{data.msg}</p>
            <div><Link href="/">to Home!!</Link></div>
        </main>
    )


}

export const getStaticPaths : GetStaticPaths = async () => {

    const paths = [
        {params: { umi : 'setouchi' }},
        {params: { umi : 'nihonkai' }},
        {params: { umi : 'taoheiyou' }},
    ]
    return {
        paths : paths,
        fallback : false
    }
}

export const getStaticProps : GetStaticProps<{ data : PageData }> = async (context : GetStaticPropsContext) => {
    const { params } = context;

    if(!params || !params.umi || typeof params.umi !== 'string') {
        return {
            notFound : true
        }
    }

    const data = dataMap[params.umi];

    if(!data) {
        return {
            notFound : true
        }
    }

    return {
        props:{
            data:dataMap[params.umi]
        }
    }
    
}