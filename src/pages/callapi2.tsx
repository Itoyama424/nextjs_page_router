'use client'
import { useState, ChangeEvent } from 'react'
import { Inter } from 'next/font/google'
import useSWR from 'swr'

const inter = Inter({subsets : ['latin']})

const urlstr = '/api/data/'

type Data = {
    name : string,
    mail : string,
    age  : number
}

const options : RequestInit = {
    method : 'GET', 
    headers : {'Content-Type' : 'application/json'}
}

const fetcher = (url:string, options: RequestInit):Promise<Data> => 
    fetch(url, options).then((res) => {
        if (!res.ok) {
               throw new Error(`HTTP error! status: ${res.status}`) // テンプレートリテラル修正
        }
        return res.json()
    });

export default function Home() {
    const [num ,setNum] = useState(0)
    const [url, setUrl] = useState(urlstr + num);
    const {data,mutate,isLoading} = useSWR(url,fetcher)

    const doChange = (event:ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(event.target.value, 10);
        if (!isNaN(val)) {
            setNum(val);
            setUrl(urlstr + val);
        }
    }

    return (
        <main>
            <h1 className='header'>Call Api2</h1>
            <p>これは、API利用のサンプルです。</p>
            <div>
                <input type='number' min="0" max="3" onChange={doChange} value={num} />
            </div>
            <p className='border p-3'>
                result: {isLoading ? "reading..." : JSON.stringify(data)}
            </p>

        </main>
    )
}
