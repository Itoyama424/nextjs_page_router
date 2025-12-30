'use client'
import { useState, useRef } from 'react';

export default function App():React.ReactElement {

    // 画面の部品（エレメント）への参照
    const inputRef:React.MutableRefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null);
　　// 再レンダリングしないカウント
    const countRef:React.MutableRefObject<number> = useRef<number>(0);
    // 再レンダリングするカウント
    const [renderCount, setRenderCount]:[number,React.Dispatch<React.SetStateAction<number>>] = useState<number>(0);

    const handleFocus: () => void = () => {
        if(inputRef.current) {
            inputRef.current.focus();
            inputRef.current.value = 'focused';
        }
    };

    const incrementNonRenderCount: () => void = () => {
        countRef.current += 1;
    }

    const incrementRenderCount:() => void = () => {
        setRenderCount(renderCount + 1);
    }

    return (
        <>
            <h1>useRefの例</h1>
            <div className='container'>
                <input ref={inputRef} type="text" placeholder="クリックでフォーカス"/>
                <button onClick={handleFocus}>Focus Now</button>
                <hr/>
                <div>
                    <p>Non-rendering count:{countRef.current}</p>
                    <button onClick={incrementNonRenderCount}>Non-rendering increment</button>
                </div>
                <div>
                    <p>Rendering count:{renderCount}</p>
                    <button onClick={incrementRenderCount}>Rendering increment</button>
                </div>                
            </div>
        </>
    );
} 