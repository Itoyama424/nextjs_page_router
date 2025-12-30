import { useEffect, useRef, useState } from 'react';

type IntersectionItem = {
    id: number;
    isVisible: boolean;
    intersectionRatio: number;
    text: string;
};

export default function IntersectionObserverPage() {
    const [items, setItems] = useState<IntersectionItem[]>([]);
    const [observedElements, setObservedElements] = useState<Set<number>>(new Set());
    const [mounted, setMounted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    // クライアントサイドでマウント状態を管理
    useEffect(() => {
        setMounted(true);
    }, []);

    // アイテムを初期化
    useEffect(() => {
        if (!mounted) return;
        
        const initialItems: IntersectionItem[] = Array.from({ length: 20 }, (_, index) => ({
            id: index + 1,
            isVisible: false,
            intersectionRatio: 0,
            text: `アイテム ${index + 1}`
        }));
        setItems(initialItems);
    }, [mounted]);

    // IntersectionObserverの設定
    useEffect(() => {
        if (!mounted || typeof window === 'undefined') return;

        // Intersection Observerのコールバック関数
        const handleIntersection = (entries: IntersectionObserverEntry[]) => {
            console.log('Intersection detected:', entries.length);
            
            entries.forEach((entry) => {
                const itemId = parseInt(entry.target.getAttribute('data-item-id') || '0');
                console.log(`Item ${itemId}: ${entry.isIntersecting ? 'visible' : 'hidden'}, ratio: ${entry.intersectionRatio.toFixed(2)}`);
            });

            setItems(prevItems => 
                prevItems.map(item => {
                    const entry = entries.find(e => 
                        parseInt(e.target.getAttribute('data-item-id') || '0') === item.id
                    );
                    if (entry) {
                        return {
                            ...item,
                            isVisible: entry.isIntersecting,
                            intersectionRatio: entry.intersectionRatio
                        };
                    }
                    return item;
                })
            );
        };

        // Intersection Observerのオプション
        const options: IntersectionObserverInit = {
            root: null, // ビューポートを基準にする
            rootMargin: '0px',
            threshold: [0, 0.25, 0.5, 0.75, 1.0] // 0%, 25%, 50%, 75%, 100%で検知
        };

        // Intersection Observerを作成
        observerRef.current = new IntersectionObserver(handleIntersection, options);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [mounted]);

    // 要素をObserverに追加する関数
    const observeElement = (element: HTMLElement, itemId: number) => {
        if (observerRef.current && !observedElements.has(itemId)) {
            element.setAttribute('data-item-id', itemId.toString());
            observerRef.current.observe(element);
            setObservedElements(prev => new Set([...prev, itemId]));
        }
    };

    // 要素をObserverから削除する関数
    const unobserveElement = (element: HTMLElement, itemId: number) => {
        if (observerRef.current && observedElements.has(itemId)) {
            observerRef.current.unobserve(element);
            setObservedElements(prev => {
                const newSet = new Set(prev);
                newSet.delete(itemId);
                return newSet;
            });
        }
    };

    // ref コールバック関数
    const itemRefCallback = (itemId: number) => (element: HTMLDivElement | null) => {
        if (element) {
            observeElement(element, itemId);
        }
    };

    // 可視アイテムの統計 (マウント後のみ計算)
    const visibleItems = mounted ? items.filter(item => item.isVisible) : [];
    const partiallyVisibleItems = mounted ? items.filter(item => item.intersectionRatio > 0 && item.intersectionRatio < 1) : [];

    // SSR中はローディング表示
    if (!mounted) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Intersection Observer を初期化中...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50">
            {/* ヘッダー情報 */}
            <div className="sticky top-0 bg-white shadow-sm z-10 p-4">
                <h1 className="text-2xl font-bold mb-2">Intersection Observer サンプル</h1>
                <div className="flex gap-4 text-sm">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded">
                        完全表示: {items.filter(item => item.intersectionRatio === 1).length}個
                    </span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded">
                        部分表示: {partiallyVisibleItems.length}個
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded">
                        可視範囲: {visibleItems.length}個
                    </span>
                </div>
            </div>

            <div className="p-4">
                <div className="max-w-4xl mx-auto space-y-4">
                    {/* 説明 */}
                    <div className="bg-blue-50 p-4 rounded-lg mb-6">
                        <h2 className="font-medium mb-2">Intersection Observer の動作:</h2>
                        <ul className="text-sm space-y-1">
                            <li>• スクロールして各アイテムの表示状態を確認</li>
                            <li>• 緑色: 完全に表示中</li>
                            <li>• 黄色: 部分的に表示中</li>
                            <li>• グレー: 非表示</li>
                            <li>• 数値: 表示割合 (0.0-1.0)</li>
                        </ul>
                    </div>

                    {/* アイテムリスト */}
                    <div className="space-y-4">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                ref={itemRefCallback(item.id)}
                                className={`
                                    p-6 rounded-lg border-2 transition-all duration-300
                                    ${item.intersectionRatio === 1 
                                        ? 'bg-green-100 border-green-300' 
                                        : item.isVisible 
                                        ? 'bg-yellow-100 border-yellow-300' 
                                        : 'bg-gray-100 border-gray-300'
                                    }
                                `}
                                style={{
                                    transform: item.isVisible ? 'scale(1)' : 'scale(0.95)',
                                    opacity: item.isVisible ? 1 : 0.7
                                }}
                            >
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-medium">{item.text}</h3>
                                    <div className="text-right">
                                        <div className="text-sm font-mono">
                                            表示割合: {(item.intersectionRatio * 100).toFixed(1)}%
                                        </div>
                                        <div className={`text-xs px-2 py-1 rounded mt-1 ${
                                            item.intersectionRatio === 1
                                                ? 'bg-green-200 text-green-800'
                                                : item.isVisible
                                                ? 'bg-yellow-200 text-yellow-800'
                                                : 'bg-gray-200 text-gray-600'
                                        }`}>
                                            {item.intersectionRatio === 1 
                                                ? '完全表示' 
                                                : item.isVisible 
                                                ? '部分表示' 
                                                : '非表示'
                                            }
                                        </div>
                                    </div>
                                </div>
                                
                                {/* プログレスバー */}
                                <div className="mt-4 bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${item.intersectionRatio * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* デバッグ情報 */}
                    <div className="mt-8 bg-gray-100 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">デバッグ情報:</h3>
                        <div className="text-sm space-y-1">
                            <p>監視中の要素数: {observedElements.size}</p>
                            <p>Intersection Observer サポート: {typeof IntersectionObserver !== 'undefined' ? 'Yes' : 'No'}</p>
                            <p>クライアントマウント: {mounted ? 'Yes' : 'No'}</p>
                            <p>現在時刻: {new Date().toLocaleTimeString('ja-JP')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}