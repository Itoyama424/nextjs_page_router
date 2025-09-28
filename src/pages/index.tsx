import { Inter } from "next/font/google";
import Link from 'next/link';
import { GetStaticProps} from "next";
import {props} from '../types/types';


export const getStaticProps:GetStaticProps<props> = () => {
  const data = {
    title:"Index page",
    msg:"これはトップページです。"
  }
  return { props: {data}}
}

const inter = Inter({ subsets:['latin']})

export default function Home({data}:props) {
  return (
    <main>
      <p>{data.msg}</p>
      <div><Link href="/other">Go "Other".</Link></div>
    </main>
  );
}
