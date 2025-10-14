import Link from 'next/link'
import { useRouter } from 'next/router'
import { PageData, props, dataMap } from '../types/types'
import { GetStaticProps, GetStaticPaths, GetStaticPropsContext} from 'next'

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

console.log("GetStaticPaths!!");

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