$(function () {
    'use strict';

    // INTERACTIVE FORM ELEMENTS
    $(document).on('focus', '.interactive-forms .floating-inputs .form-control', function () {
        $(this).parent().addClass('focused');
    });
    $(document).on('blur', '.interactive-forms .floating-inputs .form-control', function () {
        $(this).parent().removeClass('focused');
    });
    $(window).on('load', function () {
        let input = $('.interactive-forms .floating-inputs .form-control');
        $(input).parent().find('span').map((index, temp) => {
            $(temp).addClass('active');
        });
        $(input).parent().find('label').map((index, temp) => {
            $(temp).addClass('float');
        });
    });
    $(document).on('input', '.interactive-forms .floating-inputs .form-control', function () {
        let text = this.value;
        if (text.length > 0) {
            $(this).parent().addClass('focused');
            if ($(this).parent().hasClass('focused')) {
                $(this).parent().find('span').map((index, temp) => {
                    $(temp).addClass('active');
                })
                $(this).parent().find('label').map((index, temp) => {
                    $(temp).addClass('float');
                })
            }
        } else {
            if ($(this).parent().hasClass('focused')) {
                $(this).parent().find('span').map((index, temp) => {
                    $(temp).removeClass('active');
                })
                $(this).parent().find('label').map((index, temp) => {
                    $(temp).removeClass('float');
                })
                $(this).removeClass('focused');
            }
        }
    });
    $(document).on('click', '.interactive-forms .show_password', function () {
        if ($(this).is(':checked')) {
            $('input[type=password]').addClass('password-visible').attr({ 'type': 'text' });
        }
        if ($(this).is(':not(:checked)')) {
            $('.password-visible').attr({ 'type': 'password' }).removeClass('password-visible');
        }
    });

    $('.login-form input[type="text"], .login-form input[type="password"], .login-form textarea').on('focus', function () {
        $(this).removeClass('input-error');
    });

    $('.login-form').on('submit', function (e) {
        $(this).find('input[type="text"], input[type="password"], textarea').each(function () {
            if ($(this).val() == "") {
                e.preventDefault();
                $(this).addClass('input-error');
            }
            else {
                $(this).removeClass('input-error');
            }
        });

    });
    // Custom JS of Select Start//
    $(document).mousedown(function (e) {
        var container = $('.selecter-list');
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            $(container).fadeOut("3000");
        };
    });
    $(document).on('click', '.selecter-item', function () {
        $(this).parent().find('.selecter-list').fadeTo('3000', '1')
    });
    $(document).on("mousedown", '.selecter-list li', function () {
        $(this).parent().fadeOut("3000");
        var list_text = $(this).html()
        $(this).closest(".selecter").find('.selecter-item li').html(list_text);
        $(this).closest(".selecter").find('.selecter-item').addClass("active");
    });
    // Custom JS of Select End//

    /////////// Function for with steps form starts here ///////////
    var forms = {};
    $('.with_steps form').map((index, elem) => {
        forms[$(elem).attr('id')] = {};
        forms[$(elem).attr('id')].id = $(elem).attr('id');
        forms[$(elem).attr('id')].step = 0;
        forms[$(elem).attr('id')].max_step = $(elem).attr('max-step');
    });

    $(document).on('click', '.with_steps .form .steps li', function (event) {
        event.preventDefault();
        var formID = $(this).closest("form").eq(0).attr('id');
        $('#' + formID + ' .form .steps li').removeClass('current');
        $(this).addClass('current');
        refreshLiList(this);
    });

    function refreshLiList(element) {
        var formID = $(element).closest("form").eq(0).attr('id');
        $('#' + formID + ' .form_data > div').removeClass('show');
        var element = $(element).attr('id').split('-')[0];
        $('#' + element).addClass('show');
    }

    $(document).on('click', '#next', function (event) {
        event.preventDefault();
        var formID = $(this).closest("form").eq(0).attr('id');
        forms[formID].step += 1;
        $('#' + formID + ' #back').removeClass('hide');
        $(this).addClass('show');
        $('#' + formID + ' .steps li.current')
            .removeClass('current')
            .addClass('checked')
            .next()
            .addClass('current');

        refreshLiList($("#" + formID + " .steps li.current"));
        if (forms[formID].step == forms[formID].max_step) {
            $(this).removeClass('show').addClass('hide');
            $('#' + formID + ' #submit').removeClass('hide');
        }
    });

    $(document).on('click', '#back', function (event) {
        event.preventDefault();
        var formID = $(this).closest("form").eq(0).attr('id');
        forms[formID].step -= 1;
        $('#' + formID + ' .steps li.current')
            .removeClass('current')
            .prev()
            .removeClass('checked')
            .addClass('current');

        refreshLiList($('#' + formID + ' .steps li.current'));
        if (forms[formID].step == 0) {
            $('#' + formID + ' .form_btns button').addClass('hide');
        }

        if ($('#next').hasClass('hide')) {
            $('#next').removeClass('hide').addClass('show');
            $('#' + formID + ' #submit').addClass('hide');
        }
    });

    $(document).on('click', '#submit', function (event) {
        event.preventDefault();
        event.stopPropagation();
        var formID = $(this).closest("form").eq(0).attr('id');
        setTimeout(() => {
            $('#' + formID + ' .steps li').removeClass('current').addClass('checked');

            setTimeout(() => {
                $('#' + formID + ' .form_data').animate({
                    'bottom': '-1000px',
                    'opacity': '0'
                });
            }, 2000);

            setTimeout(() => {
                Reset(formID);
                $('#' + formID + ' .form_data').animate({
                    'bottom': '0',
                    'opacity': '1'
                });
                $('.loader').addClass('hide');
                $('#' + formID + ' #submit, .steps').removeClass('disabled');
            }, 2000);
            $('#' + formID + ' .note').addClass('hide');
            $('#' + formID + ' .msgs').removeClass('hide');
        }, 2000);
        $('.loader').removeClass('hide');
        $('#' + formID + ' .note').removeClass('hide');
        $('#' + formID + ' #submit, .steps').addClass('disabled');
        $('#' + formID + ' #back').addClass('hide');
    })

    function Reset(formID) {
        $('#' + formID).trigger('reset');
        $('#' + formID + ' #next').removeClass('hide').addClass('show');
        $('#' + formID + ' #submit').addClass('hide');
        $('#' + formID + ' .steps li.checked').removeClass('checked').eq(0).addClass('current').trigger('click');
        forms[formID].step = 0;
    }

    /////////// Function for with steps form ends here ///////////

    // CUSTOM QUANTITY INPUT NUMBERS
    $('.quantity').each(function () {
        var spinner = jQuery(this),
            input = spinner.find('input[type="text"]'),
            btnUp = spinner.find('.quantity-up'),
            btnDown = spinner.find('.quantity-down'),
            min = input.attr('min'),
            max = input.attr('max');
        btnUp.click(function () {
            var oldValue = parseFloat(input.val());
            if (oldValue >= max) {
                var newVal = oldValue;
            } else {
                var newVal = oldValue + 1;
            }
            spinner.find("input").val(newVal);
            spinner.find("input").trigger("change");
        });
        btnDown.click(function () {
            var oldValue = parseFloat(input.val());
            if (oldValue <= min) {
                var newVal = oldValue;
            } else {
                var newVal = oldValue - 1;
            }
            spinner.find("input").val(newVal);
            spinner.find("input").trigger("change");
        });
    });

    // NOTE input max validation js

    $(document).on("focus",".max-validation input",function(){
        var max_val = $(this).attr("maxlength");
        var current_val_leng = $(this).val().length;
        if(current_val_leng < max_val){
            $(this).closest(".max-validation").append("<span style='width: fit-content;margin: auto;' class='badge bg-green min'>"+current_val_leng+ "/" +max_val+"</span>");
        }
        else{
            $(this).closest(".max-validation").append("<span style='width: fit-content;margin: auto;' class='badge bg-red max'>"+current_val_leng+ "/" +max_val+"</span>");
        }
    })
    $(document).on("blur",".max-validation input",function(){
        $(this).closest(".max-validation").find("span.max ,span.min").remove();
    })
    $(document).on('keyup',".max-validation input",function(){
        var max_val = $(this).attr("maxlength");
        var value = $(this).val();
        var current_val_leng = $(this).val().length;
        var remove_span = $(this).closest(".max-validation").find("span.max ,span.min").remove();
        if(current_val_leng >= max_val){
            remove_span;
            $(this).closest(".max-validation").append("<span style='width: fit-content;margin: auto;' class='badge bg-red max'>"+current_val_leng+ "/" +max_val+"</span>");
            if(current_val_leng != max_val){
                $(this).closest(".max-validation").find("span.max ,span.min").remove();
                var total_leng_remove = current_val_leng - max_val;
                $(this).closest(".max-validation").append("<span style='width: fit-content;margin: auto;' class='badge bg-red max'>"+eval(current_val_leng -total_leng_remove)+ "/" +max_val+"</span>");
                $(this).val(value.substring(0, value.length - total_leng_remove));
            }
        }
        else{
            remove_span;
            $(this).closest(".max-validation").append("<span style='width: fit-content;margin: auto;' class='badge bg-green min'>"+current_val_leng+ "/" +max_val+"</span>");
        }
    })
});