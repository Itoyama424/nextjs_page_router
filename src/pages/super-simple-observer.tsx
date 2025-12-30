import { useEffect, useRef, useState } from 'react';

export default function SuperSimpleObserver(): React.ReactElement {
    const [isVisible, setIsVisible]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    const boxRef: React.MutableRefObject<HTMLDivElement | null> = useRef<HTMLDivElement | null>(null);

    useEffect((): (() => void) => {
        // 超シンプルなObserver
        console.log("📅 useEffect実行！（これは1回だけ）");
        const observer: IntersectionObserver = new IntersectionObserver(
            (entries: IntersectionObserverEntry[]): void => {
            // ここは useEffect とは別のタイミングで実行される！
            console.log("🔥 コールバック実行！（これは何度でも）");               
                setIsVisible(entries[0].isIntersecting);
            },
            { threshold: 0.9 } // 30%見えたら反応
        );

        // ボックスを監視開始
        if (boxRef.current) {
            observer.observe(boxRef.current);
        }

        return (): void => observer.disconnect();
    }, []);

    return (
        <div className="min-h-[200vh] bg-gradient-to-b from-purple-100 to-pink-100">
            {/* ヘッダー */}
            <div className="p-8 text-center">
                <h1 className="text-4xl font-bold mb-4">🎉 超簡単 Observer</h1>
                <p className="text-gray-600">下にスクロールして魔法を見よう！</p>
            </div>

            {/* スペーサー */}
            <div className="h-96"></div>
        {/* 説明 */}
            <div className="text-center mt-8 p-4">
                <div className={`
                    text-lg font-semibold transition-all duration-500
                    ${isVisible ? 'text-orange-600 scale-110' : 'text-gray-500 scale-100'}
                `}>
                    {isVisible ? '✨ ボックスが見えています！' : '👀 ボックスを探してスクロール！'}
                </div>
            </div>
            {/* メインボックス */}
            <div className="flex justify-center">
                <div
                    ref={boxRef}
                    className={`
                        w-32 h-32 rounded-2xl flex items-center justify-center text-white font-bold
                        transform transition-all duration-700 ease-bounce
                        ${isVisible 
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 scale-150 rotate-12 shadow-2xl' 
                            : 'bg-gray-400 scale-75 rotate-0 shadow-md'
                        }
                    `}
                >
                    <div className="text-center">
                        <div className="text-2xl">
                            {isVisible ? '🌟' : '😴'}
                        </div>
                        <div className="text-sm mt-1">
                            {isVisible ? 'キラキラ!' : 'スヤスヤ...'}
                        </div>
                    </div>
                </div>
            </div>

    

            {/* もう一つのスペーサー */}
            <div className="h-96"></div>
        </div>
    );
}