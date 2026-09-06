// ストレージキー
const STORAGE_KEY = 'ankiSystemData';

// グローバル状態
let allData = [];
let filteredData = [];
let currentIndex = 0;
let isFlipped = false;
let cardStats = {}; // { cardId: { reviews: [], nextReviewDate, easeFactor, interval } }

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initializeEventListeners();
    updateCategoryFilter();
    updateReviewFilter();
    renderDataList();
    updateSpacedRepetitionInfo();
});

// イベントリスナーの初期化
function initializeEventListeners() {
    // タブ切り替え
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabName = e.target.dataset.tab;
            switchTab(tabName);
        });
    });

    // カード操作
    document.getElementById('mainCard').addEventListener('click', flipCard);
    document.getElementById('prevBtn').addEventListener('click', () => previousCard());
    document.getElementById('nextBtn').addEventListener('click', () => nextCard());
    document.getElementById('shuffleBtn').addEventListener('click', () => shuffleCards());

    // マーク機能
    document.getElementById('markHardBtn').addEventListener('click', () => markCard('hard'));
    document.getElementById('markGoodBtn').addEventListener('click', () => markCard('good'));
    document.getElementById('markEasyBtn').addEventListener('click', () => markCard('easy'));

    // フォーム送信
    document.getElementById('addForm').addEventListener('submit', addCard);

    // データ管理
    document.getElementById('categoryFilter').addEventListener('change', filterByCategory);
    document.getElementById('reviewFilter').addEventListener('change', filterByReview);
    document.getElementById('searchBox').addEventListener('input', searchData);
    document.getElementById('exportBtn').addEventListener('click', exportData);
    document.getElementById('importJsonBtn').addEventListener('click', () => {
        document.getElementById('importJsonFile').click();
    });
    document.getElementById('importJsonFile').addEventListener('change', importJsonData);
    document.getElementById('importCsvBtn').addEventListener('click', () => {
        document.getElementById('importCsvFile').click();
    });
    document.getElementById('importCsvFile').addEventListener('change', importCsvData);
    document.getElementById('toggleCsvTextInputBtn').addEventListener('click', toggleCsvTextInput);
    document.getElementById('importCsvTextBtn').addEventListener('click', importCsvFromText);
    document.getElementById('downloadTemplateBtn').addEventListener('click', downloadCsvTemplate);
    document.getElementById('clearBtn').addEventListener('click', clearAllData);
}

// タブ切り替え
function switchTab(tabName) {
    // タブボタンの更新
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // コンテンツの更新
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');

    // 学習タブに切り替わったら、カード表示を更新
    if (tabName === 'learn') {
        displayCard(currentIndex);
    }
}

// ========== データ管理 ==========

// ローカルストレージからデータ読み込み
function loadData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    allData = saved ? JSON.parse(saved) : getSampleData();
    filteredData = [...allData];
    cardStats = JSON.parse(localStorage.getItem('cardStats') || '{}');
    
    // cardStatsの初期化（既存のカードの場合）
    allData.forEach(card => {
        if (!cardStats[card.id]) {
            cardStats[card.id] = {
                reviews: [],
                nextReviewDate: new Date().toISOString(),
                easeFactor: 2.5,
                interval: 0,
                repetitions: 0
            };
        }
    });
    updateTotalCards();
}

// ローカルストレージにデータ保存
function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
    localStorage.setItem('cardStats', JSON.stringify(cardStats));
}

// サンプルデータ（初期データ）
function getSampleData() {
    return [
        {
            id: Date.now() + Math.random(),
            category: 'patent',
            type: 'provision',
            title: '特許法1条（目的）',
            detail: 'この法律は、発明を保護し、その利用を図ることにより、発明を奨励し、もって産業の発達に寄与することを目的とする。',
            subject: '国（立法）',
            object: '発明',
            timing: 'なし',
            procedure: 'なし',
            caselaw: '基本規定',
            notes: '特許法の最も基本的な目的規定。この精神は全体を通じて重要。'
        },
        {
            id: Date.now() + Math.random() + 1,
            category: 'patent',
            type: 'provision',
            title: '特許法2条（定義）',
            detail: '「発明」とは、自然法則を利用した技術的思想の創作であって、高度のものをいう。',
            subject: '特許庁（認定）',
            object: '発明',
            timing: 'なし',
            procedure: '特許出願により',
            caselaw: '定義規定',
            notes: '発明の定義は3要件で構成：①自然法則の利用、②技術的思想、③創作性'
        }
    ];
}

