import { props, PageData } from '../../types/types';
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

    //const name2 = params.name2;

    const dataMap: Record<string, PageData> = {
        taro2: {
            title: 'Taro-web',
            title2: 'This page is Taro-web.',
            msg: "This is Taro's web site."
        },
        hanako2: {
            title: 'ハナコの部屋',
            title2: 'これはハナコのページです。',
            msg: 'ここはハナコの部屋です。'
        },
        sachiko2: {
            title: 'サチコのページ',
            title2: 'これはサチコのページだよ。',
            msg: 'ヤッホー、サチコのページだよ！'
        }
    };

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