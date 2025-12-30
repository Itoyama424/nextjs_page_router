import { useEffect, useState } from 'react';

export default function VerySimpleIntersection() {
    const [box1Visible, setBox1Visible] = useState(false);
    const [box2Visible, setBox2Visible] = useState(false);
    const [box3Visible, setBox3Visible] = useState(false);

    useEffect(() => {
        // シンプルなObserver作成
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const boxId = entry.target.getAttribute('data-box');
                const isVisible = entry.isIntersecting;
                
                if (boxId === '1') setBox1Visible(isVisible);
                if (boxId === '2') setBox2Visible(isVisible);
                if (boxId === '3') setBox3Visible(isVisible);
            });
        });

        // ページ読み込み後に要素を監視
        setTimeout(() => {
            document.querySelectorAll('[data-box]').forEach(element => {
                observer.observe(element);
            });
        }, 100);

        return () => observer.disconnect();
    }, []);

    return (
        <div className="p-8 space-y-96">
            <h1 className="text-2xl mb-8">超簡単 Intersection Observer</h1>

            <div
                data-box="1"
                className={`w-32 h-32 rounded flex items-center justify-center text-white font-bold ${
                    box1Visible ? 'bg-red-500' : 'bg-gray-500'
                }`}
            >
                BOX 1<br/>
                {box1Visible ? '見える' : '見えない'}
            </div>

            <div
                data-box="2"
                className={`w-32 h-32 rounded flex items-center justify-center text-white font-bold ${
                    box2Visible ? 'bg-blue-500' : 'bg-gray-500'
                }`}
            >
                BOX 2<br/>
                {box2Visible ? '見える' : '見えない'}
            </div>

            <div
                data-box="3"
                className={`w-32 h-32 rounded flex items-center justify-center text-white font-bold ${
                    box3Visible ? 'bg-green-500' : 'bg-gray-500'
                }`}
            >
                BOX 3<br/>
                {box3Visible ? '見える' : '見えない'}
            </div>
        </div>
    );
}