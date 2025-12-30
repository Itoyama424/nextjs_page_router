import { useEffect, useRef, useState } from 'react';

// 画像の状態を管理する型
interface ImageState {
    isVisible: boolean;
    isLoading: boolean;
    isLoaded: boolean;
    hasError: boolean;
}

// サンプル画像のデータ
const sampleImages: string[] = [
    'https://picsum.photos/400/300?random=1',
    'https://picsum.photos/400/300?random=2', 
    'https://picsum.photos/400/300?random=3',
    'https://picsum.photos/400/300?random=4',
    'https://picsum.photos/400/300?random=5',
    'https://picsum.photos/400/300?random=6',
    'https://picsum.photos/400/300?random=7',
    'https://picsum.photos/400/300?random=8',
];

// 個別の画像コンポーネント
function LazyImage({ src, index }: { src: string; index: number }): React.ReactElement {
    const [imageState, setImageState]: [ImageState, React.Dispatch<React.SetStateAction<ImageState>>] = useState<ImageState>({
        isVisible: false,
        isLoading: false,
        isLoaded: false,
        hasError: false
    });

    const imgRef: React.MutableRefObject<HTMLDivElement | null> = useRef<HTMLDivElement | null>(null);

    useEffect((): (() => void) => {
        const observer: IntersectionObserver = new IntersectionObserver(
            (entries: IntersectionObserverEntry[]): void => {
                const entry: IntersectionObserverEntry = entries[0];
                if (entry.isIntersecting && !imageState.isLoaded && !imageState.isLoading) {
                    console.log(`🖼️ 画像${index + 1}が見えました - 読み込み開始`);
                    setImageState(prev => ({ ...prev, isVisible: true, isLoading: true }));
                }
            },
            { 
                threshold: 0.1, // 10%見えたら読み込み開始
                rootMargin: '100px' // 100px手前から読み込み開始
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return (): void => observer.disconnect();
    }, [imageState.isLoaded, imageState.isLoading, index]);

    // 画像読み込み処理
    useEffect((): void => {
        if (imageState.isVisible && imageState.isLoading && !imageState.isLoaded) {
            const img: HTMLImageElement = new Image();
            
            img.onload = (): void => {
                console.log(`✅ 画像${index + 1}読み込み完了`);
                setImageState(prev => ({ 
                    ...prev, 
                    isLoading: false, 
                    isLoaded: true 
                }));
            };

            img.onerror = (): void => {
                console.error(`❌ 画像${index + 1}読み込みエラー`);
                setImageState(prev => ({ 
                    ...prev, 
                    isLoading: false, 
                    hasError: true 
                }));
            };

            // 読み込み開始
            img.src = src;
        }
    }, [imageState.isVisible, imageState.isLoading, imageState.isLoaded, src, index]);

    return (
        <div 
            ref={imgRef}
            className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden shadow-md"
        >
            {/* プレースホルダー（まだ見えていない時） */}
            {!imageState.isVisible && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                    <div className="text-center text-gray-500">
                        <div className="text-4xl mb-2">📷</div>
                        <div className="text-sm">画像 #{index + 1}</div>
                        <div className="text-xs mt-1">下にスクロール...</div>
                    </div>
                </div>
            )}

            {/* スピナー（読み込み中） */}
            {imageState.isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                    <div className="text-center">
                        {/* 回転するスピナー */}
                        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <div className="text-blue-600 font-semibold">読み込み中...</div>
                        <div className="text-sm text-blue-500 mt-1">画像 #{index + 1}</div>
                    </div>
                </div>
            )}

            {/* 実際の画像（読み込み完了後） */}
            {imageState.isLoaded && (
                <img 
                    src={src}
                    alt={`画像 ${index + 1}`}
                    className="w-full h-full object-cover transition-opacity duration-700 opacity-0 animate-fadeIn"
                    style={{ opacity: 1 }}
                />
            )}

            {/* エラー表示 */}
            {imageState.hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-100 to-pink-100">
                    <div className="text-center text-red-600">
                        <div className="text-4xl mb-2">❌</div>
                        <div className="font-semibold">読み込みエラー</div>
                        <div className="text-sm mt-1">画像 #{index + 1}</div>
                    </div>
                </div>
            )}

            {/* 読み込み状態インジケーター */}
            <div className="absolute top-2 right-2">
                {imageState.isLoading && (
                    <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        Loading
                    </div>
                )}
                {imageState.isLoaded && (
                    <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        ✓ Loaded
                    </div>
                )}
                {imageState.hasError && (
                    <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        Error
                    </div>
                )}
            </div>
        </div>
    );
}

export default function LazyImageLoader(): React.ReactElement {
    const [stats, setStats]: [{ loaded: number; loading: number; total: number }, React.Dispatch<React.SetStateAction<{ loaded: number; loading: number; total: number }>>] = useState<{ loaded: number; loading: number; total: number }>({
        loaded: 0,
        loading: 0,
        total: sampleImages.length
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50">
            {/* ヘッダー */}
            <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">🖼️ 遅延画像読み込み</h1>
                            <p className="text-gray-600 mt-1">Intersection Observer + Lazy Loading + Spinner</p>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-500">読み込み状況</div>
                            <div className="text-lg font-semibold text-blue-600">
                                {stats.loaded} / {stats.total}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* メインコンテンツ */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* 説明 */}
                <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">🚀 機能説明</h2>
                    <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            画面に近づくと自動で画像読み込み開始
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            読み込み中はスピナーアニメーション表示
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            読み込み完了後にスムーズに画像表示
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            エラー時は適切なエラー表示
                        </li>
                    </ul>
                </div>

                {/* 画像グリッド */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sampleImages.map((src: string, index: number) => (
                        <LazyImage 
                            key={index} 
                            src={src} 
                            index={index}
                        />
                    ))}
                </div>

                {/* フッター情報 */}
                <div className="mt-12 text-center text-gray-500">
                    <p className="text-sm">
                        下にスクロールして遅延読み込みの動作を確認してください
                    </p>
                    <p className="text-xs mt-2">
                        ブラウザの開発者ツール（Network）でリクエストタイミングも確認できます
                    </p>
                </div>
            </div>

            {/* カスタムCSS for フェードインアニメーション */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.7s ease-out;
                }
            `}</style>
        </div>
    );
}