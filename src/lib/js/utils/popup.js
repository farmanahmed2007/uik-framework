$(function () {
    'use strict'
    $(document).on('click','.popup-btn', function () {
        $(".popup .popup-inner").each(function (i, obj) {
            $(obj).hide()
        })
        $(this).closest(".popup").find(".popup-inner").show()
    })
    $(document).on('click','.popup .popup-header .close-btn', function () {
        $(this).closest(".popup").find(".popup-inner").fadeOut("3000")
    })
    $(document).mousedown(function (e) {
        var container = $('.popup-inner');
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            $(container).fadeOut("3000");
        };
    });
});