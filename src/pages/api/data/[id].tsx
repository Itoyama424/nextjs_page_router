import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    name : string,
    mail : string,
    age  : number
}

const data = [
    {"name" : "taro" , "mail" : "taro@mail" , "age" : 10},
    {"name" : "hanako" , "mail" : "hanako@mail" , "age" : 20},
    {"name" : "sachiko" , "mail" : "sachiko@mail" , "age" : 30},
    {"name" : "jiro" , "mail" : "jiro@mail" , "age" : 40 }
]

export default function hundpath( req : NextApiRequest, res : NextApiResponse<Data | {error : string}>) {
       // req.query.idの取得と型チェック
    const idParam = req.query.id;
    
    // idが存在しない、または配列の場合はエラー
    if (!idParam || Array.isArray(idParam)) {
        return res.status(400).json({ error: 'IDパラメータが無効です' });
    }
    
    // 文字列を数値に変換
    let id = parseInt(idParam, 10);
    
    // 数値変換に失敗した場合はエラー
    if (isNaN(id)) {
        return res.status(400).json({ error: 'IDは数値である必要があります' });
    }

    id = id < 0 ? 0 : id >= data.length ?  data.length - 1 : id ;

    res.status(200).json(data[id])
}