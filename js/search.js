(function ($) {
    "use strict";

    // 定義要搜尋的頁面列表
    const searchablePages = [
        { url: 'index.html', title: '首頁' },
        { url: 'about.html', title: '關於我們' },
        { url: 'service.html', title: '服務' },
        { url: 'contact.html', title: '聯絡我們' },
        { url: 'team.html', title: '我們的模特' },
        { url: 'testimonial.html', title: '客戶評價' },
        { url: 'ktv.html', title: 'KTV 選擇' },
        { url: 'hotel.html', title: '飯店選擇' },
        { url: 'restaurant.html', title: '餐廳推薦' },
        { url: 'guide.html', title: '新手指南' }
    ];

    // 儲存所有頁面的內容
    let pageContents = {};

    // 載入所有頁面內容
    function loadAllPages() {
        const promises = searchablePages.map(page => {
            return $.ajax({
                url: page.url,
                method: 'GET',
                dataType: 'html'
            }).then(html => {
                // 解析 HTML 並提取文字內容
                const $doc = $(html);
                const textContent = extractTextContent($doc);
                pageContents[page.url] = {
                    title: page.title,
                    url: page.url,
                    content: textContent,
                    html: html
                };
            }).catch(err => {
                console.warn(`無法載入頁面: ${page.url}`, err);
            });
        });
        return Promise.all(promises);
    }

    // 提取頁面的文字內容
    function extractTextContent($doc) {
        // 移除 script 和 style 標籤
        $doc.find('script, style, nav, footer').remove();
        
        // 提取主要內容區域的文字
        const sections = [];
        
        // 提取標題
        $doc.find('h1, h2, h3, h4, h5').each(function() {
            const text = $(this).text().trim();
            if (text) {
                sections.push({ type: 'heading', text: text, element: $(this).get(0) });
            }
        });
        
        // 提取段落
        $doc.find('p, li, td, th').each(function() {
            const text = $(this).text().trim();
            if (text && text.length > 10) { // 只提取較長的文字
                sections.push({ type: 'content', text: text, element: $(this).get(0) });
            }
        });
        
        return sections;
    }

    // 高亮關鍵字
    function highlightKeyword(text, keyword) {
        if (!keyword) return text;
        const regex = new RegExp(`(${escapeRegex(keyword)})`, 'gi');
        return text.replace(regex, '<mark class="search-highlight">$1</mark>');
    }

    // 轉義正則表達式特殊字符
    function escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // 搜尋功能
    function searchPages(keyword) {
        if (!keyword || keyword.trim().length === 0) {
            return [];
        }

        const results = [];
        const searchTerm = keyword.toLowerCase().trim();

        Object.keys(pageContents).forEach(url => {
            const page = pageContents[url];
            const matches = [];

            page.content.forEach(section => {
                const text = section.text.toLowerCase();
                if (text.includes(searchTerm)) {
                    // 找到匹配的段落
                    const highlightedText = highlightKeyword(section.text, keyword);
                    matches.push({
                        type: section.type,
                        text: highlightedText,
                        originalText: section.text
                    });
                }
            });

            if (matches.length > 0) {
                results.push({
                    title: page.title,
                    url: page.url,
                    matches: matches,
                    matchCount: matches.length
                });
            }
        });

        // 按匹配數量排序
        results.sort((a, b) => b.matchCount - a.matchCount);

        return results;
    }

    // 顯示搜尋結果
    function displaySearchResults(results, keyword) {
        const $resultsContainer = $('#searchResults');
        $resultsContainer.empty();

        if (results.length === 0) {
            $resultsContainer.html(`
                <div class="text-center py-5">
                    <i class="fas fa-search fa-3x text-muted mb-3"></i>
                    <p class="text-muted">找不到包含 "${keyword}" 的內容</p>
                </div>
            `);
            return;
        }

        let html = `<div class="mb-3"><strong>找到 ${results.length} 個頁面，共 ${results.reduce((sum, r) => sum + r.matchCount, 0)} 個匹配結果</strong></div>`;

        results.forEach(result => {
            html += `
                <div class="search-result-item mb-4 p-3 bg-secondary rounded">
                    <h5 class="mb-3">
                        <a href="${result.url}" class="text-primary text-decoration-none">
                            <i class="fas fa-file-alt me-2"></i>${result.title}
                        </a>
                        <span class="badge bg-primary ms-2">${result.matchCount} 個匹配</span>
                    </h5>
                    <div class="search-snippets">
            `;

            // 顯示前 3 個匹配結果
            result.matches.slice(0, 3).forEach(match => {
                const snippet = match.originalText.length > 150 
                    ? match.originalText.substring(0, 150) + '...' 
                    : match.originalText;
                const highlightedSnippet = highlightKeyword(snippet, keyword);
                
                html += `
                    <div class="search-snippet mb-2 p-2 bg-dark rounded">
                        <small class="text-muted">${match.type === 'heading' ? '標題' : '內容'}:</small>
                        <p class="mb-0 text-light">${highlightedSnippet}</p>
                    </div>
                `;
            });

            if (result.matches.length > 3) {
                html += `<small class="text-muted">還有 ${result.matches.length - 3} 個匹配結果...</small>`;
            }

            html += `
                    </div>
                    <a href="${result.url}" class="btn btn-sm btn-outline-primary mt-2">
                        查看完整頁面 <i class="fas fa-arrow-right ms-1"></i>
                    </a>
                </div>
            `;
        });

        $resultsContainer.html(html);
    }

    // 初始化搜尋功能
    function initSearch() {
        // 載入所有頁面
        loadAllPages().then(() => {
            console.log('所有頁面已載入，搜尋功能已就緒');
        });

        // 搜尋輸入框事件
        $('#searchInput').on('input', function() {
            const keyword = $(this).val();
            if (keyword.length >= 2) {
                const results = searchPages(keyword);
                displaySearchResults(results, keyword);
            } else {
                $('#searchResults').html(`
                    <div class="text-center py-5 text-muted">
                        <i class="fas fa-search fa-2x mb-3"></i>
                        <p>請輸入至少 2 個字元開始搜尋</p>
                    </div>
                `);
            }
        });

        // Enter 鍵搜尋
        $('#searchInput').on('keypress', function(e) {
            if (e.which === 13) {
                e.preventDefault();
                const keyword = $(this).val();
                if (keyword.length >= 2) {
                    const results = searchPages(keyword);
                    displaySearchResults(results, keyword);
                }
            }
        });

        // 搜尋按鈕點擊
        $('#searchButton').on('click', function() {
            const keyword = $('#searchInput').val();
            if (keyword.length >= 2) {
                const results = searchPages(keyword);
                displaySearchResults(results, keyword);
            }
        });

        // 關閉模態框時清空搜尋
        $('#searchModal').on('hidden.bs.modal', function() {
            $('#searchInput').val('');
            $('#searchResults').html(`
                <div class="text-center py-5 text-muted">
                    <i class="fas fa-search fa-2x mb-3"></i>
                    <p>請輸入關鍵字開始搜尋</p>
                </div>
            `);
        });

        // 模態框顯示時聚焦輸入框
        $('#searchModal').on('shown.bs.modal', function() {
            $('#searchInput').focus();
        });
    }

    // 當 DOM 準備好時初始化
    $(document).ready(function() {
        initSearch();
    });

})(jQuery);
