import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // 型推論を禁止して明示的な型定義を強制
      "@typescript-eslint/explicit-function-return-type": "error",  // 関数の戻り値型を必須に
      "@typescript-eslint/explicit-module-boundary-types": "error", // export関数の型を必須に  
      "@typescript-eslint/no-inferrable-types": "off",              // 推論可能な型の定義を許可
      "@typescript-eslint/typedef": [
        "error",
        {
          "arrayDestructuring": true,     // 配列分割代入で型必須
          "arrowParameter": true,         // アロー関数の引数で型必須
          "memberVariableDeclaration": true, // クラスメンバー変数で型必須
          "objectDestructuring": true,    // オブジェクト分割代入で型必須
          "parameter": true,              // 関数引数で型必須
          "propertyDeclaration": true,    // プロパティ宣言で型必須
          "variableDeclaration": true,    // 変数宣言で型必須
          "variableDeclarationIgnoreFunction": false // 関数も含めて型必須
        }
      ]
    },
  },
];

export default eslintConfig;