// カード追加
function addCard(e) {
    e.preventDefault();

    const newCard = {
        id: Date.now(),
        category: document.getElementById('category').value,
        type: document.getElementById('type').value,
        title: document.getElementById('title').value,
        detail: document.getElementById('detail').value,
        subject: document.getElementById('subject').value,
        object: document.getElementById('object').value,
        timing: document.getElementById('timing').value,
        procedure: document.getElementById('procedure').value,
        caselaw: document.getElementById('caselaw').value,
        notes: document.getElementById('notes').value
    };

    allData.push(newCard);
    filteredData = [...allData];
    saveData();

    // フォームをリセット
    document.getElementById('addForm').reset();

    // UI更新
    updateCategoryFilter();
    renderDataList();
    updateTotalCards();

    // 成功メッセージ
    alert('カードが追加されました！');
}

// ========== 学習機能 ==========

// カード表示
function displayCard(index) {
    if (filteredData.length === 0) {
        document.getElementById('cardLabel').textContent = 'データがありません';
        document.getElementById('cardTitle').textContent = 'カードを追加してください';
        document.getElementById('cardDetail').textContent = '';
        document.getElementById('detailInfo').style.display = 'none';
        return;
    }

    // インデックス調整
    if (index < 0) {
        currentIndex = filteredData.length - 1;
    } else if (index >= filteredData.length) {
        currentIndex = 0;
    } else {
        currentIndex = index;
    }

    const card = filteredData[currentIndex];
    const typeLabel = getTypeLabel(card.type);

    // カード情報更新
    document.getElementById('cardLabel').textContent = `${card.category.toUpperCase()} · ${typeLabel}`;
    document.getElementById('cardTitle').textContent = card.title;
    document.getElementById('cardDetail').innerHTML = card.detail.replace(/\n/g, '<br>');

    // 詳細情報更新
    document.getElementById('detailSubject').textContent = card.subject || '記載なし';
    document.getElementById('detailObject').textContent = card.object || '記載なし';
    document.getElementById('detailTiming').textContent = card.timing || '記載なし';
    document.getElementById('detailProcedure').textContent = card.procedure || '記載なし';
    document.getElementById('detailCaselaw').textContent = card.caselaw || '記載なし';
    document.getElementById('detailNotes').textContent = card.notes || '記載なし';

    // カウンター更新
    document.getElementById('currentCard').textContent = currentIndex + 1;

    // フリップをリセット
    isFlipped = false;
    document.getElementById('mainCard').classList.remove('flipped');
    document.getElementById('detailInfo').style.display = 'none';

    // 復習情報を表示
    updateReviewScheduleDisplay(card.id);

    // プログレスバー更新
    updateProgressBar();
    updateStats();
}

// ===== 忘却曲線（SM-2アルゴリズム）実装 =====

/**
 * SM-2アルゴリズム（Supermemo-2）を使用した復習スケジュール計算
 * quality: 0-5の整数（0=完全に忘れた、5=最初の試行で完璧に答えられた）
 */
function calculateNextReview(cardId, quality) {
    const stats = cardStats[cardId] || initializeCardStats(cardId);
    const now = new Date();
    
    // SM-2アルゴリズム
    if (quality < 3) {
        // 不正解 or 不十分：反復をリセット
        stats.repetitions = 0;
        stats.interval = 1;
    } else {
        // 正解：間隔を増加
        stats.repetitions++;
        
        if (stats.repetitions === 1) {
            stats.interval = 1;
        } else if (stats.repetitions === 2) {
            stats.interval = 3;
        } else {
            stats.interval = Math.round(stats.interval * stats.easeFactor);
        }
    }
    
    // Ease Factorを更新
    stats.easeFactor = Math.max(1.3, 
        stats.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    );
    
    // 次の復習日を計算
    const nextDate = new Date(now);
    nextDate.setDate(nextDate.getDate() + stats.interval);
    stats.nextReviewDate = nextDate.toISOString();
    
    // 復習履歴に記録
    stats.reviews.push({
        date: now.toISOString(),
        quality: quality,
        interval: stats.interval,
        easeFactor: stats.easeFactor
    });
    
    cardStats[cardId] = stats;
    saveData();
    
    return stats;
}

// カード統計の初期化
function initializeCardStats(cardId) {
    return {
        reviews: [],
        nextReviewDate: new Date().toISOString(),
        easeFactor: 2.5,
        interval: 0,
        repetitions: 0
    };
}

