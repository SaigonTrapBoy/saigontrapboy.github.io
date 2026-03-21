(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs（掛在 window 供首頁「自由行」切換後重置動畫）
    window.wowInstance = new WOW();
    window.wowInstance.init();

    /**
     * 當區塊曾為 display:none 時，WOW 可能已誤判或已播過；重置後再 doSync 可重新套用與包套相同的進場節奏。
     */
    window.resetWowIn = function (container) {
        if (!container) return;
        var wow = window.wowInstance;
        if (!wow || typeof wow.doSync !== 'function') return;
        var cfg = wow.config;
        var animateClass = cfg.animateClass || 'animated';
        wow.all = wow.all.filter(function (el) {
            return !container.contains(el);
        });
        wow.boxes = wow.boxes.filter(function (el) {
            return !container.contains(el);
        });
        var nodes = container.querySelectorAll('.' + cfg.boxClass);
        for (var i = 0; i < nodes.length; i++) {
            var box = nodes[i];
            var re = new RegExp('\\s*' + animateClass + '\\s*', 'g');
            box.className = box.className.replace(re, ' ').replace(/\s+/g, ' ').trim();
            box.style.visibility = '';
            box.style.animationName = '';
            box.style.webkitAnimationName = '';
            box.style.MozAnimationName = '';
            box.style.animationDuration = '';
            box.style.webkitAnimationDuration = '';
            box.style.animationDelay = '';
            box.style.webkitAnimationDelay = '';
        }
        wow.doSync(container);
        if (typeof wow.scrollHandler === 'function') {
            wow.scrollHandler();
        }
    };


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 0) {
            $('.navbar').addClass('position-fixed bg-dark shadow-sm');
        } else {
            $('.navbar').removeClass('position-fixed bg-dark shadow-sm');
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Testimonials carousel
    $('.testimonial-carousel').owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        loop: true,
        nav: false,
        dots: true,
        items: 1,
        dotsData: true,
    });

    
})(jQuery);

