# 🚀 GitHub Pages でのデプロイ完全ガイド

## 📋 概要

GitHub Pages にこのアプリをアップロードすると、以下のメリットがあります：

- ✅ **URLが永続的** - `https://yourusername.github.io/anki-system`
- ✅ **IPアドレス不要** - スマホから直接アクセス可能
- ✅ **HTTPS対応** - Service Worker（オフライン機能）が動作
- ✅ **PC 不要** - QRコード化できればスマホのみでアクセス可能
- ✅ **無料で無制限** - GitHub の無料プランで OK
- ✅ **永続公開** - 削除するまでずっと使える

---

## 🔧 前提条件

- GitHub アカウント（無料で作成可能）
- Git をインストール
- ターミナル/PowerShell

---

## 📝 ステップ1：GitHub でリポジトリを作成

### **1. GitHub にサインイン**

```
https://github.com にアクセス
ログイン（アカウントがない場合は無料で作成）
```

### **2. 新しいリポジトリを作成**

```
1. GitHub トップページの右上「+」をクリック
2. 「New repository」をクリック
3. 以下を入力：

【リポジトリ名】
  anki-system
  
【説明（Description）】
  弁理士試験 暗記学習アプリ
  
【公開設定】
  「Public」を選択 ⭐ 重要！（GitHub Pages を使うため）
  
【その他】
  「Initialize this repository with a README」は チェック不要
  
4. 「Create repository」をクリック
```

### **3. 作成されたリポジトリのページが表示**

```
例：
https://github.com/yourusername/anki-system

このページを開いたままにしておく
```

---

## 💻 ステップ2：PC でリポジトリをクローン

### **ターミナル/PowerShell を開く**

```
Windows PowerShell：
  1. Windows キー + R
  2. 「powershell」と入力 → Enter

Mac ターミナル：
  1. Spotlight（cmd + Space）で「ターミナル」検索
  2. ターミナルを開く
```

### **リポジトリをクローン**

```bash
git clone https://github.com/yourusername/anki-system.git
cd anki-system
```

**⚠️ `yourusername` は自分の GitHub ユーザー名に置き換えてください**

例：
```bash
git clone https://github.com/john-doe/anki-system.git
cd anki-system
```

---

## 📂 ステップ3：アプリケーションファイルをコピー

### **方法A：手動でコピー（簡単）**

```
1. エクスプローラ/Finder を開く
2. /workspaces/anki-system を開く
3. 以下のファイルをコピー：
   - index.html
   - styles.css
   - script.js
   - manifest.json
   - sw.js

4. クローンしたリポジトリフォルダ（anki-system）にペースト
```

### **方法B：コマンドで実行（推奨）**

**Windows PowerShell:**
```powershell
Copy-Item -Path "C:\workspaces\anki-system\index.html" -Destination ".\anki-system\"
Copy-Item -Path "C:\workspaces\anki-system\styles.css" -Destination ".\anki-system\"
Copy-Item -Path "C:\workspaces\anki-system\script.js" -Destination ".\anki-system\"
Copy-Item -Path "C:\workspaces\anki-system\manifest.json" -Destination ".\anki-system\"
Copy-Item -Path "C:\workspaces\anki-system\sw.js" -Destination ".\anki-system\"
```

**Mac/Linux:**
```bash
cp /workspaces/anki-system/index.html ./anki-system/
cp /workspaces/anki-system/styles.css ./anki-system/
cp /workspaces/anki-system/script.js ./anki-system/
cp /workspaces/anki-system/manifest.json ./anki-system/
cp /workspaces/anki-system/sw.js ./anki-system/
```

---

## 🚀 ステップ4：GitHub にプッシュ

### **コミットと push**

```bash
cd anki-system

git add index.html styles.css script.js manifest.json sw.js

git commit -m "Add anki-system files"

git push -u origin main
```

**最初のプッシュ時に以下が表示されます：**

```
認証が必要です。
GitHub のユーザー名：[GitHub ユーザー名を入力]
パスワード：[パスワン or Personal Access Token を入力]
```

**⚠️ パスワード入力時の注意**

2024年以降、GitHub はパスワード認証を廃止しました。
以下の方法のいずれかを使用：

#### **方法1：Personal Access Token（推奨）**

```
1. https://github.com/settings/tokens にアクセス
2. 「Generate new token」をクリック
3. 「Generate new token (classic)」をクリック
4. 以下を設定：
   - Token name：「anki-system」
   - Expiration：「No expiration」
   - Select scopes：「repo」をチェック
5. 「Generate token」をクリック
6. 表示されたトークンをコピー
7. パスワード入力欄にトークンをペースト
```