// 復習ステータスを取得
function getReviewStatus(cardId) {
    const stats = cardStats[cardId];
    if (!stats) return 'new';
    
    const nextDate = new Date(stats.nextReviewDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    nextDate.setHours(0, 0, 0, 0);
    
    if (nextDate.getTime() <= today.getTime()) {
        return 'today'; // 今日復習すべき
    } else if (nextDate.getTime() <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).getTime()) {
        return 'soon'; // 近日中に復習
    } else if (stats.repetitions === 0) {
        return 'new'; // 新規カード
    } else {
        return 'mastered'; // マスター済み
    }
}

// 復習情報を表示
function updateReviewScheduleDisplay(cardId) {
    const stats = cardStats[cardId];
    const status = getReviewStatus(cardId);
    
    let scheduleText = '';
    if (status === 'today') {
        scheduleText = '🔴 今日復習してください';
    } else if (status === 'soon') {
        const nextDate = new Date(stats.nextReviewDate);
        const daysUntil = Math.ceil((nextDate - new Date()) / (1000 * 60 * 60 * 24));
        scheduleText = `🟡 ${daysUntil}日後に復習予定`;
    } else if (status === 'new') {
        scheduleText = '🟢 新規カード';
    } else {
        scheduleText = '⭐ マスター済み';
    }
    
    document.getElementById('reviewSchedule').textContent = scheduleText;
}

// カードをフリップ
function flipCard() {
    isFlipped = !isFlipped;
    const card = document.getElementById('mainCard');
    const detailInfo = document.getElementById('detailInfo');

    if (isFlipped) {
        card.classList.add('flipped');
        detailInfo.style.display = 'block';
    } else {
        card.classList.remove('flipped');
        detailInfo.style.display = 'none';
    }
}

// 前へ
function previousCard() {
    displayCard(currentIndex - 1);
}

// 次へ
function nextCard() {
    displayCard(currentIndex + 1);
}

// シャッフル
function shuffleCards() {
    for (let i = filteredData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filteredData[i], filteredData[j]] = [filteredData[j], filteredData[i]];
    }
    currentIndex = 0;
    displayCard(0);
}

// カードをマーク
function markCard(status) {
    const card = filteredData[currentIndex];
    if (!card) return;

    // quality（品質スコア）に変換
    // hard(0) -> 忘れた、good(2) -> 普通、easy(5) -> 簡単
    let quality;
    if (status === 'hard') {
        quality = 1; // 完全に忘れた
    } else if (status === 'good') {
        quality = 3; // 普通に覚えている
    } else if (status === 'easy') {
        quality = 5; // 簡単に答えられた
    }

    // 忘却曲線を利用して次の復習日を計算
    calculateNextReview(card.id, quality);
    
    updateSpacedRepetitionInfo();
    updateStats();

    // 自動で次へ
    nextCard();
}

// プログレスバー更新
function updateProgressBar() {
    const total = filteredData.length;
    const progress = total > 0 ? ((currentIndex + 1) / total) * 100 : 0;
    document.getElementById('progressFill').style.width = progress + '%';
}

// 統計情報更新
function updateStats() {
    const stats = { today: 0, soon: 0, new: 0, mastered: 0 };
    
    allData.forEach(card => {
        const status = getReviewStatus(card.id);
        stats[status]++;
    });

    document.getElementById('todayCount').textContent = stats.today;
    document.getElementById('soonCount').textContent = stats.soon;
    document.getElementById('newCount').textContent = stats.new;
    document.getElementById('masteredCount').textContent = stats.mastered;
}

// 総カード数更新
function updateTotalCards() {
    document.getElementById('totalCards').textContent = filteredData.length;
    if (filteredData.length === 0) {
        currentIndex = 0;
    } else if (currentIndex >= filteredData.length) {
        currentIndex = filteredData.length - 1;
    }
}

// 復習情報を更新
function updateSpacedRepetitionInfo() {
    updateStats();
}

// ========== フィルター・検索 ==========

// カテゴリフィルター初期化
function updateCategoryFilter() {
    const categories = [...new Set(allData.map(d => d.category))];
    const select = document.getElementById('categoryFilter');
    const currentValue = select.value;

    // オプション再構築（最初のオプションは常に「すべてを表示」）
    const optionsHtml = '<option value="">すべてを表示</option>' +
        categories.map(cat => `<option value="${cat}">${getCategoryLabel(cat)}</option>`).join('');
    select.innerHTML = optionsHtml;
    select.value = currentValue;
}

