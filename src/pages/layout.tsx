import type { AppProps } from "next/app";
import { PageData } from '../types/types';

interface LayoutInterface {
    children : React.ReactNode;
    data:PageData;
}



export default function Layout({ children, data } : LayoutInterface) {
    return (
        <>
            <h1 className="header">{data.title}</h1>
            <main>{children}</main>
            <hr className="footer" />
            <p className="footer">copyright 2023 SYODA-Tuyano.</p>
        </>
    )
}