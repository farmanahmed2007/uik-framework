// Makes the table header fixed on scroll functionality to the page
$(function () {
    'use strict';

    var sideBarOpened = JSON.parse(JSON.stringify(localStorage.getItem("toggleState")));
    $(document).on('click', '.sidebar-toggle', function () {
        sideBarOpened = JSON.parse(JSON.stringify(localStorage.getItem("toggleState")));
        $('#header-fixed').css('left', (($(".table-responsive").scrollLeft() * -1) + (sideBarOpened == 'opened') ? 245 : 65) + 'px');
    });

    $('#header-fixed').html('');
    var tableOffset = $("#table-1").offset('top');
	var $fixedHeader = $("#header-fixed").append($('#headHtml').html());

    $('.table-responsive').bind("scroll", function () {
        var offset = $(this).scrollTop();

        if (offset >= tableOffset && $fixedHeader.is(":hidden")) {
            $fixedHeader.show();
        }
        else if (offset < tableOffset) {
            $fixedHeader.hide();
        }
	});

	$(".table-responsive").scroll(function () {
		var sideBarWidth = 0;
		if (sideBarOpened == 'opened') {
			sideBarWidth = 245
		} else { sideBarWidth = 65 }
		$('#header-fixed').css('left', (($(".table-responsive").scrollLeft() - sideBarWidth) * -1) + 'px');
	});
	$(".table-responsive2").scroll(function () {
		var sideBarWidth = 0;
		if (sideBarOpened == 'opened') {
			sideBarWidth = 245
		} else { sideBarWidth = 65 }
		$('#header-fixed').css('left', (($(".table-responsive2").scrollLeft() - sideBarWidth) * -1) + 'px');
	});
});

// ADDING SCROLL ON TABLE TOP AND BOTTOM
// $(function () {
//     'use strict';
//     $(".table-responsive").scroll(function () {
//         $(this).closest('.scroll-desktop, .scroll-desktop-160, .no-scroll-desktop').find(".table-responsive2").scrollLeft($(this).scrollLeft());
//         var sideBarWidth = 0;
//         if (sideBarOpened == 'opened') {
//             sideBarWidth = 245
//         } else { sideBarWidth = 65 }
//         $('#header-fixed').css('left', (($(".table-responsive").scrollLeft() - sideBarWidth) * -1) + 'px');
//         $(".table-responsive2").scrollLeft($(".table-responsive").scrollLeft());
//     });
//     $(".table-responsive2").scroll(function () {
//         $(this).closest('.scroll-desktop, .scroll-desktop-160, .no-scroll-desktop').find(".table-responsive").scrollLeft($(this).scrollLeft());
//         var sideBarWidth = 0;
//         if (sideBarOpened == 'opened') {
//             sideBarWidth = 245
//         } else { sideBarWidth = 65 }
//         $('#header-fixed').css('left', (($(".table-responsive2").scrollLeft() - sideBarWidth) * -1) + 'px');
//         $(".table-responsive").scrollLeft($(".table-responsive2").scrollLeft());
//     });
// });

// ADDING SCROLL ON TABLE TOP AND BOTTOM
$(function () {
	'use strict';

	$(".table-responsive").scroll(function () {
		var table_width = $(this).closest(".scroll-desktop, .scroll-desktop-160, .no-scroll-desktop").find(".table-responsive2 table").width();
		$(this).find("table").css({ 'cssText': 'width: ' + table_width + 'px !important;max-width:' + table_width + 'px !important' });
		$(this).closest('.scroll-desktop, .scroll-desktop-160, .no-scroll-desktop').find(".table-responsive2").scrollLeft($(this).scrollLeft());
	});
	$(".table-responsive2").scroll(function () {
        var table_width = $(this).closest(".scroll-desktop, .scroll-desktop-160, .no-scroll-desktop").find(".table-responsive table").width();
        $(this).find("table").css({ 'cssText': 'width: ' + table_width + 'px !important;max-width:' + table_width + 'px !important' });
        $(this).closest('.scroll-desktop, .scroll-desktop-160, .no-scroll-desktop').find(".table-responsive").scrollLeft($(this).scrollLeft());
	});
});

// SCROLL TABLE WITH ARROWS TO LEFT & RIGHT
$(function () {
	'use strict';
    $(document).on('click', '.scrollArrows .left', function () {
        var leftPos = $('.table-responsive').scrollLeft();
        $(".table-responsive").animate({
            scrollLeft: leftPos - 200
        }, 200);
    });
    $(document).on('click', '.scrollArrows .right', function () {
        var leftPos = $('.table-responsive').scrollLeft();
        $(".table-responsive").animate({
            scrollLeft: leftPos + 200
        }, 200);
    });
});