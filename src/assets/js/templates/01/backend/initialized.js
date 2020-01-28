// BACKGROUND CHANGING
$(function () {
    'use strict';
	
    $('.bg-slideshow').backstretch([
        "../img/backgrounds/1.jpg",
        "../img/backgrounds/2.jpg",
        "../img/backgrounds/3.jpg"
        ], {duration: 3000, fade: 750}
    );
    
});

// INITIATED SLIMSCROLLBAR
$(function () {
    'use strict';
    
    $('.sidebar-menu').slimScroll({
        height: $(window).height() + 'px',
        size: '5px'
    });

});

// SELET ALL CHECKBOXES
function doChkAll() {
    if ($('#chkAll').is(':checked')) {
        $('.chkStockID').prop('checked', true);
    } else {
        $('.chkStockID').prop('checked', false);
    }
}


$(function () {
    'use strict';
    
    $('.login-form input[type="text"], .login-form input[type="password"], .login-form textarea').on('focus', function() {
    	$(this).removeClass('input-error');
    });
    $('.login-form').on('submit', function(e) {
    	$(this).find('input[type="text"], input[type="password"], textarea').each(function(){
    		if( $(this).val() == "" ) {
    			e.preventDefault();
    			$(this).addClass('input-error');
    		}
    		else {
    			$(this).removeClass('input-error');
    		}
    	});
    });

});
