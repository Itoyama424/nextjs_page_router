import { useEffect, useRef, useState } from 'react';

export default function BouncyObserver() {
    const [visibleBoxes, setVisibleBoxes] = useState<boolean[]>([false, false, false]);

    useEffect(() => {
        // 各ボックスを監視するObserver
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const index = parseInt(entry.target.getAttribute('data-index') || '0');
                    setVisibleBoxes(prev => {
                        const newState = [...prev];
                        newState[index] = entry.isIntersecting;
                        return newState;
                    });
                });
            },
            { threshold: 0.2 }
        );

        // 全ボックスを監視に追加
        document.querySelectorAll('[data-index]').forEach(element => {
            observer.observe(element);
        });

        return () => observer.disconnect();
    }, []);

    const boxes = [
        { emoji: '🚀', color: 'from-red-400 to-pink-500', name: 'ロケット' },
        { emoji: '🌈', color: 'from-blue-400 to-purple-500', name: 'レインボー' },
        { emoji: '⚡', color: 'from-yellow-400 to-orange-500', name: 'サンダー' }
    ];

    return (
        <div className="min-h-[300vh] bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50">
            {/* ヘッダー */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-sm p-6 text-center border-b z-10">
                <h1 className="text-3xl font-bold">🎪 バウンシー Observer</h1>
                <p className="text-gray-600 mt-2">スクロールでキャラクターが踊りだす！</p>
                <div className="mt-2 text-sm">
                    見えている: {visibleBoxes.filter(Boolean).length} / {boxes.length}
                </div>
            </div>

            {/* ボックスたち */}
            <div className="py-20">
                {boxes.map((box, index) => (
                    <div key={index} className="mb-64 flex justify-center">
                        <div
                            data-index={index}
                            className={`
                                w-48 h-48 rounded-3xl flex flex-col items-center justify-center
                                text-white font-bold text-lg shadow-xl
                                bg-gradient-to-br ${box.color}
                                transform transition-all duration-1000 ease-out
                                ${visibleBoxes[index]
                                    ? 'scale-110 -rotate-6 translate-y-0 opacity-100 animate-pulse'
                                    : 'scale-75 rotate-3 translate-y-8 opacity-60'
                                }
                            `}
                        >
                            <div className={`
                                text-6xl mb-4 transform transition-transform duration-700
                                ${visibleBoxes[index] ? 'scale-125 animate-bounce' : 'scale-100'}
                            `}>
                                {box.emoji}
                            </div>
                            
                            <div className="text-center">
                                <div className="text-xl">{box.name}</div>
                                <div className="text-sm opacity-90 mt-1">
                                    {visibleBoxes[index] ? '🎉 ダンス中!' : '💤 休憩中...'}
                                </div>
                            </div>

                            {/* キラキラエフェクト */}
                            {visibleBoxes[index] && (
                                <>
                                    <div className="absolute top-2 right-2 w-3 h-3 bg-white/50 rounded-full animate-ping"></div>
                                    <div className="absolute bottom-4 left-4 w-2 h-2 bg-white/50 rounded-full animate-bounce"></div>
                                    <div className="absolute top-8 left-8 w-1 h-1 bg-white rounded-full animate-pulse"></div>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* フッター */}
            <div className="bg-white p-8 text-center">
                <h3 className="text-xl font-bold mb-2">🎊 お疲れさまでした！</h3>
                <p className="text-gray-600">超簡単なIntersection Observer でした</p>
                <div className="mt-4 text-xs text-gray-500">
                    たった20行のコードでこんなに楽しい！
                </div>
            </div>
        </div>
    );
}