import { props } from '@/types/types'

import Link from 'next/link'
import { useRouter } from 'next/router'
import { GetStaticPropsContext, GetStaticProps, GetStaticPaths } from 'next'
import { PageData} from '@/types/types'

export default function Yama(props:props) {
    console.log("start component.")

    const { data } = props;

    const router = useRouter();

    return (
        <main>
            <h1 className='header'>{data.title2} </h1>
            <p>name : {router.query.yama}</p>
            <p>message: {data.msg}</p>
            <div><Link href="/">Go Back!!</Link></div>
        </main>
    )
}

export const getStaticPaths : GetStaticPaths = () => {
    console.log("getStaticPaths.")
    const p = [
        {params:{yama:"tenzan"}},
        {params:{yama:"unzen"}},
        {params:{yama:"kuju"}},
    ]
    return {
        paths:p,
        fallback:false
    }
}

export const getStaticProps : GetStaticProps<{ data : PageData }> = ({params}:GetStaticPropsContext) => {
    console.log("getStaticProps")

    if(!params || !params.yama || typeof params.yama !== 'string') {
        return {
            notFound:true
        }
    }
    // ISRで動的データを生成（毎回異なる時刻を含む）
    const currentTime = new Date().toISOString();
    const dynamicData: Record<string, PageData> = {
        tenzan: {
            title: '天山のページ（ISR）',
            title2: 'これは天山のページだよ（ISR）',
            msg: `ヤッホー、天山のページだよ（ISR）！生成時刻: ${currentTime}`
        },
        unzen: {
            title: '雲仙のページ（ISR）',
            title2: 'これは雲仙のページだよ（ISR）',
            msg: `ヤッホー、雲仙のページだよ（ISR）！生成時刻: ${currentTime}`
        },
        kuju: {
            title: '九重のページ（ISR）',
            title2: 'これは九重のページだよ（ISR）',
            msg: `ヤッホー、九重のページだよ（ISR）！生成時刻: ${currentTime}`
        }
    };

    const pageData = dynamicData[params.yama];

    return {
        props:{
            data: pageData
        },
        revalidate:15  // 15秒後に再生成
    }
}
