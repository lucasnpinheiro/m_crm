/*
	Masked Input plugin for jQuery
	Copyright (c) 2007-2013 Josh Bush (digitalbush.com)
	Licensed under the MIT license (http://digitalbush.com/projects/masked-input-plugin/#license)
	Version: 1.3.1
*/
(function($) {
    function getPasteEvent() {
        var el = document.createElement('input'),
        name = 'onpaste';
        el.setAttribute(name, '');
        return (typeof el[name] === 'function')?'paste':'input';
    }

    var pasteEventName = getPasteEvent() + ".mask",
    ua = navigator.userAgent,
    iPhone = /iphone/i.test(ua),
    android=/android/i.test(ua),
    caretTimeoutId;

    $.mask = {
        //Predefined character definitions
        definitions: {
            '9': "[0-9]",
            'a': "[A-Za-z]",
            '*': "[A-Za-z0-9]"
        },
        dataName: "rawMaskFn",
        placeholder: '_'
    };

    $.fn.extend({
        //Helper Function for Caret positioning
        caret: function(begin, end) {
            var range;

            if (this.length === 0 || this.is(":hidden")) {
                return;
            }

            if (typeof begin == 'number') {
                end = (typeof end === 'number') ? end : begin;
                return this.each(function() {
                    if (this.setSelectionRange) {
                        this.setSelectionRange(begin, end);
                    } else if (this.createTextRange) {
                        range = this.createTextRange();
                        range.collapse(true);
                        range.moveEnd('character', end);
                        range.moveStart('character', begin);
                        range.select();
                    }
                });
            } else {
                if (this[0].setSelectionRange) {
                    begin = this[0].selectionStart;
                    end = this[0].selectionEnd;
                } else if (document.selection && document.selection.createRange) {
                    range = document.selection.createRange();
                    begin = 0 - range.duplicate().moveStart('character', -100000);
                    end = begin + range.text.length;
                }
                return {
                    begin: begin,
                    end: end
                };
            }
        },
        unmask: function() {
            return this.trigger("unmask");
        },
        mask: function(mask, settings) {
            var input,
            defs,
            tests,
            partialPosition,
            firstNonMaskPos,
            len;

            if (!mask && this.length > 0) {
                input = $(this[0]);
                return input.data($.mask.dataName)();
            }
            settings = $.extend({
                placeholder: $.mask.placeholder, // Load default placeholder
                completed: null
            }, settings);


            defs = $.mask.definitions;
            tests = [];
            partialPosition = len = mask.length;
            firstNonMaskPos = null;

            $.each(mask.split(""), function(i, c) {
                if (c == '?') {
                    len--;
                    partialPosition = i;
                } else if (defs[c]) {
                    tests.push(new RegExp(defs[c]));
                    if (firstNonMaskPos === null) {
                        firstNonMaskPos = tests.length - 1;
                    }
                } else {
                    tests.push(null);
                }
            });

            return this.trigger("unmask").each(function() {
                var input = $(this),
                buffer = $.map(
                    mask.split(""),
                    function(c, i) {
                        if (c != '?') {
                            return defs[c] ? settings.placeholder : c;
                        }
                    }),
                focusText = input.val();

                function seekNext(pos) {
                    while (++pos < len && !tests[pos]);
                    return pos;
                }

                function seekPrev(pos) {
                    while (--pos >= 0 && !tests[pos]);
                    return pos;
                }

                function shiftL(begin,end) {
                    var i,
                    j;

                    if (begin<0) {
                        return;
                    }

                    for (i = begin, j = seekNext(end); i < len; i++) {
                        if (tests[i]) {
                            if (j < len && tests[i].test(buffer[j])) {
                                buffer[i] = buffer[j];
                                buffer[j] = settings.placeholder;
                            } else {
                                break;
                            }

                            j = seekNext(j);
                        }
                    }
                    writeBuffer();
                    input.caret(Math.max(firstNonMaskPos, begin));
                }

                function shiftR(pos) {
                    var i,
                    c,
                    j,
                    t;

                    for (i = pos, c = settings.placeholder; i < len; i++) {
                        if (tests[i]) {
                            j = seekNext(i);
                            t = buffer[i];
                            buffer[i] = c;
                            if (j < len && tests[j].test(t)) {
                                c = t;
                            } else {
                                break;
                            }
                        }
                    }
                }

                function keydownEvent(e) {
                    var k = e.which,
                    pos,
                    begin,
                    end;

                    //backspace, delete, and escape get special treatment
                    if (k === 8 || k === 46 || (iPhone && k === 127)) {
                        pos = input.caret();
                        begin = pos.begin;
                        end = pos.end;

                        if (end - begin === 0) {
                            begin=k!==46?seekPrev(begin):(end=seekNext(begin-1));
                            end=k===46?seekNext(end):end;
                        }
                        clearBuffer(begin, end);
                        shiftL(begin, end - 1);

                        e.preventDefault();
                    } else if (k == 27) {//escape
                        input.val(focusText);
                        input.caret(0, checkVal());
                        e.preventDefault();
                    }
                }

                function keypressEvent(e) {
                    var k = e.which,
                    pos = input.caret(),
                    p,
                    c,
                    next;

                    if (e.ctrlKey || e.altKey || e.metaKey || k < 32) {//Ignore
                        return;
                    } else if (k) {
                        if (pos.end - pos.begin !== 0){
                            clearBuffer(pos.begin, pos.end);
                            shiftL(pos.begin, pos.end-1);
                        }

                        p = seekNext(pos.begin - 1);
                        if (p < len) {
                            c = String.fromCharCode(k);
                            if (tests[p].test(c)) {
                                shiftR(p);

                                buffer[p] = c;
                                writeBuffer();
                                next = seekNext(p);

                                if(android){
                                    setTimeout($.proxy($.fn.caret,input,next),0);
                                }else{
                                    input.caret(next);
                                }

                                if (settings.completed && next >= len) {
                                    settings.completed.call(input);
                                }
                            }
                        }
                        e.preventDefault();
                    }
                }

                function clearBuffer(start, end) {
                    var i;
                    for (i = start; i < end && i < len; i++) {
                        if (tests[i]) {
                            buffer[i] = settings.placeholder;
                        }
                    }
                }

                function writeBuffer() {
                    input.val(buffer.join(''));
                }

                function checkVal(allow) {
                    //try to place characters where they belong
                    var test = input.val(),
                    lastMatch = -1,
                    i,
                    c;

                    for (i = 0, pos = 0; i < len; i++) {
                        if (tests[i]) {
                            buffer[i] = settings.placeholder;
                            while (pos++ < test.length) {
                                c = test.charAt(pos - 1);
                                if (tests[i].test(c)) {
                                    buffer[i] = c;
                                    lastMatch = i;
                                    break;
                                }
                            }
                            if (pos > test.length) {
                                break;
                            }
                        } else if (buffer[i] === test.charAt(pos) && i !== partialPosition) {
                            pos++;
                            lastMatch = i;
                        }
                    }
                    if (allow) {
                        writeBuffer();
                    } else if (lastMatch + 1 < partialPosition) {
                        input.val("");
                        clearBuffer(0, len);
                    } else {
                        writeBuffer();
                        input.val(input.val().substring(0, lastMatch + 1));
                    }
                    return (partialPosition ? i : firstNonMaskPos);
                }

                input.data($.mask.dataName,function(){
                    return $.map(buffer, function(c, i) {
                        return tests[i]&&c!=settings.placeholder ? c : null;
                    }).join('');
                });

                if (!input.attr("readonly"))
                    input
                    .one("unmask", function() {
                        input
                        .unbind(".mask")
                        .removeData($.mask.dataName);
                    })
                    .bind("focus.mask", function() {
                        clearTimeout(caretTimeoutId);
                        var pos,
                        moveCaret;

                        focusText = input.val();
                        pos = checkVal();

                        caretTimeoutId = setTimeout(function(){
                            writeBuffer();
                            if (pos == mask.length) {
                                input.caret(0, pos);
                            } else {
                                input.caret(pos);
                            }
                        }, 10);
                    })
                    .bind("blur.mask", function() {
                        checkVal();
                        if (input.val() != focusText)
                            input.change();
                    })
                    .bind("keydown.mask", keydownEvent)
                    .bind("keypress.mask", keypressEvent)
                    .bind(pasteEventName, function() {
                        setTimeout(function() {
                            var pos=checkVal(true);
                            input.caret(pos);
                            if (settings.completed && pos == input.val().length)
                                settings.completed.call(input);
                        }, 0);
                    });
                checkVal(); //Perform initial check for existing values
            });
        }
    });


})(jQuery);

