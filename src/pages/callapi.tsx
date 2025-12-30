'use client'

import { Inter } from 'next/font/google'
import useSWR from 'swr'

const inter = Inter({subsets : ['latin']})

const url = '/api/hello'

type Data = {
  name: string;
};

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
    const {data, error , isLoading } = useSWR(url, fetcher);
    return (
        <main>
            <h1 className='header'>Api Call hello.ts</h1>
            <p>これは、API利用のサンプルです。</p>
            <p className='border p-3'>
                result:{error ? "ERROR!!" : isLoading ? "Loading.." : data?.name}
            </p>
        </main>
    )
}