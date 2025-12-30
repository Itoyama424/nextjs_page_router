import fs from 'fs'

import type { NextApiRequest, NextApiResponse } from 'next'

const path = 'data.txt'

type Data = {
    content : string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    let rescontent = '';
    
    switch(req.method) {
        case 'GET':
            rescontent = fs.readFileSync(path, {flag:'a+'}).toString().trim();
            break;
        case 'POST':
           const {content} = req.body;
           console.log('☆彡' + content + ' ' + req.body)
           // const body = req.body;
            fs.appendFileSync(path, content + '\n');
            break;
        default:
            break;
    }
    res.status(200).json({content : rescontent});
}