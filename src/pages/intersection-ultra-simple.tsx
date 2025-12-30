/* eslint no-console: "error" */
/* eslint @typescript-eslint/no-unused-vars: "error" */

import { useEffect, useRef, useState } from 'react';

export default function SimpleIntersection() {
    // 各ボックスが見えているかの状態
    const [isVisible1, setIsVisible1] = useState(false);
    const [isVisible2, setIsVisible2] = useState(false);
    const [isVisible3, setIsVisible3] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    
    // Observer を保持
    const observerRef = useRef<IntersectionObserver | null>(null);

    // クライアントサイドでのみマウント
    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;
        
        // Observer を作成
        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                // どのボックスかIDで判別
                const id = entry.target.id;
                const visible = entry.isIntersecting;
                
                if (id === 'box1') setIsVisible1(visible);
                if (id === 'box2') setIsVisible2(visible);
                if (id === 'box3') setIsVisible3(visible);
            });
        });

        // 既存の要素を監視開始
        const elements = ['box1', 'box2', 'box3'];
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                observerRef.current?.observe(element);
            }
        });

        return () => {
            observerRef.current?.disconnect();
        };
    }, [isMounted]);

    // ボックスのref設定
    const setBoxRef = (id: string) => (element: HTMLDivElement | null) => {
        if (element) {
            element.id = id;
            // Observerがすでに作成されていれば監視開始
            if (observerRef.current) {
                observerRef.current.observe(element);
            }
        }
    };

    // SSR中は何も表示しない
    if (!isMounted) {
        return null;
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl mb-6">超シンプル Intersection Observer</h1>
            
            <p className="mb-8">スクロールしてボックスの色の変化を見てください</p>

            <div className="space-y-96">
                {/* ボックス1 */}
                <div
                    ref={setBoxRef('box1')}
                    className={`w-40 h-40 flex items-center justify-center text-white font-bold text-xl rounded-lg ${
                        isVisible1 ? 'bg-red-500' : 'bg-gray-400'
                    }`}
                >
                    ボックス1
                    <br />
                    {isVisible1 ? '見える！' : '見えない'}
                </div>

                {/* ボックス2 */}
                <div
                    ref={setBoxRef('box2')}
                    className={`w-40 h-40 flex items-center justify-center text-white font-bold text-xl rounded-lg ${
                        isVisible2 ? 'bg-blue-500' : 'bg-gray-400'
                    }`}
                >
                    ボックス2
                    <br />
                    {isVisible2 ? '見える！' : '見えない'}
                </div>

                {/* ボックス3 */}
                <div
                    ref={setBoxRef('box3')}
                    className={`w-40 h-40 flex items-center justify-center text-white font-bold text-xl rounded-lg ${
                        isVisible3 ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                >
                    ボックス3
                    <br />
                    {isVisible3 ? '見える！' : '見えない'}
                </div>
            </div>
        </div>
    );
}