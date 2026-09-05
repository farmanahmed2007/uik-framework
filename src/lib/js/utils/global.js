// FINDS ANY LINK WITH href="#page_" AND POSITIONS TO ITS TARGET SMOOTHLY
$(function () {
	"use strict";

	$(document).on('click', 'a[href ^= "#page"]', function (event) {
		event.preventDefault();
		var speed = 360;
		var href = $(this).attr("href");
		// A missing target scrolls to the top of the document rather than throwing.
		var $target = (href == '#') ? $('html') : $(href);
		var position = $target.length ? $target.offset().top : 0;
		$('body,html').animate({ scrollTop: position }, speed, 'swing');
		return false;
	});
});



// DISABLED PAGE RELOAD IF href IS EMPTY
$(function () {
    'use strict';
	$(document).on('click', 'a[href=""]', function (event) {
		event.preventDefault();
	});
});



// CHANGE COLOR OF SVG FILES WITH CLASS
$(function(){
	'use strict';
    $('img.svg').each(function(){
        var $img = $(this);
        var imgID = $img.attr('id');
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('src');
        $.get(imgURL, function(data) {
            // Get the SVG tag, ignore the rest
            var $svg = $(data).find('svg');
            // Add replaced image's ID to the new SVG
            if(typeof imgID !== 'undefined') {
                $svg = $svg.attr('id', imgID);
            }
            // Add replaced image's classes to the new SVG
            if(typeof imgClass !== 'undefined') {
                $svg = $svg.attr('class', imgClass+' replaced-svg');
            }
            // Remove any invalid XML tags as per http://validator.w3.org
            $svg = $svg.removeAttr('xmlns:a');
            // Check if the viewport is set, else we gonna set it if we can.
            if(!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
                $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
            }
            // Replace image with new SVG
            $img.replaceWith($svg);
        }, 'xml');
    });
});



// DISABLED SELECT OPTIONS ARROW IN :after
$(function () {
    'use strict';
	$(".form-control.disabled, .form-control[disabled], .form-control:disabled").parent(".sel").addClass("disabled");
});




// CLOSE ALERTS
$(function () {
    'use strict';
	$(document).on('click', '.alert .close', function () {
        $(this).parent().remove()
	});
});
