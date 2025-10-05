import Link from 'next/link'
import { useRouter } from 'next/router'
import { PageData, props } from '../types/types'
import { GetStaticProps, GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType} from 'next'

//type TestPageProps = InferGetStaticPropsType<typeof getStaticProps>; 

export default function Name({ data } : props) {
   // const { title, msg } = data; 
    const router = useRouter();
    return (
        <main>
            <p>name:{router.query.name}</p>
            <p>message:{data.msg}</p>
            <div><Link href="/">Go Back!!</Link></div>
        </main>
    )
}
export const getStaticPaths: GetStaticPaths = async () => {
    const paths = [
        { params: { name: 'taro' } },
        { params: { name: 'hanako' } },
        { params: { name: 'sachiko' } }
    ];   
    return {
        paths: paths,
        fallback: false
    }
}



export const getStaticProps: GetStaticProps<{ data: PageData }> = async (context: GetStaticPropsContext) => {
    const { params } = context;

    if(!params || !params.name || typeof params.name !== 'string') {
        return {
            notFound: true
        }
    }

    const name = params.name;

    const dataMap: Record<string, PageData> = {
        taro: {
            title: 'Taro-web',
            title2: 'This page is Taro-web.',
            msg: "This is Taro's web site."
        },
        hanako: {
            title: 'ハナコの部屋',
            title2: 'これはハナコのページです。',
            msg: 'ここはハナコの部屋です。'
        },
        sachiko: {
            title: 'サチコのページ',
            title2: 'これはサチコのページだよ。',
            msg: 'ヤッホー、サチコのページだよ！'
        }
    };

    const data = dataMap[name];
        if (!data) {
        return {
            notFound: true
        };
    }
    return {
        props: {
            data
        }
    };

}