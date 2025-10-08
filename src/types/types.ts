export type PageData = {
    title:string,
    title2:string,
    msg:string
}
export type props = {
    data:PageData
}
export interface LayoutInterface {
    children : React.ReactNode;
    pagedatas:PageData;
}

export const dataMap: Record<string, PageData> = {
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
        },
        setouchi: {
            title: 'Setouchi-web',
            title2: 'This page is Setouchi-web.',
            msg: "This is Setouchi's web site."
        },
        nihonkai: {
            title: '日本海の部屋',
            title2: 'これは日本海のページです。',
            msg: 'ここは日本海の部屋です。'
        },
        taoheiyou: {
            title: '大平洋のページ',
            title2: 'これは大平洋のページだよ。',
            msg: 'ヤッホー、大平洋のページだよ！'
        },
        tenzan: {
            title: '天山のページ',
            title2: 'これは天山のページだよ。',
            msg: 'ヤッホー、天山のページだよ！'
        },
        unzen: {
            title: '雲仙のページ',
            title2: 'これは雲仙のページだよ。',
            msg: 'ヤッホー、雲仙のページだよ！'
        },
        kuju: {
            title: '九重のページ',
            title2: 'これは九重のページだよ。',
            msg: 'ヤッホー、九重のページだよ！'
        }                                
};