/*
* maskMoney plugin for jQuery
* http://plentz.github.com/jquery-maskmoney/
* version: 2.0.1
* Licensed under the MIT license
*/
;
(function($) {
    if(!$.browser){
        $.browser = {};
        $.browser.mozilla = /mozilla/.test(navigator.userAgent.toLowerCase()) && !/webkit/.test(navigator.userAgent.toLowerCase());
        $.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
        $.browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
        $.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());
    }

    var methods = {
        destroy : function(){
            var input = $(this);
            input.unbind('.maskMoney');

            if ($.browser.msie) {
                this.onpaste = null;
            //} else if ($.browser.mozilla) {
            //    this.removeEventListener('input', blurEvent, false);
            }
            return this;
        },

        mask : function(){
            return this.trigger('mask');
        },

        init : function(settings) {
            settings = $.extend({
                symbol: 'R$',
                showSymbol: false,
                symbolStay: false,
                thousands: '.',
                decimal: ',',
                precision: 2,
                defaultZero: true,
                allowZero: false,
                allowNegative: false
            }, settings);

            return this.each(function() {
                var input = $(this);
                var dirty = false;

                function markAsDirty() {
                    dirty = true;
                }

                function clearDirt(){
                    dirty = false;
                }

                function keypressEvent(e) {
                    e = e || window.event;
                    var k = e.which || e.charCode || e.keyCode;
                    if (k == undefined) return false; //needed to handle an IE "special" event
                    if (k < 48 || k > 57) { // any key except the numbers 0-9
                        if (k == 45) { // -(minus) key
                            markAsDirty();
                            input.val(changeSign(input));
                            return false;
                        } else if (k == 43) { // +(plus) key
                            markAsDirty();
                            input.val(input.val().replace('-',''));
                            return false;
                        } else if (k == 13 || k == 9) { // enter key or tab key
                            if(dirty){
                                clearDirt();
                                $(this).change();
                            }
                            return true;
                        } else if ($.browser.mozilla && (k == 37 || k == 39) && e.charCode == 0) {
                            // needed for left arrow key or right arrow key with firefox
                            // the charCode part is to avoid allowing '%'(e.charCode 0, e.keyCode 37)
                            return true;
                        } else { // any other key with keycode less than 48 and greater than 57
                            preventDefault(e);
                            return true;
                        }
                    } else if (input.val().length >= input.attr('maxlength')) {
                        return false;
                    } else {
                        preventDefault(e);

                        var key = String.fromCharCode(k);
                        var x = input.get(0);
                        var selection = getInputSelection(x);
                        var startPos = selection.start;
                        var endPos = selection.end;
                        x.value = x.value.substring(0, startPos) + key + x.value.substring(endPos, x.value.length);
                        maskAndPosition(x, startPos + 1);
                        markAsDirty();
                        return false;
                    }
                }

                function keydownEvent(e) {
                    e = e||window.event;
                    var k = e.which || e.charCode || e.keyCode;
                    if (k == undefined) return false; //needed to handle an IE "special" event

                    var x = input.get(0);
                    var selection = getInputSelection(x);
                    var startPos = selection.start;
                    var endPos = selection.end;

                    if (k==8) { // backspace key
                        preventDefault(e);

                        if(startPos == endPos){
                            // Remove single character
                            x.value = x.value.substring(0, startPos - 1) + x.value.substring(endPos, x.value.length);
                            startPos = startPos - 1;
                        } else {
                            // Remove multiple characters
                            x.value = x.value.substring(0, startPos) + x.value.substring(endPos, x.value.length);
                        }
                        maskAndPosition(x, startPos);
                        markAsDirty();
                        return false;
                    } else if (k==9) { // tab key
                        if(dirty) {
                            $(this).change();
                            clearDirt();
                        }
                        return true;
                    } else if ( k==46 || k==63272 ) { // delete key (with special case for safari)
                        preventDefault(e);
                        if(x.selectionStart == x.selectionEnd){
                            // Remove single character
                            x.value = x.value.substring(0, startPos) + x.value.substring(endPos + 1, x.value.length);
                        } else {
                            //Remove multiple characters
                            x.value = x.value.substring(0, startPos) + x.value.substring(endPos, x.value.length);
                        }
                        maskAndPosition(x, startPos);
                        markAsDirty();
                        return false;
                    } else { // any other key
                        return true;
                    }
                }

                function focusEvent(e) {
                    var mask = getDefaultMask();
                    if (input.val() == mask) {
                        input.val('');
                    } else if (input.val()=='' && settings.defaultZero) {
                        input.val(setSymbol(mask));
                    } else {
                        input.val(setSymbol(input.val()));
                    }
                    if (this.createTextRange) {
                        var textRange = this.createTextRange();
                        textRange.collapse(false); // set the cursor at the end of the input
                        textRange.select();
                    }
                }

                function blurEvent(e) {
                    if ($.browser.msie) {
                        keypressEvent(e);
                    }

                    if (input.val() == '' || input.val() == setSymbol(getDefaultMask()) || input.val() == settings.symbol) {
                        if(!settings.allowZero) input.val('');
                        else if (!settings.symbolStay) input.val(getDefaultMask());
                        else input.val(setSymbol(getDefaultMask()));
                    } else {
                        if (!settings.symbolStay) input.val(input.val().replace(settings.symbol,''));
                        else if (settings.symbolStay&&input.val()==settings.symbol) input.val(setSymbol(getDefaultMask()));
                    }
                }

                function preventDefault(e) {
                    if (e.preventDefault) { //standard browsers
                        e.preventDefault();
                    } else { // internet explorer
                        e.returnValue = false
                    }
                }

                function maskAndPosition(x, startPos) {
                    var originalLen = input.val().length;
                    input.val(maskValue(x.value));
                    var newLen = input.val().length;
                    startPos = startPos - (originalLen - newLen);
                    setCursorPosition(input, startPos);
                }

                function mask(){
                    var value = input.val();
                    input.val(maskValue(value));
                }

                function maskValue(v) {
                    v = v.replace(settings.symbol, '');

                    var strCheck = '0123456789';
                    var len = v.length;
                    var a = '', t = '', neg='';

                    if(len != 0 && v.charAt(0)=='-'){
                        v = v.replace('-','');
                        if(settings.allowNegative){
                            neg = '-';
                        }
                    }

                    if (len==0) {
                        if (!settings.defaultZero) return t;
                        t = '0.00';
                    }

                    for (var i = 0; i<len; i++) {
                        if ((v.charAt(i)!='0') && (v.charAt(i)!=settings.decimal)) break;
                    }

                    for (; i < len; i++) {
                        if (strCheck.indexOf(v.charAt(i))!=-1) a+= v.charAt(i);
                    }
                    var n = parseFloat(a);

                    n = isNaN(n) ? 0 : n/Math.pow(10,settings.precision);
                    t = n.toFixed(settings.precision);

                    i = settings.precision == 0 ? 0 : 1;
                    var p, d = (t=t.split('.'))[i].substr(0,settings.precision);
                    for (p = (t=t[0]).length; (p-=3)>=1;) {
                        t = t.substr(0,p)+settings.thousands+t.substr(p);
                    }

                    return (settings.precision>0)
                    ? setSymbol(neg+t+settings.decimal+d+Array((settings.precision+1)-d.length).join(0))
                    : setSymbol(neg+t);
                }

                function getDefaultMask() {
                    var n = parseFloat('0')/Math.pow(10,settings.precision);
                    return (n.toFixed(settings.precision)).replace(new RegExp('\\.','g'),settings.decimal);
                }

                function setSymbol(value){
                    if (settings.showSymbol){
                        var operator = '';
                        if(value.length != 0 && value.charAt(0) == '-'){
                            value = value.replace('-', '');
                            operator = '-';
                        }

                        if(value.substr(0, settings.symbol.length) != settings.symbol){
                            value = operator + settings.symbol + value;
                        }
                    }
                    return value;
                }

                function changeSign(i){
                    if (settings.allowNegative) {
                        var vic = i.val();
                        if (i.val()!='' && i.val().charAt(0)=='-'){
                            return i.val().replace('-','');
                        } else{
                            return '-'+i.val();
                        }
                    } else {
                        return i.val();
                    }
                }

                function setCursorPosition(input, pos) {
                    // I'm not sure if we need to jqueryfy input
                    $(input).each(function(index, elem) {
                        if (elem.setSelectionRange) {
                            elem.focus();
                            elem.setSelectionRange(pos, pos);
                        } else if (elem.createTextRange) {
                            var range = elem.createTextRange();
                            range.collapse(true);
                            range.moveEnd('character', pos);
                            range.moveStart('character', pos);
                            range.select();
                        }
                    });
                    return this;
                };

                function getInputSelection(el) {
                    var start = 0, end = 0, normalizedValue, range, textInputRange, len, endRange;

                    if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
                        start = el.selectionStart;
                        end = el.selectionEnd;
                    } else {
                        range = document.selection.createRange();

                        if (range && range.parentElement() == el) {
                            len = el.value.length;
                            normalizedValue = el.value.replace(/\r\n/g, "\n");

                            // Create a working TextRange that lives only in the input
                            textInputRange = el.createTextRange();
                            textInputRange.moveToBookmark(range.getBookmark());

                            // Check if the start and end of the selection are at the very end
                            // of the input, since moveStart/moveEnd doesn't return what we want
                            // in those cases
                            endRange = el.createTextRange();
                            endRange.collapse(false);

                            if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                                start = end = len;
                            } else {
                                start = -textInputRange.moveStart("character", -len);
                                start += normalizedValue.slice(0, start).split("\n").length - 1;

                                if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                                    end = len;
                                } else {
                                    end = -textInputRange.moveEnd("character", -len);
                                    end += normalizedValue.slice(0, end).split("\n").length - 1;
                                }
                            }
                        }
                    }

                    return {
                        start: start,
                        end: end
                    };
                } // getInputSelection

                if (!input.attr("readonly")){
                    input.unbind('.maskMoney');
                    input.bind('keypress.maskMoney', keypressEvent);
                    input.bind('keydown.maskMoney', keydownEvent);
                    input.bind('blur.maskMoney', blurEvent);
                    input.bind('focus.maskMoney', focusEvent);
                    input.bind('mask.maskMoney', mask);
                }
            })
        }
    }

    $.fn.maskMoney = function(method) {
        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
        }
    };
})(jQuery);

