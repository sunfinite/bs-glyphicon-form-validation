$(document).ready(function() {
    function validateForm(formObj) {
        var n_fields = formObj.find('input');
        var invalid = formObj.find('.validity[valid=false]');
        var valid = formObj.find('.validity[valid=true]');
        if (n_fields.length > 0 && valid.length == 0 && invalid.length == 0) {
            return false;
        }
        if (invalid.length > 0) {
            $(invalid[0]).prev().focus();
            return false;
        }
        return true;
    }

    function getWrapperObjects(obj) {
        parentObj = obj.parent();
        if (!parentObj.hasClass('input-group'))
            parentObj = obj.wrap('<div class="input-group"></div>').parent();
        spanObj = parentObj.find('span.validity');
        if (spanObj.length == 0)
            spanObj = parentObj.append('<span class="validity input-group-addon"></span>').find('span.validity');
        helpObj = parentObj.nextAll('.help-block:first');
        if (helpObj.length == 0)
            helpObj = parentObj.after('<span class="help-block" message=" "></span>').next('span.help-block');
    }

    function fail(obj, failMsg) {
        getWrapperObjects(obj);
        spanObj.attr('valid', 'false');
        spanObj.empty();
        // FIXME: Can't set class in the same spanObj because of rendering issues in chrome
        spanObj.append('<span class="glyphicon glyphicon-exclamation-sign"></span>');
        if(!helpObj.attr('message'))
          helpObj.attr('message', helpObj.html());
        helpObj.css('color', '#FF3300');
        helpObj.html(failMsg);
    }

    function success(obj) {
        getWrapperObjects(obj);
        spanObj.attr('valid', 'true');
        spanObj.empty();
        spanObj.append('<span class="glyphicon glyphicon-ok-sign"></span>');
        helpObj.css('color', '');
        var message = '';
        if(message = helpObj.attr('message')) 
          helpObj.html(message);
    }

    function validateIP(str) {
        regEx = /^\d{1,3}$/;
        groups = str.split('.');
        if(groups.length != 4) {
            return false;
        }
        for(var i = 0; i < groups.length; i++) {
            if(!groups[i].match(regEx)) {
                return false;
            }
            if(groups[i] < 0 || groups[i] > 255) {
                return false;
            }
        } 
        return true;
    } 
        
    function validateIPField(obj) {
        var ips = obj.val().split(/ *, */);
        for(var i = 0;i < ips.length; i++) {
            var ip = $.trim(ips[i]);
            if (ips.lastIndexOf(ip) != i) {
                fail(obj, ip + ' is duplicated');
                return;
            }
            if (!validateIP(ip)) {
                var msg = 'Invalid IPv4 address: ' + ip;
                fail(obj, msg);
                return;
            }
        }
        success(obj);
    } 

    function validateEmail(email) {
        regEx = /^[\w\d\_\-\.]+\@[\w\d\_\-\.]+\.\w{2,4}$/;
        return email.match(regEx);
    }

    function validateEmailField(obj) {
        var emails = obj.val().split(/ *, */);
        for(i = 0; i < emails.length; i++) {
            var email = emails[i].trim();
            if (emails.lastIndexOf(email) != i) {
                fail(obj, email + ' is duplicated');
                return;
            }
            if(!validateEmail(email)) {
                var msg = 'Invalid email address: ' + email;
                fail(obj, msg);
                return;
            }
        }
        success(obj);
    } 

    function validateIntField(obj) {
        var regEx = /^[\d ,]+$/;
        var value = obj.val();
        
        if(!value.match(regEx) || value <= 0) {
            fail(obj, 'Invalid positive integer');
            return;
        }
        success(obj);
    } 

    function validateTextField(obj) {
        var regEx = /^[\w ,-.]+$/;
        var value = obj.val();
        
        if(!value.match(regEx) || value <= 0) {
            fail(obj, 'Invalid word');
            return;
        }
        success(obj);
    }

    function trim(obj) {
        obj.val($.trim(obj.val()));
        if(!obj.val()) {
            if(obj.next('span.validity').length) {
                getWrapperObjects(obj);
                helpObj.css('color', '');
                helpObj.html(helpObj.attr('message'));
                spanObj.remove();
                obj.unwrap();
            }
            return false; 
        }

        else if (obj.val() === obj.attr('default')) {
            success(obj);
            return false;   
        }
        
        return true;
    }

    function validate(obj) {
        if (obj.hasClass('ip'))
            validateIPField(obj);
        else if (obj.hasClass('email'))
            validateEmailField(obj);
        else if (obj.hasClass('text'))
            validateTextField(obj);
        else if (obj.hasClass('int'))
            validateIntField(obj);
    }
            
    $('form input').blur(function() { var obj = $(this); if (trim(obj)) validate(obj) });
    $('form input').keypress(function(e) { if (e.which == 13) { var obj = $(this); if(trim(obj)) validate(obj); return validateForm(obj.closest('form')) }});
    $('form').submit(function() { return validateForm($(this)); });
});
