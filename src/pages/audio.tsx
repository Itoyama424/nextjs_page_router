import { useState, useRef, useEffect } from 'react';
import { generateBeep, generateMelody, generateWAVBlob } from '@/lib/audioUtils';

type AudioState = 'loading' | 'ready' | 'playing' | 'paused' | 'error';

export default function AudioPage() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [audioState, setAudioState] = useState<AudioState>('loading');
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [volume, setVolume] = useState<number>(0.5);
    const [audioContextState, setAudioContextState] = useState<string>('unknown');

    // AudioContext の状態を確認
    const checkAudioContext = () => {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContext) {
                const context = new AudioContext();
                setAudioContextState(context.state);
                context.close();
            } else {
                setAudioContextState('not supported');
            }
        } catch (error) {
            setAudioContextState('error');
        }
    };

    useEffect(() => {
        checkAudioContext();
        
        const audio = audioRef.current;
        if (!audio) return;

        // 初期音源をローカル生成の音源に設定
        const wavBlob = generateWAVBlob(440, 2);
        const audioUrl = URL.createObjectURL(wavBlob);
        audio.src = audioUrl;

        // イベントリスナーの設定
        const handleLoadedData = () => {
            setAudioState('ready');
            setDuration(audio.duration);
        };

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        const handlePlay = () => {
            setAudioState('playing');
        };

        const handlePause = () => {
            setAudioState('paused');
        };

        const handleError = (event: Event) => {
            console.error('Audio error:', event);
            setAudioState('error');
        };

        const handleEnded = () => {
            setAudioState('ready');
            setCurrentTime(0);
        };

        // イベントリスナーを追加
        audio.addEventListener('loadeddata', handleLoadedData);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('error', handleError);
        audio.addEventListener('ended', handleEnded);

        // 初期音量設定
        audio.volume = volume;

        // クリーンアップ
        return () => {
            audio.removeEventListener('loadeddata', handleLoadedData);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('error', handleError);
            audio.removeEventListener('ended', handleEnded);
            
            // Blob URLをクリーンアップ
            if (audio.src.startsWith('blob:')) {
                URL.revokeObjectURL(audio.src);
            }
        };
    }, [volume]);

    const handlePlayPause = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (audioState === 'playing') {
            audio.pause();
        } else {
            audio.play().catch(error => {
                console.error('Audio play failed:', error);
                setAudioState('error');
            });
        }
    };

    const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if (!audio) return;

        const newTime = parseFloat(event.target.value);
        audio.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(event.target.value);
        setVolume(newVolume);
        
        const audio = audioRef.current;
        if (audio) {
            audio.volume = newVolume;
        }
    };

    const formatTime = (time: number): string => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <main className="p-8 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6">HTML Audio Element サンプル</h1>
            
            {/* 音声ファイル（ローカル生成音源を使用） */}
            <audio
                ref={audioRef}
                preload="metadata"
            />

            <div className="bg-gray-100 p-6 rounded-lg">
                {/* 状態表示 */}
                <div className="mb-4">
                    <p className="text-sm text-gray-600">
                        状態: <span className="font-medium">{audioState}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                        AudioContext: <span className="font-medium">{audioContextState}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                        時間: {formatTime(currentTime)} / {formatTime(duration)}
                    </p>
                </div>

                {/* 再生/停止ボタン */}
                <div className="mb-4">
                    <button
                        onClick={handlePlayPause}
                        disabled={audioState === 'loading' || audioState === 'error'}
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                    >
                        {audioState === 'playing' ? '⏸️ 停止' : '▶️ 再生'}
                    </button>
                </div>

                {/* シークバー */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                        再生位置
                    </label>
                    <input
                        type="range"
                        min="0"
                        max={duration}
                        value={currentTime}
                        onChange={handleSeek}
                        disabled={audioState === 'loading' || audioState === 'error'}
                        className="w-full"
                    />
                </div>

                {/* 音量調整 */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                        音量: {Math.round(volume * 100)}%
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-full"
                    />
                </div>

                {/* エラー表示 */}
                {audioState === 'error' && (
                    <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
                        <p className="font-medium">音声ファイルの読み込みに失敗しました</p>
                        <p className="text-sm mt-1">
                            代替音源を試すか、ブラウザの音声設定を確認してください
                        </p>
                    </div>
                )}
            </div>

            {/* 音源選択 */}
            <div className="mt-6 p-4 bg-blue-50 rounded">
                <h3 className="font-medium mb-3">音源を選択:</h3>
                
                {/* AudioContext許可ボタン */}
                <div className="mb-4 p-3 bg-yellow-50 rounded border border-yellow-200">
                    <button
                        onClick={async () => {
                            try {
                                // ユーザー操作で AudioContext を開始
                                const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                                const context = new AudioContext();
                                
                                if (context.state === 'suspended') {
                                    await context.resume();
                                }
                                
                                setAudioContextState(context.state);
                                
                                // 短いテスト音を再生
                                const oscillator = context.createOscillator();
                                const gainNode = context.createGain();
                                
                                oscillator.connect(gainNode);
                                gainNode.connect(context.destination);
                                
                                oscillator.frequency.value = 880;
                                oscillator.type = 'sine';
                                gainNode.gain.setValueAtTime(0.1, context.currentTime);
                                gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.2);
                                
                                oscillator.start();
                                oscillator.stop(context.currentTime + 0.2);
                                
                                setTimeout(() => context.close(), 300);
                                console.log('AudioContext 初期化完了');
                            } catch (error) {
                                console.error('AudioContext 初期化エラー:', error);
                            }
                        }}
                        className="w-full px-4 py-2 bg-yellow-500 text-white rounded font-medium hover:bg-yellow-600"
                    >
                        🔊 音声を有効化 (最初にクリック!)
                    </button>
                    <p className="text-xs text-yellow-700 mt-1">
                        ブラウザの音声許可のために最初にこのボタンを押してください
                    </p>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => {
                            const audio = audioRef.current;
                            if (audio) {
                                const wavBlob = generateWAVBlob(440, 1);
                                const audioUrl = URL.createObjectURL(wavBlob);
                                if (audio.src.startsWith('blob:')) {
                                    URL.revokeObjectURL(audio.src);
                                }
                                audio.src = audioUrl;
                                setAudioState('loading');
                            }
                        }}
                        className="px-3 py-2 bg-blue-500 text-white rounded text-sm"
                    >
                        🎵 ラ音 (440Hz)
                    </button>
                    <button
                        onClick={() => {
                            const audio = audioRef.current;
                            if (audio) {
                                const wavBlob = generateWAVBlob(523.25, 1);
                                const audioUrl = URL.createObjectURL(wavBlob);
                                if (audio.src.startsWith('blob:')) {
                                    URL.revokeObjectURL(audio.src);
                                }
                                audio.src = audioUrl;
                                setAudioState('loading');
                            }
                        }}
                        className="px-3 py-2 bg-purple-500 text-white rounded text-sm"
                    >
                        🎶 ド音 (523Hz)
                    </button>
                    <button
                        onClick={async () => {
                            try {
                                console.log('Web Audio API 再生開始...');
                                await generateBeep(659.25, 0.8, 0.4);
                                console.log('Web Audio API 再生完了');
                            } catch (error) {
                                console.error('Web Audio API エラー:', error);
                                alert('エラー: ' + error);
                            }
                        }}
                        className="px-3 py-2 bg-green-500 text-white rounded text-sm"
                    >
                        🔊 直接再生 (ミ音)
                    </button>
                    <button
                        onClick={async () => {
                            try {
                                console.log('メロディー再生開始...');
                                await generateMelody();
                                console.log('メロディー再生完了');
                            } catch (error) {
                                console.error('メロディー再生エラー:', error);
                                alert('エラー: ' + error);
                            }
                        }}
                        className="px-3 py-2 bg-orange-500 text-white rounded text-sm"
                    >
                        🎹 メロディー
                    </button>
                    <button
                        onClick={() => {
                            // シンプルなクリック音
                            try {
                                const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt55xNEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAkUXrTp66hVFQpGn+L2uGoeAzOOWe4=');
                                audio.volume = 0.5;
                                audio.play().then(() => {
                                    console.log('クリック音再生成功');
                                }).catch(error => {
                                    console.error('クリック音再生失敗:', error);
                                });
                            } catch (error) {
                                console.error('音声作成エラー:', error);
                            }
                        }}
                        className="px-3 py-2 bg-red-500 text-white rounded text-sm"
                    >
                        📢 クリック音
                    </button>
                </div>
                
                <div className="mt-3 p-2 bg-yellow-50 rounded">
                    <p className="text-xs text-yellow-800">
                        💡 「直接再生」と「メロディー」はWeb Audio APIを使用し、確実に音が出ます
                    </p>
                </div>
            </div>
        </main>
    );
}