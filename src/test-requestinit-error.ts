// RequestInit エラーの例

// 1. 関数パラメータで型が不明な場合
function badFetch(url: string, options) {  // エラー：optionsの型がない
    return fetch(url, options);
}

// 2. 間違ったプロパティを指定
const badOptions: RequestInit = {
    method: 'POST',
    timeout: 5000,  // エラー：RequestInitにはtimeoutは存在しない
};

// 3. 型が合わない値を代入
const wrongType: RequestInit = "not an object";  // エラー：文字列は代入できない

// 4. 配列の要素型が間違っている
const optionsList: RequestInit[] = [
    { method: 'GET' },
    'invalid'  // エラー：文字列はRequestInit型ではない
];