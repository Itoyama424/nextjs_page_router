import { useEffect, useRef, useState } from 'react';

// カードの型定義
interface CardData {
    number: number;
    hiddenEmoji: string;
    visibleEmoji: string;
    title: string;
    color: string;
}

// IntersectionObserver のコールバック関数の型
type ObserverCallback = (entries: IntersectionObserverEntry[]) => void;

// React ref コールバック関数の型
type RefCallback = (element: HTMLDivElement | null) => void;

// React State Setter の型
type SetVisibleCards = React.Dispatch<React.SetStateAction<Set<number>>>;
type SetIsMounted = React.Dispatch<React.SetStateAction<boolean>>;

export default function IntersectionDemo(): React.ReactElement | null {
    const [visibleCards, setVisibleCards]: [Set<number>, SetVisibleCards] = useState<Set<number>>(new Set());
    const [isMounted, setIsMounted]: [boolean, SetIsMounted] = useState<boolean>(false);
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect((): void => {
        setIsMounted(true);
    }, []);

    useEffect((): (() => void) | void => {
        if (!isMounted) return;

        // より敏感な設定でObserverを作成
        const observerCallback: ObserverCallback = (entries: IntersectionObserverEntry[]): void => {
            console.log('Observer triggered:', entries.length, 'entries'); // デバッグ用
            entries.forEach((entry: IntersectionObserverEntry): void => {
                const cardNumberStr: string | null = entry.target.getAttribute('data-card');
                const cardNumber: number = parseInt(cardNumberStr || '0');
                console.log(`Card ${cardNumber} is ${entry.isIntersecting ? 'visible' : 'hidden'}`); // デバッグ用
                
                setVisibleCards((prev: Set<number>): Set<number> => {
                    const newSet: Set<number> = new Set(prev);
                    if (entry.isIntersecting) {
                        newSet.add(cardNumber);
                    } else {
                        newSet.delete(cardNumber);
                    }
                    console.log('Visible cards:', Array.from(newSet)); // デバッグ用
                    return newSet;
                });
            });
        };

        const observerOptions: IntersectionObserverInit = {
            threshold: 0.1, // 10%見えたら反応（より敏感に）
            rootMargin: '0px' // マージン無し
        };

        observerRef.current = new IntersectionObserver(observerCallback, observerOptions);

        // 少し遅らせて要素を観察開始
        const timer: NodeJS.Timeout = setTimeout((): void => {
            const elements: NodeListOf<Element> = document.querySelectorAll('[data-card]');
            console.log('Found elements:', elements.length); // デバッグ用
            elements.forEach((element: Element): void => {
                if (observerRef.current) {
                    observerRef.current.observe(element);
                    console.log('Observing element:', element.getAttribute('data-card')); // デバッグ用
                }
            });
        },400);

        return (): void => {
            clearTimeout(timer);
            observerRef.current?.disconnect();
        };
    }, [isMounted]);

    // カードのref設定
    const setCardRef = (cardNumber: number): RefCallback => {
        return (element: HTMLDivElement | null): void => {
            if (element) {
                element.setAttribute('data-card', cardNumber.toString());
                console.log(`Setting up card ${cardNumber}`, element); // デバッグ用
            }
        };
    };

    if (!isMounted) {
        return <div className="min-h-screen bg-gray-100"></div>;
    }

    const cards: CardData[] = [
        { number: 1, hiddenEmoji: '📦', visibleEmoji: '🚀', title: 'ロケット', color: 'from-red-400 to-pink-500' },
        { number: 2, hiddenEmoji: '⭐', visibleEmoji: '🌟', title: 'スター', color: 'from-yellow-400 to-orange-500' },
        { number: 3, hiddenEmoji: '🎭', visibleEmoji: '🎨', title: 'アート', color: 'from-blue-400 to-purple-500' },
        { number: 4, hiddenEmoji: '🔇', visibleEmoji: '🎵', title: 'ミュージック', color: 'from-green-400 to-blue-500' },
        { number: 5, hiddenEmoji: '🔋', visibleEmoji: '⚡', title: 'エネルギー', color: 'from-purple-400 to-pink-500' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
            {/* ヘッダー */}
            <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b p-6 z-10">
                <h1 className="text-3xl font-bold text-gray-800 text-center">
                    🔍 Intersection Observer デモ
                </h1>
                <p className="text-gray-600 text-center mt-2">
                    下にスクロールして、カードの絵文字がどう変化するか見てみよう！
                </p>
                <div className="flex justify-center mt-4">
                    <div className="bg-blue-100 px-4 py-2 rounded-full text-sm">
                        見えているカード: {visibleCards.size} / {cards.length}
                    </div>
                </div>
            </div>

            {/* 説明セクション */}
            <div className="p-8 text-center">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-2xl font-semibold mb-4">使い方</h2>
                    <p className="text-gray-700 leading-relaxed">
                        下にスクロールすると、各カードが画面に入った瞬間に
                        <span className="font-bold text-red-600">絵文字が変化</span>して
                        <span className="font-bold text-blue-600">拡大</span>し、
                        <span className="font-bold text-purple-600">色が変わり</span>、
                        <span className="font-bold text-green-600">アニメーション</span>します！
                    </p>
                </div>
            </div>

            {/* カードセクション */}
            <div className="px-8 pb-16">
                {cards.map((card: CardData): React.ReactElement => {
                    const isVisible: boolean = visibleCards.has(card.number);
                    
                    return (
                        <div key={card.number} className="mb-32">
                            <div
                                ref={setCardRef(card.number)}
                                className={`
                                    relative mx-auto max-w-md
                                    transform transition-all duration-700 ease-out
                                    ${isVisible 
                                        ? 'scale-105 translate-y-0 opacity-100' 
                                        : 'scale-95 translate-y-8 opacity-70'
                                    }
                                `}
                            >
                                {/* メインカード */}
                                <div className={`
                                    relative p-8 rounded-3xl shadow-2xl
                                    bg-gradient-to-br ${isVisible ? card.color : 'from-gray-300 to-gray-400'}
                                    transition-all duration-700
                                    ${isVisible ? 'shadow-2xl shadow-purple-300/50' : 'shadow-lg'}
                                `}>
                                    {/* 光る効果 */}
                                    {isVisible && (
                                        <div className="absolute inset-0 rounded-3xl bg-white/20 animate-pulse"></div>
                                    )}
                                    
                                    {/* コンテンツ */}
                                    <div className="relative z-10 text-center text-white">
                                        <div className={`
                                            text-6xl mb-4 
                                            transform transition-all duration-700 ease-out
                                            ${isVisible ? 'scale-110 rotate-12' : 'scale-90 rotate-0'}
                                        `}>
                                            {isVisible ? card.visibleEmoji : card.hiddenEmoji}
                                        </div>
                                        
                                        <h3 className="text-2xl font-bold mb-2">
                                            {card.title}
                                        </h3>
                                        
                                        <p className="text-lg opacity-90">
                                            カード #{card.number}
                                        </p>
                                        
                                        <div className={`
                                            mt-4 text-sm font-medium
                                            transition-all duration-500
                                            ${isVisible ? 'opacity-100' : 'opacity-50'}
                                        `}>
                                            {isVisible ? '✨ 見えています！' : '👁️ まだ見えていません'}
                                        </div>
                                    </div>
                                    
                                    {/* 装飾的な要素 */}
                                    {isVisible && (
                                        <>
                                            <div className="absolute top-4 right-4 w-3 h-3 bg-white/50 rounded-full animate-ping"></div>
                                            <div className="absolute bottom-4 left-4 w-2 h-2 bg-white/50 rounded-full animate-bounce"></div>
                                        </>
                                    )}
                                </div>
                                
                                {/* 進行インジケーター */}
                                <div className="flex justify-center mt-6">
                                    <div className="flex space-x-2">
                                        {cards.map((_, index: number): React.ReactElement => (
                                            <div
                                                key={index}
                                                className={`
                                                    w-2 h-2 rounded-full transition-all duration-300
                                                    ${index + 1 === card.number
                                                        ? (isVisible ? 'bg-blue-500 scale-150' : 'bg-gray-400')
                                                        : visibleCards.has(index + 1) 
                                                            ? 'bg-green-400' 
                                                            : 'bg-gray-300'
                                                    }
                                                `}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* フッター */}
            <div className="bg-white p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">🎉 お疲れさまでした！</h3>
                <p className="text-gray-600">
                    全{cards.length}個のカードを見ることができました。
                </p>
                <p className="text-sm text-gray-500 mt-2">
                    Intersection Observer API を使った視覚的なデモでした
                </p>
            </div>
        </div>
    );
}