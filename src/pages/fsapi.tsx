'use client'
import { Inter } from 'next/font/google'
import { ChangeEvent, useState } from 'react'
import useSWR from 'swr'

const inter = Inter({ subsets : ['latin']});

const url = '/api/fs';

type Data = {
    content : string
}

//const opt1 : RequestInit = {
const opt1 = {
   // method : 'GET',
    headers : { 'content-Type' : 'application/json'} 
} 

const fetcher1 = (url : string, options : RequestInit) : Promise<Data> => {
    return fetch(url, opt1).then(res => {
        if(!res.ok) {
            throw new Error(`HTTP ERR status:${res.status}`)
        }
        return res.json();
    })
}



export default function Home() {
    const [input, setInput] = useState('');



    const {data, error, mutate, isLoading} = useSWR(url, fetcher1);

    const doChange = (event:ChangeEvent<HTMLTextAreaElement>) => {
        const value = event.target.value;
        setInput(value);
    }

    const doAction = () => {
        console.log('☆' + JSON.stringify({content:input}))
        const opt2 : RequestInit = {
            method : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body : JSON.stringify({content:input})
        }
        fetch(url, opt2).then(resp => {
            console.log('●' + resp.status)
            setInput('');
            mutate();
        })
    }
let num = 10;
    return(
        <main>
            <h1 className='header'>Fs page</h1>
            <p>これは、API利用のサンプル。</p>
            <div className='form'>
                <textarea  onChange={doChange} value={input} />
                <button onClick={doAction}>Click</button>
            </div>
            <pre className='border p-3'>
                {error ? 'ERROR!!' : isLoading ? 'Loading...' : data ? data.content : ''}
            </pre>
        </main>
    )
}