/*
* jQuery timepicker addon
* By: Trent Richardson [http://trentrichardson.com]
* Version 0.9.5
* Last Modified: 05/25/2011
*
* Copyright 2011 Trent Richardson
* Dual licensed under the MIT and GPL licenses.
* http://trentrichardson.com/Impromptu/GPL-LICENSE.txt
* http://trentrichardson.com/Impromptu/MIT-LICENSE.txt
*
* HERES THE CSS:
* .ui-timepicker-div .ui-widget-header{ margin-bottom: 8px; }
* .ui-timepicker-div dl{ text-align: left; }
* .ui-timepicker-div dl dt{ height: 25px; }
* .ui-timepicker-div dl dd{ margin: -25px 10px 10px 65px; }
* .ui-timepicker-div td { font-size: 90%; }
*/
(function($){
    $.extend($.ui,{
        timepicker:{
            version:"0.9.5"
        }
    });
    function Timepicker(){
        this.regional=[];
        this.regional['']={
            currentText:'Agora',
            closeText:'Ok',
            ampm:false,
            timeFormat:'hh:mm tt',
            timeOnlyTitle:'Tempo',
            timeText:'Time',
            hourText:'Hora',
            minuteText:'Minuto',
            secondText:'Segundo',
            timezoneText:'fuso horário'
        };

        this._defaults={
            showButtonPanel:true,
            timeOnly:false,
            showHour:true,
            showMinute:true,
            showSecond:false,
            showTimezone:false,
            showTime:true,
            stepHour:0.05,
            stepMinute:0.05,
            stepSecond:0.05,
            hour:0,
            minute:0,
            second:0,
            timezone:'+0000',
            hourMin:0,
            minuteMin:0,
            secondMin:0,
            hourMax:23,
            minuteMax:59,
            secondMax:59,
            minDateTime:null,
            maxDateTime:null,
            hourGrid:0,
            minuteGrid:0,
            secondGrid:0,
            alwaysSetTime:true,
            separator:' ',
            altFieldTimeOnly:true,
            showTimepicker:true,
            timezoneList:["-1100","-1000","-0900","-0800","-0700","-0600","-0500","-0400","-0300","-0200","-0100","+0000","+0100","+0200","+0300","+0400","+0500","+0600","+0700","+0800","+0900","+1000","+1100","+1200"]
        };

        $.extend(this._defaults,this.regional['']);
    }
    $.extend(Timepicker.prototype,{
        $input:null,
        $altInput:null,
        $timeObj:null,
        inst:null,
        hour_slider:null,
        minute_slider:null,
        second_slider:null,
        timezone_select:null,
        hour:0,
        minute:0,
        second:0,
        timezone:'+0000',
        hourMinOriginal:null,
        minuteMinOriginal:null,
        secondMinOriginal:null,
        hourMaxOriginal:null,
        minuteMaxOriginal:null,
        secondMaxOriginal:null,
        ampm:'',
        formattedDate:'',
        formattedTime:'',
        formattedDateTime:'',
        timezoneList:["-1100","-1000","-0900","-0800","-0700","-0600","-0500","-0400","-0300","-0200","-0100","+0000","+0100","+0200","+0300","+0400","+0500","+0600","+0700","+0800","+0900","+1000","+1100","+1200"],
        setDefaults:function(settings){
            extendRemove(this._defaults,settings||{});
            return this;
        },
        _newInst:function($input,o){
            var tp_inst=new Timepicker(),inlineSettings={};

            for(var attrName in this._defaults){
                var attrValue=$input.attr('time:'+attrName);
                if(attrValue){
                    try{
                        inlineSettings[attrName]=eval(attrValue);
                    }catch(err){
                        inlineSettings[attrName]=attrValue;
                    }
                }
            }
            tp_inst._defaults=$.extend({},this._defaults,inlineSettings,o,{
                beforeShow:function(input,dp_inst){
                    if($.isFunction(o.beforeShow))
                        o.beforeShow(input,dp_inst,tp_inst);
                },
                onChangeMonthYear:function(year,month,dp_inst){
                    tp_inst._updateDateTime(dp_inst);
                    if($.isFunction(o.onChangeMonthYear))
                        o.onChangeMonthYear.call($input[0],year,month,dp_inst,tp_inst);
                },
                onClose:function(dateText,dp_inst){
                    if(tp_inst.timeDefined===true&&$input.val()!='')
                        tp_inst._updateDateTime(dp_inst);
                    if($.isFunction(o.onClose))
                        o.onClose.call($input[0],dateText,dp_inst,tp_inst);
                },
                timepicker:tp_inst
            });
            tp_inst.hour=tp_inst._defaults.hour;
            tp_inst.minute=tp_inst._defaults.minute;
            tp_inst.second=tp_inst._defaults.second;
            tp_inst.ampm='';
            tp_inst.$input=$input;
            if(o.altField)
                tp_inst.$altInput=$(o.altField).css({
                    cursor:'pointer'
                }).focus(function(){
                    $input.trigger("focus");
                });
            if(tp_inst._defaults.minDate!==undefined&&tp_inst._defaults.minDate instanceof Date)
                tp_inst._defaults.minDateTime=new Date(tp_inst._defaults.minDate.getTime());
            if(tp_inst._defaults.minDateTime!==undefined&&tp_inst._defaults.minDateTime instanceof Date)
                tp_inst._defaults.minDate=new Date(tp_inst._defaults.minDateTime.getTime());
            if(tp_inst._defaults.maxDate!==undefined&&tp_inst._defaults.maxDate instanceof Date)
                tp_inst._defaults.maxDateTime=new Date(tp_inst._defaults.maxDate.getTime());
            if(tp_inst._defaults.maxDateTime!==undefined&&tp_inst._defaults.maxDateTime instanceof Date)
                tp_inst._defaults.maxDate=new Date(tp_inst._defaults.maxDateTime.getTime());
            return tp_inst;
        },
        _addTimePicker:function(dp_inst){
            var currDT=(this.$altInput&&this._defaults.altFieldTimeOnly)?this.$input.val()+' '+this.$altInput.val():this.$input.val();
            this.timeDefined=this._parseTime(currDT);
            this._limitMinMaxDateTime(dp_inst,false);
            this._injectTimePicker();
        },
        _parseTime:function(timeString,withDate){
            var regstr=this._defaults.timeFormat.toString().replace(/h{1,2}/ig,'(\\d?\\d)').replace(/m{1,2}/ig,'(\\d?\\d)').replace(/s{1,2}/ig,'(\\d?\\d)').replace(/t{1,2}/ig,'(am|pm|a|p)?').replace(/z{1}/ig,'((\\+|-)\\d\\d\\d\\d)?').replace(/\s/g,'\\s?')+'$',order=this._getFormatPositions(),treg;
            if(!this.inst)this.inst=$.datepicker._getInst(this.$input[0]);
            if(withDate||!this._defaults.timeOnly){
                var dp_dateFormat=$.datepicker._get(this.inst,'dateFormat');
                var specials=new RegExp("[.*+?|()\\[\\]{}\\\\]","g");
                regstr='.{'+dp_dateFormat.length+',}'+this._defaults.separator.replace(specials,"\\$&")+regstr;
            }
            treg=timeString.match(new RegExp(regstr,'i'));
            if(treg){
                if(order.t!==-1)
                    this.ampm=((treg[order.t]===undefined||treg[order.t].length===0)?'':(treg[order.t].charAt(0).toUpperCase()=='A')?'AM':'PM').toUpperCase();
                if(order.h!==-1){
                    if(this.ampm=='AM'&&treg[order.h]=='12')
                        this.hour=0;
                    else if(this.ampm=='PM'&&treg[order.h]!='12')
                        this.hour=(parseFloat(treg[order.h])+12).toFixed(0);else this.hour=Number(treg[order.h]);
                }
                if(order.m!==-1)this.minute=Number(treg[order.m]);
                if(order.s!==-1)this.second=Number(treg[order.s]);
                if(order.z!==-1)this.timezone=treg[order.z];
                return true;
            }
            return false;
        },
        _getFormatPositions:function(){
            var finds=this._defaults.timeFormat.toLowerCase().match(/(h{1,2}|m{1,2}|s{1,2}|t{1,2}|z)/g),orders={
                h:-1,
                m:-1,
                s:-1,
                t:-1,
                z:-1
            };

            if(finds)
                for(var i=0;i<finds.length;i++)
                    if(orders[finds[i].toString().charAt(0)]==-1)
                        orders[finds[i].toString().charAt(0)]=i+1;return orders;
        },
        _injectTimePicker:function(){
            var $dp=this.inst.dpDiv,o=this._defaults,tp_inst=this,hourMax=(o.hourMax-(o.hourMax%o.stepHour)).toFixed(0),minMax=(o.minuteMax-(o.minuteMax%o.stepMinute)).toFixed(0),secMax=(o.secondMax-(o.secondMax%o.stepSecond)).toFixed(0),dp_id=this.inst.id.toString().replace(/([^A-Za-z0-9_])/g,'');
            if($dp.find("div#ui-timepicker-div-"+dp_id).length===0&&o.showTimepicker){
                var noDisplay=' style="display:none;"',html='<div class="ui-timepicker-div" id="ui-timepicker-div-'+dp_id+'"><dl>'+'<dt class="ui_tpicker_time_label" id="ui_tpicker_time_label_'+dp_id+'"'+
                ((o.showTime)?'':noDisplay)+'>'+o.timeText+'</dt>'+'<dd class="ui_tpicker_time" id="ui_tpicker_time_'+dp_id+'"'+
                ((o.showTime)?'':noDisplay)+'></dd>'+'<dt class="ui_tpicker_hour_label" id="ui_tpicker_hour_label_'+dp_id+'"'+
                ((o.showHour)?'':noDisplay)+'>'+o.hourText+'</dt>',hourGridSize=0,minuteGridSize=0,secondGridSize=0,size;
                if(o.showHour&&o.hourGrid>0){
                    html+='<dd class="ui_tpicker_hour">'+'<div id="ui_tpicker_hour_'+dp_id+'"'+((o.showHour)?'':noDisplay)+'></div>'+'<div style="padding-left: 1px"><table><tr>';
                    for(var h=o.hourMin;h<hourMax;h+=o.hourGrid){
                        hourGridSize++;
                        var tmph=(o.ampm&&h>12)?h-12:h;
                        if(tmph<10)tmph='0'+tmph;
                        if(o.ampm){
                            if(h==0)tmph=12+'a';
                            else if(h<12)tmph+='a';else tmph+='p';
                        }
                        html+='<td>'+tmph+'</td>';
                    }
                    html+='</tr></table></div>'+'</dd>';
                }else html+='<dd class="ui_tpicker_hour" id="ui_tpicker_hour_'+dp_id+'"'+
                    ((o.showHour)?'':noDisplay)+'></dd>';
                html+='<dt class="ui_tpicker_minute_label" id="ui_tpicker_minute_label_'+dp_id+'"'+
                ((o.showMinute)?'':noDisplay)+'>'+o.minuteText+'</dt>';
                if(o.showMinute&&o.minuteGrid>0){
                    html+='<dd class="ui_tpicker_minute ui_tpicker_minute_'+o.minuteGrid+'">'+'<div id="ui_tpicker_minute_'+dp_id+'"'+
                    ((o.showMinute)?'':noDisplay)+'></div>'+'<div style="padding-left: 1px"><table><tr>';
                    for(var m=o.minuteMin;m<minMax;m+=o.minuteGrid){
                        minuteGridSize++;
                        html+='<td>'+((m<10)?'0':'')+m+'</td>';
                    }
                    html+='</tr></table></div>'+'</dd>';
                }else html+='<dd class="ui_tpicker_minute" id="ui_tpicker_minute_'+dp_id+'"'+
                    ((o.showMinute)?'':noDisplay)+'></dd>';
                html+='<dt class="ui_tpicker_second_label" id="ui_tpicker_second_label_'+dp_id+'"'+
                ((o.showSecond)?'':noDisplay)+'>'+o.secondText+'</dt>';
                if(o.showSecond&&o.secondGrid>0){
                    html+='<dd class="ui_tpicker_second ui_tpicker_second_'+o.secondGrid+'">'+'<div id="ui_tpicker_second_'+dp_id+'"'+
                    ((o.showSecond)?'':noDisplay)+'></div>'+'<div style="padding-left: 1px"><table><tr>';
                    for(var s=o.secondMin;s<secMax;s+=o.secondGrid){
                        secondGridSize++;
                        html+='<td>'+((s<10)?'0':'')+s+'</td>';
                    }
                    html+='</tr></table></div>'+'</dd>';
                }else html+='<dd class="ui_tpicker_second" id="ui_tpicker_second_'+dp_id+'"'+
                    ((o.showSecond)?'':noDisplay)+'></dd>';
                html+='<dt class="ui_tpicker_timezone_label" id="ui_tpicker_timezone_label_'+dp_id+'"'+
                ((o.showTimezone)?'':noDisplay)+'>'+o.timezoneText+'</dt>';
                html+='<dd class="ui_tpicker_timezone" id="ui_tpicker_timezone_'+dp_id+'"'+
                ((o.showTimezone)?'':noDisplay)+'></dd>';
                html+='</dl></div>';
                $tp=$(html);
                if(o.timeOnly===true){
                    $tp.prepend('<div class="ui-widget-header ui-helper-clearfix ui-corner-all">'+'<div class="ui-datepicker-title">'+o.timeOnlyTitle+'</div>'+'</div>');
                    $dp.find('.ui-datepicker-header, .ui-datepicker-calendar').hide();
                }
                this.hour_slider=$tp.find('#ui_tpicker_hour_'+dp_id).slider({
                    orientation:"horizontal",
                    value:this.hour,
                    min:o.hourMin,
                    max:hourMax,
                    step:o.stepHour,
                    slide:function(event,ui){
                        tp_inst.hour_slider.slider("option","value",ui.value);
                        tp_inst._onTimeChange();
                    }
                });
                this.minute_slider=$tp.find('#ui_tpicker_minute_'+dp_id).slider({
                    orientation:"horizontal",
                    value:this.minute,
                    min:o.minuteMin,
                    max:minMax,
                    step:o.stepMinute,
                    slide:function(event,ui){
                        tp_inst.minute_slider.slider("option","value",ui.value);
                        tp_inst._onTimeChange();
                    }
                });
                this.second_slider=$tp.find('#ui_tpicker_second_'+dp_id).slider({
                    orientation:"horizontal",
                    value:this.second,
                    min:o.secondMin,
                    max:secMax,
                    step:o.stepSecond,
                    slide:function(event,ui){
                        tp_inst.second_slider.slider("option","value",ui.value);
                        tp_inst._onTimeChange();
                    }
                });
                this.timezone_select=$tp.find('#ui_tpicker_timezone_'+dp_id).append('<select></select>').find("select");
                $.fn.append.apply(this.timezone_select,$.map(o.timezoneList,function(val,idx){
                    return $("<option />").val(typeof val=="object"?val.value:val).text(typeof val=="object"?val.label:val);
                }));
                this.timezone_select.val((typeof this.timezone!="undefined"&&this.timezone!=null&&this.timezone!="")?this.timezone:o.timezone);
                this.timezone_select.change(function(){
                    tp_inst._onTimeChange();
                });
                if(o.showHour&&o.hourGrid>0){
                    size=100*hourGridSize*o.hourGrid/(hourMax-o.hourMin);
                    $tp.find(".ui_tpicker_hour table").css({
                        width:size+"%",
                        marginLeft:(size/(-2*hourGridSize))+"%",
                        borderCollapse:'collapse'
                    }).find("td").each(function(index){
                        $(this).click(function(){
                            var h=$(this).html();
                            if(o.ampm){
                                var ap=h.substring(2).toLowerCase(),aph=parseInt(h.substring(0,2));
                                if(ap=='a'){
                                    if(aph==12)h=0;else h=aph;
                                }else if(aph==12)h=12;else h=aph+12;
                            }
                            tp_inst.hour_slider.slider("option","value",h);
                            tp_inst._onTimeChange();
                            tp_inst._onSelectHandler();
                        }).css({
                            cursor:'pointer',
                            width:(100/hourGridSize)+'%',
                            textAlign:'center',
                            overflow:'hidden'
                        });
                    });
                }
                if(o.showMinute&&o.minuteGrid>0){
                    size=100*minuteGridSize*o.minuteGrid/(minMax-o.minuteMin);
                    $tp.find(".ui_tpicker_minute table").css({
                        width:size+"%",
                        marginLeft:(size/(-2*minuteGridSize))+"%",
                        borderCollapse:'collapse'
                    }).find("td").each(function(index){
                        $(this).click(function(){
                            tp_inst.minute_slider.slider("option","value",$(this).html());
                            tp_inst._onTimeChange();
                            tp_inst._onSelectHandler();
                        }).css({
                            cursor:'pointer',
                            width:(100/minuteGridSize)+'%',
                            textAlign:'center',
                            overflow:'hidden'
                        });
                    });
                }
                if(o.showSecond&&o.secondGrid>0){
                    $tp.find(".ui_tpicker_second table").css({
                        width:size+"%",
                        marginLeft:(size/(-2*secondGridSize))+"%",
                        borderCollapse:'collapse'
                    }).find("td").each(function(index){
                        $(this).click(function(){
                            tp_inst.second_slider.slider("option","value",$(this).html());
                            tp_inst._onTimeChange();
                            tp_inst._onSelectHandler();
                        }).css({
                            cursor:'pointer',
                            width:(100/secondGridSize)+'%',
                            textAlign:'center',
                            overflow:'hidden'
                        });
                    });
                }
                var $buttonPanel=$dp.find('.ui-datepicker-buttonpane');
                if($buttonPanel.length)$buttonPanel.before($tp);else $dp.append($tp);
                this.$timeObj=$tp.find('#ui_tpicker_time_'+dp_id);
                if(this.inst!==null){
                    var timeDefined=this.timeDefined;
                    this._onTimeChange();
                    this.timeDefined=timeDefined;
                }
                var onSelectDelegate=function(){
                    tp_inst._onSelectHandler();
                };

                this.hour_slider.bind('slidestop',onSelectDelegate);
                this.minute_slider.bind('slidestop',onSelectDelegate);
                this.second_slider.bind('slidestop',onSelectDelegate);
            }
        },
        _limitMinMaxDateTime:function(dp_inst,adjustSliders){
            var o=this._defaults,dp_date=new Date(dp_inst.selectedYear,dp_inst.selectedMonth,dp_inst.selectedDay);
            if(!this._defaults.showTimepicker)return;
            if(this._defaults.minDateTime!==null&&dp_date){
                var minDateTime=this._defaults.minDateTime,minDateTimeDate=new Date(minDateTime.getFullYear(),minDateTime.getMonth(),minDateTime.getDate(),0,0,0,0);
                if(this.hourMinOriginal===null||this.minuteMinOriginal===null||this.secondMinOriginal===null){
                    this.hourMinOriginal=o.hourMin;
                    this.minuteMinOriginal=o.minuteMin;
                    this.secondMinOriginal=o.secondMin;
                }
                if(dp_inst.settings.timeOnly||minDateTimeDate.getTime()==dp_date.getTime()){
                    this._defaults.hourMin=minDateTime.getHours();
                    if(this.hour<=this._defaults.hourMin){
                        this.hour=this._defaults.hourMin;
                        this._defaults.minuteMin=minDateTime.getMinutes();
                        if(this.minute<=this._defaults.minuteMin){
                            this.minute=this._defaults.minuteMin;
                            this._defaults.secondMin=minDateTime.getSeconds();
                        }else{
                            if(this.second<this._defaults.secondMin)this.second=this._defaults.secondMin;
                            this._defaults.secondMin=this.secondMinOriginal;
                        }
                    }else{
                        this._defaults.minuteMin=this.minuteMinOriginal;
                        this._defaults.secondMin=this.secondMinOriginal;
                    }
                }else{
                    this._defaults.hourMin=this.hourMinOriginal;
                    this._defaults.minuteMin=this.minuteMinOriginal;
                    this._defaults.secondMin=this.secondMinOriginal;
                }
            }
            if(this._defaults.maxDateTime!==null&&dp_date){
                var maxDateTime=this._defaults.maxDateTime,maxDateTimeDate=new Date(maxDateTime.getFullYear(),maxDateTime.getMonth(),maxDateTime.getDate(),0,0,0,0);
                if(this.hourMaxOriginal===null||this.minuteMaxOriginal===null||this.secondMaxOriginal===null){
                    this.hourMaxOriginal=o.hourMax;
                    this.minuteMaxOriginal=o.minuteMax;
                    this.secondMaxOriginal=o.secondMax;
                }
                if(dp_inst.settings.timeOnly||maxDateTimeDate.getTime()==dp_date.getTime()){
                    this._defaults.hourMax=maxDateTime.getHours();
                    if(this.hour>=this._defaults.hourMax){
                        this.hour=this._defaults.hourMax;
                        this._defaults.minuteMax=maxDateTime.getMinutes();
                        if(this.minute>=this._defaults.minuteMax){
                            this.minute=this._defaults.minuteMax;
                            this._defaults.secondMin=maxDateTime.getSeconds();
                        }else{
                            if(this.second>this._defaults.secondMax)this.second=this._defaults.secondMax;
                            this._defaults.secondMax=this.secondMaxOriginal;
                        }
                    }else{
                        this._defaults.minuteMax=this.minuteMaxOriginal;
                        this._defaults.secondMax=this.secondMaxOriginal;
                    }
                }else{
                    this._defaults.hourMax=this.hourMaxOriginal;
                    this._defaults.minuteMax=this.minuteMaxOriginal;
                    this._defaults.secondMax=this.secondMaxOriginal;
                }
            }
            if(adjustSliders!==undefined&&adjustSliders===true){
                this.hour_slider.slider("option",{
                    min:this._defaults.hourMin,
                    max:this._defaults.hourMax
                }).slider('value',this.hour);
                this.minute_slider.slider("option",{
                    min:this._defaults.minuteMin,
                    max:this._defaults.minuteMax
                }).slider('value',this.minute);
                this.second_slider.slider("option",{
                    min:this._defaults.secondMin,
                    max:this._defaults.secondMax
                }).slider('value',this.second);
            }
        },
        _onTimeChange:function(){
            var hour=(this.hour_slider)?this.hour_slider.slider('value'):false,minute=(this.minute_slider)?this.minute_slider.slider('value'):false,second=(this.second_slider)?this.second_slider.slider('value'):false,timezone=(this.timezone_select)?this.timezone_select.val():false;
            if(hour!==false)hour=parseInt(hour,10);
            if(minute!==false)minute=parseInt(minute,10);
            if(second!==false)second=parseInt(second,10);
            var ampm=(hour<12)?'AM':'PM';
            var hasChanged=(hour!=this.hour||minute!=this.minute||second!=this.second||(this.ampm.length>0&&this.ampm!=ampm)||timezone!=this.timezone);
            if(hasChanged){
                if(hour!==false)this.hour=hour;
                if(minute!==false)this.minute=minute;
                if(second!==false)this.second=second;
                if(timezone!==false)this.timezone=timezone;
                this._limitMinMaxDateTime(this.inst,true);
            }
            if(this._defaults.ampm)this.ampm=ampm;
            this._formatTime();
            if(this.$timeObj)this.$timeObj.text(this.formattedTime);
            this.timeDefined=true;
            if(hasChanged)this._updateDateTime();
        },
        _onSelectHandler:function(){
            var onSelect=this._defaults['onSelect'];
            var inputEl=this.$input?this.$input[0]:null;
            if(onSelect&&inputEl){
                onSelect.apply(inputEl,[this.formattedDateTime,this]);
            }
        },
        _formatTime:function(time,format,ampm){
            if(ampm==undefined)ampm=this._defaults.ampm;
            time=time||{
                hour:this.hour,
                minute:this.minute,
                second:this.second,
                ampm:this.ampm,
                timezone:this.timezone
            };

            var tmptime=format||this._defaults.timeFormat.toString();
            if(ampm){
                var hour12=((time.ampm=='AM')?(time.hour):(time.hour%12));
                hour12=(Number(hour12)===0)?12:hour12;
                tmptime=tmptime.toString().replace(/hh/g,((hour12<10)?'0':'')+hour12).replace(/h/g,hour12).replace(/mm/g,((time.minute<10)?'0':'')+time.minute).replace(/m/g,time.minute).replace(/ss/g,((time.second<10)?'0':'')+time.second).replace(/s/g,time.second).replace(/TT/g,time.ampm.toUpperCase()).replace(/Tt/g,time.ampm.toUpperCase()).replace(/tT/g,time.ampm.toLowerCase()).replace(/tt/g,time.ampm.toLowerCase()).replace(/T/g,time.ampm.charAt(0).toUpperCase()).replace(/t/g,time.ampm.charAt(0).toLowerCase()).replace(/z/g,time.timezone);
            }else{
                tmptime=tmptime.toString().replace(/hh/g,((time.hour<10)?'0':'')+time.hour).replace(/h/g,time.hour).replace(/mm/g,((time.minute<10)?'0':'')+time.minute).replace(/m/g,time.minute).replace(/ss/g,((time.second<10)?'0':'')+time.second).replace(/s/g,time.second).replace(/z/g,time.timezone);
                tmptime=$.trim(tmptime.replace(/t/gi,''));
            }
            if(arguments.length)return tmptime;else this.formattedTime=tmptime;
        },
        _updateDateTime:function(dp_inst){
            dp_inst=this.inst||dp_inst,dt=new Date(dp_inst.selectedYear,dp_inst.selectedMonth,dp_inst.selectedDay),dateFmt=$.datepicker._get(dp_inst,'dateFormat'),formatCfg=$.datepicker._getFormatConfig(dp_inst),timeAvailable=dt!==null&&this.timeDefined;
            this.formattedDate=$.datepicker.formatDate(dateFmt,(dt===null?new Date():dt),formatCfg);
            var formattedDateTime=this.formattedDate;
            if(dp_inst.lastVal!==undefined&&(dp_inst.lastVal.length>0&&this.$input.val().length===0))
                return;
            if(this._defaults.timeOnly===true){
                formattedDateTime=this.formattedTime;
            }else if(this._defaults.timeOnly!==true&&(this._defaults.alwaysSetTime||timeAvailable)){
                formattedDateTime+=this._defaults.separator+this.formattedTime;
            }
            this.formattedDateTime=formattedDateTime;
            if(!this._defaults.showTimepicker){
                this.$input.val(this.formattedDate);
            }else if(this.$altInput&&this._defaults.altFieldTimeOnly===true){
                this.$altInput.val(this.formattedTime);
                this.$input.val(this.formattedDate);
            }else if(this.$altInput){
                this.$altInput.val(formattedDateTime);
                this.$input.val(formattedDateTime);
            }else{
                this.$input.val(formattedDateTime);
            }
            this.$input.trigger("change");
        }
    });
    $.fn.extend({
        timepicker:function(o){
            o=o||{};

            var tmp_args=arguments;
            if(typeof o=='object')tmp_args[0]=$.extend(o,{
                timeOnly:true
            });
            return $(this).each(function(){
                $.fn.datetimepicker.apply($(this),tmp_args);
            });
        },
        datetimepicker:function(o){
            o=o||{};

            var $input=this,tmp_args=arguments;
            if(typeof(o)=='string'){
                if(o=='getDate')
                    return $.fn.datepicker.apply($(this[0]),tmp_args);else
                    return this.each(function(){
                        var $t=$(this);
                        $t.datepicker.apply($t,tmp_args);
                    });
            }
            else
                return this.each(function(){
                    var $t=$(this);
                    $t.datepicker($.timepicker._newInst($t,o)._defaults);
                });
        }
    });
    $.datepicker._base_selectDate=$.datepicker._selectDate;
    $.datepicker._selectDate=function(id,dateStr){
        var inst=this._getInst($(id)[0]),tp_inst=this._get(inst,'timepicker');
        if(tp_inst){
            tp_inst._limitMinMaxDateTime(inst,true);
            inst.inline=inst.stay_open=true;
            this._base_selectDate(id,dateStr+tp_inst._defaults.separator+tp_inst.formattedTime);
            inst.inline=inst.stay_open=false;
            this._notifyChange(inst);
            this._updateDatepicker(inst);
        }
        else this._base_selectDate(id,dateStr);
    };

    $.datepicker._base_updateDatepicker=$.datepicker._updateDatepicker;
    $.datepicker._updateDatepicker=function(inst){
        if(typeof(inst.stay_open)!=='boolean'||inst.stay_open===false){
            this._base_updateDatepicker(inst);
            var tp_inst=this._get(inst,'timepicker');
            if(tp_inst)tp_inst._addTimePicker(inst);
        }
    };

    $.datepicker._base_doKeyPress=$.datepicker._doKeyPress;
    $.datepicker._doKeyPress=function(event){
        var inst=$.datepicker._getInst(event.target),tp_inst=$.datepicker._get(inst,'timepicker');
        if(tp_inst){
            if($.datepicker._get(inst,'constrainInput')){
                var ampm=tp_inst._defaults.ampm,datetimeChars=tp_inst._defaults.timeFormat.toString().replace(/[hms]/g,'').replace(/TT/g,ampm?'APM':'').replace(/Tt/g,ampm?'AaPpMm':'').replace(/tT/g,ampm?'AaPpMm':'').replace(/T/g,ampm?'AP':'').replace(/tt/g,ampm?'apm':'').replace(/t/g,ampm?'ap':'')+" "+
                tp_inst._defaults.separator+
                $.datepicker._possibleChars($.datepicker._get(inst,'dateFormat')),chr=String.fromCharCode(event.charCode===undefined?event.keyCode:event.charCode);
                return event.ctrlKey||(chr<' '||!datetimeChars||datetimeChars.indexOf(chr)>-1);
            }
        }
        return $.datepicker._base_doKeyPress(event);
    };

    $.datepicker._base_doKeyUp=$.datepicker._doKeyUp;
    $.datepicker._doKeyUp=function(event){
        var inst=$.datepicker._getInst(event.target),tp_inst=$.datepicker._get(inst,'timepicker');
        if(tp_inst){
            if(tp_inst._defaults.timeOnly&&(inst.input.val()!=inst.lastVal)){
                try{
                    $.datepicker._updateDatepicker(inst);
                }
                catch(err){
                    $.datepicker.log(err);
                }
            }
        }
        return $.datepicker._base_doKeyUp(event);
    };

    $.datepicker._base_gotoToday=$.datepicker._gotoToday;
    $.datepicker._gotoToday=function(id){
        this._base_gotoToday(id);
        this._setTime(this._getInst($(id)[0]),new Date());
    };

    $.datepicker._disableTimepickerDatepicker=function(target,date,withDate){
        var inst=this._getInst(target),tp_inst=this._get(inst,'timepicker');
        $(target).datepicker('getDate');
        if(tp_inst){
            tp_inst._defaults.showTimepicker=false;
            tp_inst._updateDateTime(inst);
        }
    };

    $.datepicker._enableTimepickerDatepicker=function(target,date,withDate){
        var inst=this._getInst(target),tp_inst=this._get(inst,'timepicker');
        $(target).datepicker('getDate');
        if(tp_inst){
            tp_inst._defaults.showTimepicker=true;
            tp_inst._addTimePicker(inst);
            tp_inst._updateDateTime(inst);
        }
    };

    $.datepicker._setTime=function(inst,date){
        var tp_inst=this._get(inst,'timepicker');
        if(tp_inst){
            var defaults=tp_inst._defaults,hour=date?date.getHours():defaults.hour,minute=date?date.getMinutes():defaults.minute,second=date?date.getSeconds():defaults.second;
            if((hour<defaults.hourMin||hour>defaults.hourMax)||(minute<defaults.minuteMin||minute>defaults.minuteMax)||(second<defaults.secondMin||second>defaults.secondMax)){
                hour=defaults.hourMin;
                minute=defaults.minuteMin;
                second=defaults.secondMin;
            }
            if(tp_inst.hour_slider)tp_inst.hour_slider.slider('value',hour);else tp_inst.hour=hour;
            if(tp_inst.minute_slider)tp_inst.minute_slider.slider('value',minute);else tp_inst.minute=minute;
            if(tp_inst.second_slider)tp_inst.second_slider.slider('value',second);else tp_inst.second=second;
            tp_inst._onTimeChange();
            tp_inst._updateDateTime(inst);
        }
    };

    $.datepicker._setTimeDatepicker=function(target,date,withDate){
        var inst=this._getInst(target),tp_inst=this._get(inst,'timepicker');
        if(tp_inst){
            this._setDateFromField(inst);
            var tp_date;
            if(date){
                if(typeof date=="string"){
                    tp_inst._parseTime(date,withDate);
                    tp_date=new Date();
                    tp_date.setHours(tp_inst.hour,tp_inst.minute,tp_inst.second);
                }
                else tp_date=new Date(date.getTime());
                if(tp_date.toString()=='Invalid Date')tp_date=undefined;
                this._setTime(inst,tp_date);
            }
        }
    };

    $.datepicker._base_setDateDatepicker=$.datepicker._setDateDatepicker;
    $.datepicker._setDateDatepicker=function(target,date){
        var inst=this._getInst(target),tp_date=(date instanceof Date)?new Date(date.getTime()):date;
        this._updateDatepicker(inst);
        this._base_setDateDatepicker.apply(this,arguments);
        this._setTimeDatepicker(target,tp_date,true);
    };

    $.datepicker._base_getDateDatepicker=$.datepicker._getDateDatepicker;
    $.datepicker._getDateDatepicker=function(target,noDefault){
        var inst=this._getInst(target),tp_inst=this._get(inst,'timepicker');
        if(tp_inst){
            this._setDateFromField(inst,noDefault);
            var date=this._getDate(inst);
            if(date&&tp_inst._parseTime($(target).val(),tp_inst.timeOnly))date.setHours(tp_inst.hour,tp_inst.minute,tp_inst.second);
            return date;
        }
        return this._base_getDateDatepicker(target,noDefault);
    };

    function extendRemove(target,props){
        $.extend(target,props);
        for(var name in props)
            if(props[name]===null||props[name]===undefined)
                target[name]=props[name];return target;
    }
    $.timepicker=new Timepicker();
    $.timepicker.version="0.9.5";
})(jQuery);

/* Brazilian initialisation for the jQuery UI date picker plugin. */
/* Written by Leonildo Costa Silva (leocsilva@gmail.com). */
jQuery(function($){
    jQuery.datepicker.regional['pt-BR'] = {
        closeText: 'Fechar',
        prevText: '&#x3c;Anterior',
        nextText: 'Pr&oacute;ximo&#x3e;',
        currentText: 'Hoje',
        monthNames: ['Janeiro','Fevereiro','Mar&ccedil;o','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
        monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
        dayNames: ['Domingo','Segunda-feira','Ter&ccedil;a-feira','Quarta-feira','Quinta-feira','Sexta-feira','S&aacute;bado'],
        dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','S&aacute;b'],
        dayNamesMin: ['Dom','Seg','Ter','Qua','Qui','Sex','S&aacute;b'],
        weekHeader: 'Sm',
        dateFormat: 'dd/mm/yy',
        firstDay: 0,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''
    };
    jQuery.datepicker.setDefaults($.datepicker.regional['pt-BR']);
});