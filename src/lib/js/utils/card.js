$(function () {
    'use strict'
    $(document).on("click", ".cards.style11 .toggle-btn", function () {
        $(this).closest(".cards.style11").toggleClass("active");
        console.log("132")
    })

});