// Next.jsでのWeb標準型定義の網羅的テスト
// このファイルでTypeScriptコンパイルエラーが出るかをチェック

// 1. DOM関連
const element: HTMLElement = document.createElement('div');
const input: HTMLInputElement = document.createElement('input');
const canvas: HTMLCanvasElement = document.createElement('canvas');
const video: HTMLVideoElement = document.createElement('video');
const audio: HTMLAudioElement = document.createElement('audio');

// 2. イベント関連
const mouseEvent: MouseEvent = new MouseEvent('click');
const keyEvent: KeyboardEvent = new KeyboardEvent('keydown');
const customEvent: CustomEvent = new CustomEvent('custom');
const touchEvent: TouchEvent = new TouchEvent('touchstart');

// 3. Fetch/Network関連
const request: Request = new Request('/api/test');
const response: Response = new Response();
const headers: Headers = new Headers();
const abortController: AbortController = new AbortController();
const requestInit: RequestInit = { method: 'GET' };

// 4. Storage関連
const storage: Storage = localStorage;
const sessionStor: Storage = sessionStorage;

// 5. URL/Data関連
const url: URL = new URL('https://example.com');
const urlParams: URLSearchParams = new URLSearchParams();
const formData: FormData = new FormData();
const blob: Blob = new Blob(['test']);
const file: File = new File(['test'], 'test.txt');

// 6. 時間/パフォーマンス関連
const performance: Performance = window.performance;
const now: number = performance.now();
const date: Date = new Date();

// 7. 暗号化/セキュリティ関連
const crypto: Crypto = window.crypto;
const crossOriginIsolated: boolean = window.crossOriginIsolated;

// 8. 国際化関連
const dateFormat: Intl.DateTimeFormat = new Intl.DateTimeFormat('ja-JP');
const numberFormat: Intl.NumberFormat = new Intl.NumberFormat('ja-JP');
const collator: Intl.Collator = new Intl.Collator('ja-JP');

// 9. Canvas/Graphics関連
const context2d: CanvasRenderingContext2D | null = canvas.getContext('2d');
const webglContext: WebGLRenderingContext | null = canvas.getContext('webgl');

// 10. Audio/Video関連
const audioContext: AudioContext = new AudioContext();
const mediaDevices: MediaDevices = navigator.mediaDevices;

// 11. Worker関連
// const worker: Worker = new Worker('worker.js'); // ファイルが必要
// const sharedWorker: SharedWorker = new SharedWorker('shared-worker.js');

// 12. Observer関連
const intersectionObserver: IntersectionObserver = new IntersectionObserver(() => {});
const mutationObserver: MutationObserver = new MutationObserver(() => {});
const resizeObserver: ResizeObserver = new ResizeObserver(() => {});

// 13. 通知/Permission関連
// const notification: Notification = new Notification('Test'); // 許可が必要
const permissions: Permissions = navigator.permissions;

// 14. Geolocation関連
const geolocation: Geolocation = navigator.geolocation;

// 15. WebSocket関連
// const websocket: WebSocket = new WebSocket('wss://example.com'); // 実際の接続が必要

// 16. IndexedDB関連
const indexedDB: IDBFactory = window.indexedDB;

// 17. History API関連
const history: History = window.history;
const location: Location = window.location;

// 18. Selection API関連
const selection: Selection | null = window.getSelection();

// 19. Clipboard API関連 (Secure Context必要)
// const clipboard: Clipboard = navigator.clipboard;

// 20. WebRTC関連
const rtcPeerConnection: RTCPeerConnection = new RTCPeerConnection();

// 21. Streams関連
const readableStream: ReadableStream = new ReadableStream();
const writableStream: WritableStream = new WritableStream();

// 22. WebGL2関連
const webgl2Context: WebGL2RenderingContext | null = canvas.getContext('webgl2');

// 23. OffscreenCanvas関連 (一部ブラウザ)
// const offscreenCanvas: OffscreenCanvas = new OffscreenCanvas(100, 100);

// 24. BroadcastChannel関連
const broadcastChannel: BroadcastChannel = new BroadcastChannel('test');

// 25. MessageChannel関連
const messageChannel: MessageChannel = new MessageChannel();

// 26. TextEncoder/Decoder関連
const textEncoder: TextEncoder = new TextEncoder();
const textDecoder: TextDecoder = new TextDecoder();

// 27. AbortSignal関連
const abortSignal: AbortSignal = AbortSignal.abort();

// 28. ImageBitmap関連
// const imageBitmap: ImageBitmap = await createImageBitmap(blob); // async

// 29. DOMParser関連
const domParser: DOMParser = new DOMParser();

// 30. XMLHttpRequest関連 (古いがまだ使われる)
const xhr: XMLHttpRequest = new XMLHttpRequest();

// Next.js/React固有の制限事項をテスト
// SSR環境では以下は undefined になる
if (typeof window !== 'undefined') {
    // ブラウザ環境でのみ利用可能
    console.log('Browser environment detected');
} else {
    // サーバーサイド環境
    console.log('Server environment detected');
}

export default function WebStandardTypesTest() {
    return (
        <div>
            <h1>Web標準型定義テスト</h1>
            <p>このコンポーネントがエラーなくコンパイルされれば、型定義は利用可能です</p>
        </div>
    );
}