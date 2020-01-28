// HIDE / SHOW BACK TO TOP ON SCROLL
$(function() {
    "use strict";

    let extend = {
        button: '#back-top',
        backToTop: 'btn btn-lg no-rad',
        text: 'Back to Top',
        icon: '<i class="icon-up-open"></i>',
        min: 200,
        fadeIn: 400,
        fadeOut: 400,
        speed: 800
    };
    $('body').append('<a href="#" class="' + extend.backToTop + '" id="' + extend.button.substring(1) + '" title="' + extend.text + '">' + extend.icon + '</a>');
    $(window).scroll(function () {
        var pos = $(window).scrollTop();
        if (pos > extend.min) {
            $(extend.button).fadeIn(extend.fadeIn);
        } else {
            $(extend.button).fadeOut(extend.fadeOut);
        }
    });
    $(extend.button).add(extend.backToTop).click(function (e) {
        $('html, body').animate({
            scrollTop: 0
        }, extend.speed);
        e.preventDefault();
    });
    
});