// カテゴリでフィルター
function filterByCategory() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const selectedReview = document.getElementById('reviewFilter').value;
    
    let filtered = selectedCategory 
        ? allData.filter(d => d.category === selectedCategory)
        : [...allData];
    
    // 復習ステータスでもフィルター
    if (selectedReview) {
        filtered = filtered.filter(d => getReviewStatus(d.id) === selectedReview);
    }
    
    filteredData = filtered;
    currentIndex = 0;
    updateTotalCards();
    displayCard(0);
}

// 復習ステータスでフィルター
function filterByReview() {
    filterByCategory(); // 同じロジックを使用
}

// 検索
function searchData() {
    const searchTerm = document.getElementById('searchBox').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;

    filteredData = allData.filter(item => {
        const matchesCategory = !category || item.category === category;
        const matchesSearch = 
            item.title.toLowerCase().includes(searchTerm) ||
            item.detail.toLowerCase().includes(searchTerm) ||
            item.subject.toLowerCase().includes(searchTerm) ||
            item.object.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesSearch;
    });

    renderDataList();
}

// ========== データリスト表示 ==========

// データリストをレンダリング
function renderDataList() {
    const container = document.getElementById('dataList');
    
    if (filteredData.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#999; padding:20px;">データがありません</p>';
        return;
    }

    container.innerHTML = filteredData.map(item => `
        <div class="data-item">
            <div class="data-item-content">
                <div class="data-item-title">${escapeHtml(item.title)}</div>
                <div class="data-item-meta">
                    ${getCategoryLabel(item.category)} · ${getTypeLabel(item.type)}
                </div>
                <div class="data-item-text">${escapeHtml(item.detail).substring(0, 100)}...</div>
            </div>
            <div class="data-item-buttons">
                <button class="edit" onclick="editItem(${item.id})">編集</button>
                <button class="delete" onclick="deleteItem(${item.id})">削除</button>
            </div>
        </div>
    `).join('');
}

// アイテム削除
function deleteItem(id) {
    if (confirm('このアイテムを削除してもよろしいですか？')) {
        allData = allData.filter(item => item.id !== id);
        filteredData = filteredData.filter(item => item.id !== id);
        delete cardStats[id];
        saveData();
        updateCategoryFilter();
        renderDataList();
        updateTotalCards();
        displayCard(currentIndex);
        updateStats();
    }
}

// アイテム編集（簡易版：削除して追加）
function editItem(id) {
    const item = allData.find(d => d.id === id);
    if (!item) return;

    // フォームに値を入力
    document.getElementById('category').value = item.category;
    document.getElementById('type').value = item.type;
    document.getElementById('title').value = item.title;
    document.getElementById('detail').value = item.detail;
    document.getElementById('subject').value = item.subject;
    document.getElementById('object').value = item.object;
    document.getElementById('timing').value = item.timing;
    document.getElementById('procedure').value = item.procedure;
    document.getElementById('caselaw').value = item.caselaw;
    document.getElementById('notes').value = item.notes;

    // 削除
    deleteItem(id);

    // タブ切り替え
    switchTab('manage');

    // フォームをスクロール
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

// ========== エクスポート・インポート ==========

// データエクスポート
function exportData() {
    const dataToExport = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        data: allData,
        studyMarks: studyMarks
    };

    const json = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anki-system-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// データインポート（JSON形式）
function importJsonData(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const imported = JSON.parse(event.target.result);
            
            if (!imported.data || !Array.isArray(imported.data)) {
                throw new Error('無効なフォーマットです');
            }

            // 既存データとマージするか確認
            if (allData.length > 0) {
                if (!confirm('既存のデータに追加しますか？（キャンセルで上書きします）')) {
                    allData = [];
                    cardStats = {};
                }
            }

            // インポート
            allData.push(...imported.data);
            if (imported.cardStats) {
                cardStats = { ...cardStats, ...imported.cardStats };
            }
            
            saveData();
            filteredData = [...allData];
            updateCategoryFilter();
            renderDataList();
            updateTotalCards();
            displayCard(0);
            updateStats();

            alert('JSONデータがインポートされました！');
        } catch (error) {
            alert('インポートに失敗しました: ' + error.message);
        }
    };
    reader.readAsText(file);

    // ファイル選択をリセット
    e.target.value = '';
}