#### **方法2：Git Credential Manager**

```
1. https://github.com/git-ecosystem/git-credential-manager でインストール
2. 指示に従ってインストール完了
3. 次回の認証時にブラウザで認証
```

---

## ✅ ステップ5：GitHub Pages 設定

### **リポジトリの Settings を開く**

```
1. GitHub でリポジトリページを開く
   https://github.com/yourusername/anki-system
2. 「Settings」タブをクリック
3. 左メニューの「Pages」をクリック
```

### **GitHub Pages を有効化**

```
【Source】
  1. Branch：「main」を選択
  2. Folder：「/ (root)」を選択
  3. 「Save」をクリック

数秒待つと：
  「Your site is published at https://yourusername.github.io/anki-system」
  と表示されます
```

---

## 📱 ステップ6：スマホからアクセス

### **URL を開く**

```
ブラウザで以下を入力：
  https://yourusername.github.io/anki-system

例：
  https://john-doe.github.io/anki-system
```

**✅ アプリが表示されます！**

---

## 📌 ステップ7：PWA をホーム画面に追加

### **Android + Brave**

```
1. Brave でアプリが開いている
2. 画面右下の「⋮」（3点メニュー）をタップ
3. 「アプリをインストール」をタップ
4. 「インストール」をタップ
5. ✅ ホーム画面に「弁理士暗記」アイコンが追加
```

### **iOS（Safari）**

```
1. Safari でアプリが開いている
2. 下部の「共有」をタップ
3. 「ホーム画面に追加」をタップ
4. ✅ ホーム画面に「弁理士暗記」アイコンが追加
```

---

## 🔄 今後、アプリを更新したい場合

### **ファイルを修正**

```
1. PC で /workspaces/anki-system のファイルを編集
2. 修正後、GitHub に push：

   cd anki-system
   git add .
   git commit -m "Fix: [何を変えたか説明]"
   git push

3. 数秒～数分で GitHub Pages に反映
```

---

## ✅ 確認チェックリスト

- [ ] GitHub アカウントを作成
- [ ] 「anki-system」リポジトリを作成（Public）
- [ ] ローカルにクローン
- [ ] 5つのファイルをコピー
- [ ] git commit & git push
- [ ] GitHub Pages を有効化
- [ ] https://yourusername.github.io/anki-system でアプリが表示
- [ ] Brave/Safari でホーム画面に追加
- [ ] ✅ 完全成功！

---

## 🆘 トラブルシューティング

### **問題1：「Repository not found」**

**原因：**
- リポジトリ名が間違っている
- GitHub にログインしていない

**解決：**
```bash
# リモートを確認
git remote -v

# 正しい URL を設定
git remote set-url origin https://github.com/yourusername/anki-system.git
```

### **問題2：「Permission denied」**

**原因：**
- GitHub の認証失敗
- Personal Access Token の期限切れ

**解決：**
```bash
# 認証をリセット
git config --global --unset credential.helper

# 次回のプッシュ時に再認証
git push
```

### **問題3：GitHub Pages でアプリが表示されない**

**原因：**
- GitHub Pages がまだ初期化中
- 5つのファイルがすべてアップロードされていない

**解決：**
```bash
# リポジトリの状態確認
git status

# すべてのファイルがアップロードされているか確認
git log

# 待つ（初回は1-2分かかることもある）
# ブラウザキャッシュをクリア（Ctrl+Shift+Delete）
```

### **問題4：Service Worker が登録されない**

**原因：**
- GitHub Pages は HTTPS で自動対応されているはず

**解決：**
```
開発者ツール（F12）→ Application タブ →
Service Workers を確認
登録されていないなら、ページを再読み込み
```

---

## 🎓 次のステップ

```
1. ✅ GitHub Pages でアプリが起動
2. ✅ ホーム画面にアイコン追加
3. スマホで「📋 データ管理」タブを開く
4. 「📋 CSVテンプレートをダウンロード」
5. PC で Excel を開いて条文・判例を入力
6. 「📊 CSV形式でインポート」でアプリに読み込み
7. 毎日学習開始！
```

---

## 💡 GitHub Pages のメリット

- ✅ **永続URL** - 何年でも使える
- ✅ **HTTPS対応** - セキュアな通信
- ✅ **スマホからダイレクトアクセス** - IPアドレス不要
- ✅ **共有が簡単** - URL をコピペするだけ
- ✅ **無料で無制限** - 容量制限なし
- ✅ **自動更新** - GitHub に push するだけで反映

---

**これで確実に動作します！頑張ってください！🎓✨**
