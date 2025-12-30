// React の必要なフックをインポート
import { useEffect, useRef, useState } from 'react';

export default function IntersectionObserverPage() {
    // 現在画面に表示されているアイテムのIDを保存するSet
    // Setを使うことで重複なく効率的にIDを管理
    const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
    
    // コンポーネントがクライアントサイドでマウントされたかを管理
    // SSR時とクライアント側での差異を防ぐため
    const [isMounted, setIsMounted] = useState(false);
    
    // IntersectionObserver インスタンスを保持するref
    // useRefで保持することでレンダー間で同じインスタンスを使用
    const observerRef = useRef<IntersectionObserver | null>(null);

    // コンポーネントがマウントされた時に実行される副作用
    useEffect(() => {
        setIsMounted(true); // クライアントサイドでマウント完了をマーク
    }, []); // 空の依存配列なので初回のみ実行

    // IntersectionObserver の設定と初期化
    useEffect(() => {
        // まだマウントされていない場合は何もしない（SSR対策）
        if (!isMounted) return;

        // 要素が画面に入ったり出たりした時に呼ばれるコールバック関数
        const handleIntersection = (entries: IntersectionObserverEntry[]) => {
            console.log('Observer triggered with', entries.length, 'entries'); // デバッグ用
            // 前の状態をコピーして新しいSetを作成
            setVisibleItems(prev => {
                const newSet = new Set(prev); // 前の状態をコピー
                
                // 変化があった全ての要素をループ処理
                entries.forEach(entry => {
                    // data-id属性からアイテムのIDを取得
                    const id = parseInt(entry.target.getAttribute('data-id') || '0');
                    console.log(`Item ${id} is ${entry.isIntersecting ? 'visible' : 'hidden'}`); // デバッグ用
                    
                    // 要素が画面に表示されている場合
                    if (entry.isIntersecting) {
                        newSet.add(id);    // SetにアイテムのIDを追加
                    } else {
                        newSet.delete(id); // SetからアイテムのIDを削除
                    }
                });
                console.log('Visible items:', Array.from(newSet)); // デバッグ用
                return newSet; // 新しいSetを返してstateを更新
            });
        };

        // IntersectionObserver のインスタンスを作成
        observerRef.current = new IntersectionObserver(handleIntersection, {
            threshold: 0.1 // 要素の10%が表示された時にコールバックを実行（より敏感に）
        });

        // 既存の要素を監視開始（タイミングを改善）
        const timer = setTimeout(() => {
            const elements = document.querySelectorAll('[data-id]');
            console.log('Found elements:', elements.length); // デバッグ用
            elements.forEach(element => {
                if (observerRef.current) {
                    observerRef.current.observe(element);
                    console.log('Observing element:', element.getAttribute('data-id')); // デバッグ用
                }
            });
        }, 100);

        // コンポーネントがアンマウントされた時のクリーンアップ処理
        return () => {
            clearTimeout(timer);
            observerRef.current?.disconnect(); // Observer を停止してメモリリークを防ぐ
        };
    }, [isMounted]); // isMounted が変化した時のみ再実行

    // 各アイテムの DOM 要素に ref を設定するためのコールバック関数
    const itemRef = (id: number) => (element: HTMLDivElement | null) => {
        // 要素が存在する場合
        if (element) {
            // 要素に data-id 属性を設定（後でコールバックで識別するため）
            element.setAttribute('data-id', id.toString());
            console.log(`Setting up item ${id}`, element); // デバッグ用
        }
    };

    // サーバーサイドレンダリング中は何も表示しない
    // これによりクライアントとサーバーでの HTML 不一致を防ぐ
    if (!isMounted) {
        return null;
    }

    return (
        <main className="p-8 max-w-2xl mx-auto">
            {/* ページタイトル */}
            <h1 className="text-3xl font-bold mb-6">Intersection Observer サンプル</h1>
            
            {/* 説明とステータス表示 */}
            <div className="mb-6 p-4 bg-blue-50 rounded">
                <p className="text-sm">
                    スクロールして各ボックスの表示状態を確認してください。
                    10%以上表示されると青色になります。
                </p>
                {/* 現在表示中のアイテム数をリアルタイム表示 */}
                <p className="text-sm mt-2">
                    現在表示中: {visibleItems.size} / 8個
                </p>
            </div>

            {/* 監視対象のボックス一覧 */}
            <div className="space-y-20">
                {/* 8個のアイテムを配列で生成 */}
                {Array.from({ length: 8 }, (_, index) => {
                    const id = index + 1;                    // アイテムのID（1から開始）
                    const isVisible = visibleItems.has(id);  // このアイテムが表示中かチェック
                    
                    return (
                        <div
                            key={id}                    // React の key（ユニークである必要）
                            ref={itemRef(id)}           // ref コールバックでObserver登録
                            className={`
                                h-40 p-6 rounded-lg border-2 flex items-center justify-center
                                text-2xl font-bold transition-all duration-300
                                ${isVisible 
                                    ? 'bg-blue-100 border-blue-400 text-blue-800 scale-105'  // 表示中のスタイル
                                    : 'bg-gray-100 border-gray-300 text-gray-600'            // 非表示のスタイル
                                }
                            `}
                        >
                            {/* ボックス内のコンテンツ */}
                            <div className="text-center">
                                <div>ボックス {id}</div>
                                <div className="text-lg mt-2">
                                    {/* 表示状態に応じた絵文字とテキスト */}
                                    {isVisible ? '👁️ 表示中' : '😴 非表示'}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* コードの解説セクション */}
            <div className="mt-12 p-4 bg-gray-50 rounded text-sm">
                <h3 className="font-bold mb-2">コードのポイント:</h3>
                <ul className="space-y-1">
                    <li>• useRef でIntersectionObserverを参照</li>
                    <li>• useState でvisibleItemsを管理</li>
                    <li>• threshold: 0.5 で50%表示時に検知</li>
                    <li>• isMountedでHydrationエラーを回避</li>
                </ul>
            </div>
        </main>
    );
}