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