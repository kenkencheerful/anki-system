# 🚀 インストール失敗時の3つの代替方法

ローカルサーバー（PC + Android）でうまくいかない場合の代替案です。

---

## 📊 方法の比較表

| 特徴 | GitHub Pages | Netlify | ngrok |
|------|------------|---------|-------|
| **難易度** | ⭐ 簡単 | ⭐ 最も簡単 | ⭐⭐ 中程度 |
| **費用** | 無料 | 無料 | 無料 |
| **URL** | 永続的 | 永続的 | 一時的 |
| **HTTPS** | ✅ | ✅ | ✅ |
| **セットアップ時間** | 15分 | 5分 | 10分 |
| **推奨度** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

---

## 🎯 推奨順位

### **1位：GitHub Pages（推奨）**
- ✅ 最も安定している
- ✅ 永続的な URL
- ✅ 複雑な設定不要
- ✅ Git の知識があれば簡単

**セットアップ時間：15分**
詳細ガイド：`GITHUB_PAGES_DEPLOYMENT.md` 参照

---

### **2位：Netlify（最も簡単）**
- ✅ 最短でデプロイ
- ✅ ドラッグ&ドロップで OK
- ✅ コマンド不要

**セットアップ時間：5分**
→ 下記に手順記載

---

### **3位：ngrok（現在のセットアップを活かす）**
- ✅ PC サーバーをそのまま使用
- ✅ インターネット経由で外部公開
- ⚠️ 一時的な URL（再起動時に変更）

**セットアップ時間：10分**
→ 下記に手順記載

---

## 🌐 方法2：Netlify でのデプロイ（最も簡単・5分）

### **ステップ1：Netlify サインアップ**

```
1. https://www.netlify.com にアクセス
2. 「Sign up」をクリック
3. GitHub アカウントで認証（簡単）
   または
   メールアドレスで登録
```

### **ステップ2：アプリをアップロード**

```
1. Netlify ダッシュボードを開く
2. 「New site from Git」をクリック
3. 「GitHub」を選択
4. 「anki-system」リポジトリを検索・選択
5. 「Deploy site」をクリック

✅ 自動デプロイ開始
```

**または（Git 不要）：**

```
1. Netlify ダッシュボードを開く
2. 「Deploys」セクションを探す
3. 「Drag and drop your site folder here」エリアに
   anki-system フォルダをドラッグ&ドロップ
4. ✅ 即座にデプロイ開始
```

### **ステップ3：URL を確認**

```
Netlify がランダムな URL を生成：
  https://random-name.netlify.app

カスタムドメイン（オプション）：
  ダッシュボード → Site settings で変更可能
```

### **ステップ4：スマホでアクセス**

```
Brave で URL を開く：
  https://random-name.netlify.app

✅ アプリが表示
```

---

## 🔗 方法3：ngrok でトンネリング（10分）

ローカルサーバーをインターネット公開します。

### **ステップ1：ngrok をインストール**

```
https://ngrok.com/download にアクセス
自分の OS（Windows/Mac/Linux）版をダウンロード
インストール
```

### **ステップ2：PC でサーバーを起動**

```bash
cd /workspaces/anki-system
python3 -m http.server 8000
```

### **ステップ3：ngrok で公開**

**別のターミナルを開いて：**

```bash
ngrok http 8000
```

### **ステップ4：URL を取得**

```
ターミナルに以下のように表示：

Forwarding  https://xxxx-xxxx-xxxx.ngrok.io -> http://localhost:8000

この URL をスマホで開く
```

### **ステップ5：スマホでアクセス**

```
Brave で URL を開く：
  https://xxxx-xxxx-xxxx.ngrok.io

✅ アプリが表示
```

---

## ⚠️ 各方法のデメリット・制限

### **GitHub Pages**
- ⚠️ Git コマンドの学習が必要
- ⚠️ 初回セットアップが少し複雑
- ✅ その後は簡単

### **Netlify**
- ⚠️ 無料プランは月間 100GB の転送量制限
- ⚠️ （このアプリなら問題なし）
- ✅ その他特に制限なし

### **ngrok**
- ⚠️ URL が一時的（ngrok 再起動で変更）
- ⚠️ PC サーバーが起動している必要
- ⚠️ 無料プランは月間 1000回のアクセス制限

---

## 🎯 推奨の選び方

### **「とにかく今すぐ試したい」**
→ **Netlify**（5分で OK）

### **「永続的に使いたい」**
→ **GitHub Pages**（推奨、15分で OK）

### **「PC サーバーをそのまま使いたい」**
→ **ngrok**（10分で OK）

---

## 📚 詳細ガイド

各方法の詳細ガイドは以下を参照：

- **GitHub Pages：** `GITHUB_PAGES_DEPLOYMENT.md`
- **Netlify：** 本ファイルの「方法2」
- **ngrok：** 本ファイルの「方法3」

---

## ✅ 最終チェック

**GitHub Pages を選んだ場合：**
```
□ GitHub アカウント作成
□ anki-system リポジトリ作成（Public）
□ git clone & git push
□ Settings → Pages で有効化
□ https://yourusername.github.io/anki-system でテスト
□ ホーム画面に追加
✅ 完了
```

**Netlify を選んだ場合：**
```
□ Netlify アカウント作成
□ サイトをドラッグ&ドロップ
□ URL を確認
□ https://random-name.netlify.app でテスト
□ ホーム画面に追加
✅ 完了（5分で完了！）
```

---

これらの方法なら、確実に動作します！

**最初の失敗は申し訳ありません。これでうまくいきます！🎓✨**
