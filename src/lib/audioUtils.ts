// Web Audio APIを使って音声を生成する関数
export const generateBeep = (frequency = 440, duration = 0.5, volume = 0.3) => {
  return new Promise<void>((resolve, reject) => {
    try {
      // AudioContextの作成（ブラウザ互換性を考慮）
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) {
        reject(new Error('Web Audio API is not supported'));
        return;
      }

      const audioContext = new AudioContext();
      
      // AudioContextが suspended の場合は resume
      if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
          playSound();
        });
      } else {
        playSound();
      }

      function playSound() {
        // オシレーター（音の生成器）
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        // 音の接続
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // 音の設定
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine'; // サイン波
        
        // 音量の設定（フェードアウト効果付き）
        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
        
        // 音の再生
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
        
        // 終了時の処理
        oscillator.onended = () => {
          audioContext.close();
          resolve();
        };
      }
      
    } catch (error) {
      reject(error);
    }
  });
};

// 複数の音を組み合わせたメロディーを生成
export const generateMelody = async () => {
  const notes = [
    { frequency: 261.63, duration: 0.3 }, // ド
    { frequency: 293.66, duration: 0.3 }, // レ
    { frequency: 329.63, duration: 0.3 }, // ミ
    { frequency: 349.23, duration: 0.3 }, // ファ
  ];
  
  for (const note of notes) {
    await generateBeep(note.frequency, note.duration);
    await new Promise(resolve => setTimeout(resolve, 100)); // 少し間を空ける
  }
};

// WAVファイルを生成する関数
export const generateWAVBlob = (frequency = 440, duration = 1, sampleRate = 44100) => {
  const numSamples = duration * sampleRate;
  const arrayBuffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(arrayBuffer);
  
  // WAVヘッダーの書き込み
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, numSamples * 2, true);
  
  // 音声データの生成
  for (let i = 0; i < numSamples; i++) {
    const sample = Math.sin(2 * Math.PI * frequency * i / sampleRate) * 0.5;
    view.setInt16(44 + i * 2, sample * 32767, true);
  }
  
  return new Blob([arrayBuffer], { type: 'audio/wav' });
};