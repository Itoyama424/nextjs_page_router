import Link from 'next/link';
import { GetStaticProps} from "next";
import {props} from '../types/types';


export const getStaticProps:GetStaticProps<props> = () => {

  const data = {
    title:"Index page",
    title2:"This page is Index.",
    msg:"これはトップページです。"
  }
  
  return { props: {data}}
}

export default function Home({data}:props) {
  return (
    <main>
      <p>{data.msg}</p>
      <div><Link href="/other">Go &quot;Other&quot;.</Link></div>
    </main>
  );
}
