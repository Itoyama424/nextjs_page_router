

function test() {
    let i = 0;
    for (let x = 0; x < 10; x++) {
    console.log(x);
    {
        let i = 12;
        console.log(i);
    }
    }
    console.log(i);
}

declare function fetch(
  input: RequestInfo | URL, init?: RequestInit
): Promise<Response>;


interface MathMLElementEventMap extends ElementEventMap {
    // MathML 要素固有のイベントがあれば追加される
    // 現状は HTMLElementEventMap とほぼ同じ
}