// CSVをJSONに変換
function csvToJson(csvText) {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
        throw new Error('CSVファイルが空です');
    }

    // ヘッダー行を解析
    const headers = parseCSVLine(lines[0]);
    
    // 期待されるカラム
    const expectedColumns = ['カテゴリ', 'タイプ', 'タイトル', '内容', '主体', '客体', '時期', '手続', '関連判例', '備考'];
    
    // カラムマッピング（大文字小文字を区別しない）
    const columnMap = {};
    headers.forEach((header, index) => {
        const normalized = header.trim();
        expectedColumns.forEach(col => {
            if (normalized.includes(col)) {
                columnMap[col] = index;
            }
        });
    });

    // データ行を解析
    const data = [];
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        
        const values = parseCSVLine(lines[i]);
        
        // カラムから値を取得
        const getColumn = (colName) => {
            const idx = columnMap[colName];
            return idx !== undefined && values[idx] ? values[idx].trim() : '';
        };

        const category = getColumn('カテゴリ').toLowerCase();
        const type = getColumn('タイプ').toLowerCase();
        const title = getColumn('タイトル');
        const detail = getColumn('内容');

        // バリデーション
        if (!title || !detail) {
            console.warn(`行${i + 1}をスキップ: タイトルまたは内容が空です`);
            continue;
        }

        // カテゴリとタイプの正規化
        const normalizedCategory = normalizeCategory(category);
        const normalizedType = normalizeType(type);

        data.push({
            id: Date.now() + Math.random() + i,
            category: normalizedCategory,
            type: normalizedType,
            title: title,
            detail: detail,
            subject: getColumn('主体'),
            object: getColumn('客体'),
            timing: getColumn('時期'),
            procedure: getColumn('手続'),
            caselaw: getColumn('関連判例'),
            notes: getColumn('備考')
        });
    }

    if (data.length === 0) {
        throw new Error('有効なデータが見つかりません');
    }

    return data;
}

// CSV行を解析（ダブルクォート対応）
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            if (insideQuotes && line[i + 1] === '"') {
                // エスケープされたダブルクォート
                current += '"';
                i++;
            } else {
                // クォート開閉
                insideQuotes = !insideQuotes;
            }
        } else if (char === ',' && !insideQuotes) {
            // カンマ区切り
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);
    return result;
}

// カテゴリの正規化
function normalizeCategory(cat) {
    const categoryMap = {
        '特許': 'patent',
        'patent': 'patent',
        '実用': 'utility',
        'utility': 'utility',
        '意匠': 'design',
        'design': 'design',
        '商標': 'trademark',
        'trademark': 'trademark',
        '著作': 'copyright',
        'copyright': 'copyright',
        'その他': 'other',
        'other': 'other'
    };
    
    for (let key in categoryMap) {
        if (cat.includes(key)) {
            return categoryMap[key];
        }
    }
    return 'other';
}

// タイプの正規化
function normalizeType(type) {
    const typeMap = {
        '条文': 'provision',
        'provision': 'provision',
        '判例': 'caselaw',
        'caselaw': 'caselaw',
        '過去': 'pastquestion',
        'pastquestion': 'pastquestion'
    };
    
    for (let key in typeMap) {
        if (type.includes(key)) {
            return typeMap[key];
        }
    }
    return 'provision';
}

// データインポート（CSV形式）
function importCsvData(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const csvText = event.target.result;
            const csvData = csvToJson(csvText);
            importCsvDataToStorage(csvData);
            alert(`${csvData.length}件のデータがCSVからインポートされました！`);
        } catch (error) {
            alert('CSVインポートに失敗しました: ' + error.message);
        }
    };
    reader.readAsText(file);

    // ファイル選択をリセット
    e.target.value = '';
}

// CSVデータをストレージにインポート（ファイルまたはテキスト入力用の共通処理）
function importCsvDataToStorage(csvData) {
    // 既存データとマージするか確認
    if (allData.length > 0) {
        if (!confirm(`${csvData.length}件のデータを既存のデータに追加しますか？（キャンセルで上書きします）`)) {
            allData = [];
            cardStats = {};
        }
    }

    // インポート
    allData.push(...csvData);
    saveData();
    filteredData = [...allData];
    updateCategoryFilter();
    renderDataList();
    updateTotalCards();
    displayCard(0);
    switchTab('manage');
    updateStats();
}

