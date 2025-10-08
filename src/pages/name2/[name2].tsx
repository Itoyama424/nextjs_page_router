import { props, PageData, dataMap } from '../../types/types';
import { useRouter } from 'next/router';
import  Link  from 'next/link';
import { GetServerSideProps } from 'next'


export default function Name2({ data }: props) {
    const router = useRouter();

    return (
        <main>
            <p>name2:{router.query.name2}</p>
            <p>message:{data.msg}</p>
            <div><Link href="/">Go Back!!</Link></div>
        </main>
    )
}

export const getServerSideProps: GetServerSideProps<props> = async ({ params }) => {

    // params.name2をチェック（ファイル名が[name2].tsxなので）
    if (!params || !params.name2 || typeof params.name2 !== 'string') {
        return {
            notFound: true
        }
    }

    const data = dataMap[params.name2];
    
    // データが存在しない場合は404を返す
    if (!data) {
        return {
            notFound: true
        };
    }

    // propsを返す
    return {
        props: {
            data
        }
    };
}