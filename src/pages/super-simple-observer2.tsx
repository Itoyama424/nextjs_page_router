import { useEffect, useRef, useState } from 'react';
/**
 * return : React.ReactElement (divの四角いイメージ)
 * useEffect(() => {　型推論
 * useEffect((): (() => void) => {　 return (): void => observer.disconnect();を型定義
 */
export default function SuperSimpleObserverRemake(): React.ReactElement {
    const [isVisibled, setIsVisibled] : [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false);
    const boxrefref : React.MutableRefObject<HTMLDivElement | null> = useRef<HTMLDivElement | null>(null);
    useEffect(():(() => void) => {
        const observer: IntersectionObserver = new IntersectionObserver(
            // コンストラクタの第一引数 callback function
            (entries : IntersectionObserverEntry[]):void => {
                setIsVisibled(entries[0].isIntersecting);
            },
            { threshold : 0.9}
        );
        if(boxrefref.current) {
            observer.observe(boxrefref.current)
        }

        return () : void => observer.disconnect();
    },[]);

    return (
        <div className='min-h-[200vh] bg-gradient-to-b from-orange-100 to-green-100'>
            <div className='p-8 text-center'>
                <h1 className='text-4xl font-bold md-4'>🎉超簡単 Observer👺</h1>
                <p className='text-gray-600'>下にスクロール🩵</p>
            </div>
            {/* この要素は何も中身がない空のdivで、純粋に縦方向のスペース（余白）を作るために使われています。 */}
            <div className='h-26'></div>

            {/* 説明 */}
            <div className='text-center mt-8 p-4'>
                <div className={`text-lg font-semibold transition-all duration-500 
                                ${isVisibled} ? 'text-orange-600 scale-110' : 'text-gray-500 scale-100'}`}>
                                    {isVisibled ? '🤗ボックスが見えた！' : '🫣ボックスが隠れている！'}
                                </div>
            </div>

            <div className='h-16'></div>

            {/* メインボックス */}
            <div className='flex justify-center'>
                <div
                    ref={boxrefref} className={`w-50 h-50 rounded-3xl flex iten-center justyfy-center text-white font-bold
                        transform tramsition-all duration-700 ease-bounce
                        ${isVisibled ? 'bg-gradient-to-r from-yellow-400 to-orange-500 scale-150 rotate-12 shadow-2xl' 
                                     :  'bg-gray-400 scale-75 rotate-0 shadow-md'
                        }
                    `}
                >
                    <div className='text-center'>
                        <div className='text-2xl'>
                            {isVisibled ? '🎅' : '👺'}
                        </div>
                        <div className='text-sm mt-1'>
                            {isVisibled ? 'キラキラ!' : 'スヤスヤ...'}
                        </div>
                    </div>
                </div>
            </div>
            {/* もう一つのスペーサー */}
            <div className="h-96"></div>
        </div>
    )
}