// ACCORDIAN
$(function () {
    "use strict";
    var $trigger = $('.acc-trigger');
    $trigger.off().on('click', function () {
        var $this = $(this);
        if ($this.next().is(':hidden')) {
            $this.closest('.accordian').find('.acc-trigger').removeClass('active').next().slideUp(300);
            $this.toggleClass('active').next().slideDown(300);
        }
        else if ($this.hasClass('active')) {
            $this.removeClass('active').next().slideUp(300);
        }
        return false;
    });
});