import { PageData, props, LayoutInterface } from '../types/types';

export default function Layout({ children, pagedatas } : LayoutInterface) {

  //  const {data} = props;
console.log('pagedatas:', pagedatas);

    return (
        <>
            <h1 className="header">{pagedatas.title}</h1>
            <h1 className="header2">{pagedatas.title2}</h1>
            <main>{children}</main>
            <hr className="footer" />
            <p className="footer">copyright 2023 SYODA-Tuyano.</p>
        </>
    )
}