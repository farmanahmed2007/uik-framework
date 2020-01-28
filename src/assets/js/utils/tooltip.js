$(function () {
    "use strict";

    // HOLDS TOOLTIP ON MOUSEOVER
    $(document).on('mouseover', ".tooltip", function () {
        $(this).find(".tooltip-inner").addClass("active");
    });
    // REMOVES TOOLTIP ON MOUSELEAVE
    $(document).on('mouseleave', '.tooltip, .tooltip-inner', function () {
        $(this).removeClass("active");
        $(this).find(".tooltip-inner").removeClass("active");
    })
});