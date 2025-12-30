import { useState } from 'react';

export default function SimpleAudioPage() {
    const [message, setMessage] = useState('音声テストページ');

    // 最もシンプルな音声再生
    const playSimpleBeep = () => {
        try {
            // speechSynthesis API (確実に動作)
            const utterance = new SpeechSynthesisUtterance('ピ');
            utterance.rate = 10; // 高速で短く
            utterance.pitch = 2; // 高い音
            speechSynthesis.speak(utterance);
            setMessage('音声合成で再生しました');
        } catch (error) {
            console.error('Speech synthesis error:', error);
            setMessage('音声合成エラー: ' + error);
        }
    };

    // Web Audio API (最小構成)
    const playWebAudio = async () => {
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            
            // サスペンド状態を解除
            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }

            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800; // 800Hz
            oscillator.type = 'square'; // 四角波でよりはっきりした音
            gainNode.gain.value = 0.1; // 音量

            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.2);

            setTimeout(() => {
                audioContext.close();
            }, 300);

            setMessage('Web Audio APIで再生しました');
        } catch (error) {
            console.error('Web Audio error:', error);
            setMessage('Web Audio エラー: ' + error);
        }
    };

    // HTMLAudio要素 (インライン音源)
    const playHtmlAudio = () => {
        try {
            // 非常に短い音源
            const audio = new Audio();
            audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8t2JOAkYaLvu55xNEAxQp+PwtmMcBjiR1/LMeSwEJHfH8N2QQAoUXrTp66hVFApGn+L2uGoeAzOOWfI=';
            audio.volume = 0.5;
            
            audio.play().then(() => {
                setMessage('HTMLAudioで再生しました');
            }).catch(error => {
                console.error('HTML Audio error:', error);
                setMessage('HTMLAudio エラー: ' + error);
            });
        } catch (error) {
            console.error('Audio creation error:', error);
            setMessage('Audio作成エラー: ' + error);
        }
    };

    // ブラウザの音声設定をテスト
    const testAudioPermissions = async () => {
        try {
            // マイクへのアクセスを要求（音声許可のトリガー）
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop()); // すぐに停止
            setMessage('音声許可が取得されました');
        } catch (error) {
            setMessage('音声許可が必要です: ' + error);
        }
    };

    return (
        <main className="p-8 max-w-lg mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">音声テスト</h1>
            
            <div className="bg-gray-100 p-6 rounded-lg mb-6">
                <p className="text-center text-lg mb-4">{message}</p>
                
                <div className="space-y-3">
                    <button
                        onClick={playSimpleBeep}
                        className="w-full px-6 py-4 bg-blue-500 text-white rounded-lg text-lg font-medium hover:bg-blue-600"
                    >
                        🔊 音声合成 (最も確実)
                    </button>
                    
                    <button
                        onClick={playWebAudio}
                        className="w-full px-6 py-4 bg-green-500 text-white rounded-lg text-lg font-medium hover:bg-green-600"
                    >
                        🎵 Web Audio API
                    </button>
                    
                    <button
                        onClick={playHtmlAudio}
                        className="w-full px-6 py-4 bg-purple-500 text-white rounded-lg text-lg font-medium hover:bg-purple-600"
                    >
                        📱 HTML Audio
                    </button>
                    
                    <button
                        onClick={testAudioPermissions}
                        className="w-full px-6 py-4 bg-orange-500 text-white rounded-lg text-lg font-medium hover:bg-orange-600"
                    >
                        🎤 音声許可テスト
                    </button>
                </div>
            </div>

            <div className="text-sm text-gray-600 space-y-2">
                <p><strong>トラブルシューティング:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                    <li>ブラウザの音量確認</li>
                    <li>システムの音量確認</li>
                    <li>ブラウザのミュート解除</li>
                    <li>ヘッドフォン/スピーカー接続確認</li>
                </ul>
            </div>
        </main>
    );
}