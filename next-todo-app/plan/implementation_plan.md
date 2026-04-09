# TODOアプリ設計書 (Implementation Plan)

## 概要
ユーザーが日々のタスクを管理するための、モダンで直感的なTODOアプリケーションです。ユーザーごとにタスクを管理できるよう認証機能（ユーザー登録・ログイン・ログアウト）を実装します。また、Storybook、Vitest、Playwright等を用いた堅牢な開発・テスト環境を構築します。将来的なDB移行を見据え、APIベースのアーキテクチャを採用しています。

## User Review Required
> [!IMPORTANT]
> アプリケーションのビジネスロジックの中核となる **「データドメイン」** を設計に追加しました。内容をご確認いただき、不足しているプロパティ（例：「タスクの優先度」など）がなければ、開発（環境構築・コーディング）を開始させてください。

## ドメインモデル（データ定義）
今回の要件において必要となるドメイン（エンティティ）は大きく以下の2つです。将来的にDBへ移行する際にも、このモデル構造をテーブルとしてマッピングします。

### 1. User (ユーザー)
システムを利用する主体となるドメインです。

- `id`: string (一意の識別子 / UUID等)
- `name`: string (ユーザー名)
- `email`: string (ログイン時に使用するメールアドレスなど)
- `password`: string (ハッシュ化してダミーAPI/DBに保存)
- `createdAt`: Date (登録日時)
- `updatedAt`: Date (更新日時)

### 2. Todo / Task (タスク)
TODOアプリの核となるデータドメインです。ユーザーごとに分離されているため、Userドメインと紐付きます。

- `id`: string (タスクの一意の識別子)
- `userId`: string (作成したユーザーのID。「誰のタスクか」を識別・保護するために必須)
- `title`: string (タスクの内容)
- `completed`: boolean (完了・未完了のステータス)
- `createdAt`: Date (作成日時。並び替えなどに使用)
- `updatedAt`: Date (ステータスの更新時などに変更される日時)

*(※今後の拡張案として、`dueDate` (期限) や `priority` (優先度) などを追加することが容易な設計にしておきます)*

---

## Proposed Changes
### プラットフォーム＆主な技術要件
- Framework: **Next.js (App Router)**
- Language: **TypeScript**
- Styling: **Tailwind CSS (v4)** + **shadcn/ui**
- データのフェッチライブラリ: **SWR**
- データの保存＆通信: **Next.js API Route (ダミーAPI)** -> *(将来的には本番DBへ)*

### 開発・品質保証環境
- **UI・コンポーネント管理:** `Storybook` 
- **ユニットテスト:** `Vitest` (および React Testing Library) 
- **E2E (総合) テスト:** `Playwright` 

### 認証フローとAPIの設計
1. **ユーザー登録 (`/api/auth/register`)**: ダミーユーザーをAPI内のメモリ配列に保存。
2. **ログイン (`/api/auth/login`)**: セッション（Cookie）を作成。
3. **ミドルウェア (`middleware.ts`)**: 未ログインアクセスを `/login` へリダイレクトしてアプリを保護。
4. **TODO API (`/api/todos/*`)**: 今回設計した `Todo` ドメインのうち、認証された `User` のIDに紐づくタスクのみを操作するよう制限。

### Project Structure (予定)
#### `app/`
- `(auth)/login/page.tsx`, `register/page.tsx`: ログイン・ユーザー登録UI
- `(dashboard)/page.tsx`: メインのTODO操作UI
#### `types/`
- `user.ts`, `todo.ts`: 上記で定義したドメインモデルを TypeScript の型 (`type` や `interface`) として定義します。

## Verification Plan
### Local Setup & Testing
1. プロジェクトの基礎作成 (`Next.js`, `Tailwind v4`, `shadcn/ui`, `SWR`)を実施。
2. **Storybook**, **Vitest**, **Playwright** のセットアップを実施。
### 開発時の検証
- ダミーAPIを用いてデータドメイン（ユーザー、タスク）がリレーションを保って登録・取得できること。
- `npm run test` (Vitest) および `npx playwright test` がグリーン（成功）になること。