// CSVテンプレートをダウンロード
function downloadCsvTemplate() {
    const template = `カテゴリ,タイプ,タイトル,内容,主体,客体,時期,手続,関連判例,備考
特許法,条文,特許法1条（目的）,この法律は、発明を保護し、その利用を図ることにより、発明を奨励し、もって産業の発達に寄与することを目的とする。,国（立法）,発明,なし,なし,基本規定,特許法の最も基本的な目的規定。この精神は全体を通じて重要。
特許法,条文,特許法2条（定義）,「発明」とは、自然法則を利用した技術的思想の創作であって、高度のものをいう。,特許庁（認定）,発明,なし,特許出願により,定義規定,発明の定義は3要件で構成：①自然法則の利用、②技術的思想、③創作性
特許法,判例,進歩性に関する判例,特定事件における進歩性の要件の詳細を説明,最高裁判所,発明,昭和○年,判断手続,最判 昭和50年○月○日,この判例は進歩性判断の基準を示す重要な判例
特許法,過去問題,令和○年度問題1,出願から○年以内に登録を受けないと権利が失効する。これについて説明せよ。,出願人,登録権,登録後○年,特許庁への手続,令和○年度試験問題,年数をしっかり暗記することが重要`;

    const blob = new Blob([template], { type: 'text/csv; charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'anki-template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

// テキスト入力フォームの表示/非表示を切り替え
function toggleCsvTextInput() {
    const container = document.getElementById('csvTextInputContainer');
    const btn = document.getElementById('toggleCsvTextInputBtn');
    
    if (container.style.display === 'none') {
        container.style.display = 'block';
        btn.textContent = '📝 テキスト貼り付けを閉じる';
    } else {
        container.style.display = 'none';
        btn.textContent = '📝 テキスト貼り付けで読み込み';
        document.getElementById('csvTextInput').value = '';
    }
}

// テキストからCSVをインポート
function importCsvFromText() {
    const csvText = document.getElementById('csvTextInput').value.trim();
    
    if (!csvText) {
        alert('CSVデータが入力されていません。');
        return;
    }
    
    try {
        const rows = csvText.split('\n').filter(row => row.trim());
        
        if (rows.length < 2) {
            alert('エラー：ヘッダー行とデータ行が必要です。');
            return;
        }
        
        const jsonData = csvToJson(csvText);
        
        if (jsonData.length === 0) {
            alert('エラー：CSVを解析できません。形式を確認してください。');
            return;
        }
        
        importCsvDataToStorage(jsonData);
        
        // 成功時、入力をクリア
        document.getElementById('csvTextInput').value = '';
        document.getElementById('csvTextInputContainer').style.display = 'none';
        document.getElementById('toggleCsvTextInputBtn').textContent = '📝 テキスト貼り付けで読み込み';
        
        alert(`✓ ${jsonData.length}個のカードをインポートしました。`);
        
    } catch (error) {
        console.error('CSV import error:', error);
        alert(`エラー：${error.message}`);
    }
}

// 元のimportData関数を別名に変更（後方互換性のため）
function importData(e) {
    importJsonData(e);
}

// すべて削除
function clearAllData() {
    if (confirm('本当にすべてのデータを削除してもよろしいですか？この操作は取り消せません。')) {
        if (confirm('確認：本当に削除しますか？')) {
            allData = [];
            filteredData = [];
            cardStats = {};
            currentIndex = 0;
            saveData();
            updateCategoryFilter();
            renderDataList();
            updateTotalCards();
            displayCard(0);
            updateStats();
            alert('すべてのデータが削除されました。');
        }
    }
}

// ========== ユーティリティ ==========

// HTMLエスケープ
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// カテゴリラベル取得
function getCategoryLabel(category) {
    const labels = {
        patent: '特許法',
        utility: '実用新案法',
        design: '意匠法',
        trademark: '商標法',
        copyright: '著作権法',
        other: 'その他'
    };
    return labels[category] || category;
}

// タイプラベル取得
function getTypeLabel(type) {
    const labels = {
        provision: '条文',
        caselaw: '判例',
        pastquestion: '過去問題'
    };
    return labels[type] || type;
}

// ===== PWA & Service Worker 対応 =====

// Service Worker登録
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then(registration => {
            console.log('Service Worker登録成功:', registration);
        }).catch(error => {
            console.log('Service Worker登録失敗:', error);
        });
    });
}

// PWA インストールプロンプト処理
let deferredPrompt;
window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallPrompt();
});

// インストール完了時の処理
window.addEventListener('appinstalled', () => {
    console.log('PWAがインストールされました');
    deferredPrompt = null;
});

// インストールプロンプト表示（オプション）
function showInstallPrompt() {
    // 必要に応じて、インストール案内を表示
    // console.log('PWAインストール可能');
}
