// Dropdown Submenu Alignment Script
$(document).ready(function() {
    // 動態對齊子選單到父選單項目的頂部
    function alignSubmenu() {
        $('.dropdown-submenu').each(function() {
            var $submenu = $(this);
            var $link = $submenu.find('> a.dropdown-item').first();
            var $submenuList = $submenu.find('> .dropdown-menu');
            
            if ($link.length && $submenuList.length) {
                // 獲取 link 相對於 submenu (li) 的位置
                var linkOffset = $link.position().top;
                // 設置子選單的 top 值來對齊到 link 的頂部
                $submenuList.css({
                    'top': linkOffset + 'px',
                    'left': '100%',
                    'margin-left': '0'
                });
            }
        });
    }

    // 頁面載入時執行
    setTimeout(alignSubmenu, 100);
    
    // 當下拉選單打開時重新計算
    $('.dropdown').on('shown.bs.dropdown', function() {
        setTimeout(alignSubmenu, 50);
    });
    
    // 當滑鼠移到 dropdown-submenu 時也重新計算
    $('.dropdown-submenu').on('mouseenter', function() {
        setTimeout(function() {
            alignSubmenu();
        }, 10);
    });
});

