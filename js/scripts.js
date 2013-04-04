var _constant = {
    version: "1.00.00",
    maxPaginacao: 10,
    titles: {
        aviso: 'CRM Mobile informa:',
        erro: 'CRM Mobile informa erros localizados:'
    },
    redirect: function(url) {
        window.location.href = url;
    }
};

/*!
 * jQuery Cookie Plugin v1.3.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function(factory) {
    if (typeof define === 'function' && define.amd) {
// AMD. Register as anonymous module.
        define(['jquery'], factory);
    } else {
// Browser globals.
        factory(jQuery);
    }
}(function($) {

    var pluses = /\+/g;
    function raw(s) {
        return s;
    }

    function decoded(s) {
        return decodeURIComponent(s.replace(pluses, ' '));
    }

    function converted(s) {
        if (s.indexOf('"') === 0) {
// This is a quoted cookie as according to RFC2068, unescape
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }
        try {
            return config.json ? JSON.parse(s) : s;
        } catch (er) {
        }
    }

    var config = $.cookie = function(key, value, options) {

// write
        if (value !== undefined) {
            options = $.extend({}, config.defaults, options);
            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = config.json ? JSON.stringify(value) : String(value);
            return (document.cookie = [
                config.raw ? key : encodeURIComponent(key),
                '=',
                config.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''));
        }

// read
        var decode = config.raw ? raw : decoded;
        var cookies = document.cookie.split('; ');
        var result = key ? undefined : {};
        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = decode(parts.join('='));
            if (key && key === name) {
                result = converted(cookie);
                break;
            }

            if (!key) {
                result[name] = converted(cookie);
            }
        }

        return result;
    };
    config.defaults = {};
    $.removeCookie = function(key, options) {
        if ($.cookie(key) !== undefined) {
            $.cookie(key, '', $.extend(options, {
                expires: -1
            }));
            return true;
        }
        return false;
    };
}));
/**
 * _session
 *
 * Init time Branching ou Ramificação em tempo de inicialização
 *
 **/

/**
 Definição de meu Objeto Literal com seus atributos "get" e "set"
 por enquanto sem nenhum ação.
 **/
var _session = {
    get: function(key) {
// Checa pela presença do localStorage para armazenagem de dados
        if (typeof localStorage === 'object') {
            return localStorage.getItem(key);
        } else {
            return $.cookie(key);
        }
    },
    set: function(key, value) {
// Checa pela presença do localStorage para armazenagem de dados
        if (typeof localStorage === 'object') {
            localStorage.setItem(key, value);
        } else {
            var d = new Date();
            d.setDate(exdate.getDate() + 1);
            $.cookie(key, value, {
                expires: d.toUTCString()
            });
        }
    },
    remove: function(key) {
        if (typeof localStorage === 'object') {
            localStorage.removeItem(key);
        } else {
            $.removeCookie(key)
        }
    }
};
//
// Use internal $.serializeArray to get list of form elements which is
// consistent with $.serialize
//
// From version 2.0.0, $.serializeObject will stop converting [name] values
// to camelCase format. This is *consistent* with other serialize methods:
//
//   - $.serialize
//   - $.serializeArray
//
// If you require camel casing, you can either download version 1.0.4 or map
// them yourself.
//
$.fn.serializeObject = function() {
    "use strict";
    var result = {};
    var extend = function(i, element) {
        var node = result[element.name];
        // If node with same name exists already, need to convert it to an array as it
        // is a multi-value field (i.e., checkboxes)

        if ('undefined' !== typeof node && node !== null) {
            if ($.isArray(node)) {
                node.push(element.value);
            } else {
                result[element.name] = [node, element.value];
            }
        } else {
            result[element.name] = element.value;
        }
    };
    // For each serialzable element, convert element names to camelCasing and
    // extend each of them to a JSON object

    $.each(this.serializeArray(), extend);
    return result;
};
function date(format, timestamp) {
    timestamp = !timestamp ? (new Date()).getTime() / 1000 : timestamp;
    // http://kevin.vanzonneveld.net
    // +   original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
    // +      parts by: Peter-Paul Koch (http://www.quirksmode.org/js/beat.html)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: MeEtc (http://yass.meetcweb.com)
    // +   improved by: Brad Touesnard
    // +   improved by: Tim Wiel
    // +   improved by: Bryan Elliott
    //
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   improved by: David Randall
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   improved by: Theriault
    // +  derived from: gettimeofday
    // +      input by: majak
    // +   bugfixed by: majak
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Alex
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +   improved by: Theriault
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   improved by: Theriault
    // +   improved by: Thomas Beaucourt (http://www.webapp.fr)
    // +   improved by: JT
    // +   improved by: Theriault
    // +   improved by: Rafał Kukawski (http://blog.kukawski.pl)
    // +   bugfixed by: omid (http://phpjs.org/functions/380:380#comment_137122)
    // +      input by: Martin
    // +      input by: Alex Wilson
    // +   bugfixed by: Chris (http://www.devotis.nl/)
    // %        note 1: Uses global: php_js to store the default timezone
    // %        note 2: Although the function potentially allows timezone info (see notes), it currently does not set
    // %        note 2: per a timezone specified by date_default_timezone_set(). Implementers might use
    // %        note 2: this.php_js.currentTimezoneOffset and this.php_js.currentTimezoneDST set by that function
    // %        note 2: in order to adjust the dates in this function (or our other date functions!) accordingly
    // *     example 1: date('H:m:s \\m \\i\\s \\m\\o\\n\\t\\h', 1062402400);
    // *     returns 1: '09:09:40 m is month'
    // *     example 2: date('F j, Y, g:i a', 1062462400);
    // *     returns 2: 'September 2, 2003, 2:26 am'
    // *     example 3: date('Y W o', 1062462400);
    // *     returns 3: '2003 36 2003'
    // *     example 4: x = date('Y m d', (new Date()).getTime()/1000);
    // *     example 4: (x+'').length == 10 // 2009 01 09
    // *     returns 4: true
    // *     example 5: date('W', 1104534000);
    // *     returns 5: '53'
    // *     example 6: date('B t', 1104534000);
    // *     returns 6: '999 31'
    // *     example 7: date('W U', 1293750000.82); // 2010-12-31
    // *     returns 7: '52 1293750000'
    // *     example 8: date('W', 1293836400); // 2011-01-01
    // *     returns 8: '52'
    // *     example 9: date('W Y-m-d', 1293974054); // 2011-01-02
    // *     returns 9: '52 2011-01-02'
    var that = this,
            jsdate,
            f,
            formatChr = /\\?([a-z])/gi,
            formatChrCb,
            // Keep this here (works, but for code commented-out
            // below for file size reasons)
            //, tal= [],
            _pad = function(n, c) {
        n = n.toString();
        return n.length < c ? _pad('0' + n, c, '0') : n;
    },
            txt_words = ["Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    formatChrCb = function(t, s) {
        return f[t] ? f[t]() : s;
    };
    f = {
        // Day
        d: function() { // Day of month w/leading 0; 01..31
            return _pad(f.j(), 2);
        },
        D: function() { // Shorthand day name; Mon...Sun
            return f.l().slice(0, 3);
        },
        j: function() { // Day of month; 1..31
            return jsdate.getDate();
        },
        l: function() { // Full day name; Monday...Sunday
            return txt_words[f.w()] + 'day';
        },
        N: function() { // ISO-8601 day of week; 1[Mon]..7[Sun]
            return f.w() || 7;
        },
        S: function() { // Ordinal suffix for day of month; st, nd, rd, th
            var j = f.j()
            i = j % 10;
            if (i <= 3 && parseInt((j % 100) / 10) == 1)
                i = 0;
            return ['st', 'nd', 'rd'][i - 1] || 'th';
        },
        w: function() { // Day of week; 0[Sun]..6[Sat]
            return jsdate.getDay();
        },
        z: function() { // Day of year; 0..365
            var a = new Date(f.Y(), f.n() - 1, f.j()),
                    b = new Date(f.Y(), 0, 1);
            return Math.round((a - b) / 864e5);
        },
        // Week
        W: function() { // ISO-8601 week number
            var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3),
                    b = new Date(a.getFullYear(), 0, 4);
            return _pad(1 + Math.round((a - b) / 864e5 / 7), 2);
        },
        // Month
        F: function() { // Full month name; January...December
            return txt_words[6 + f.n()];
        },
        m: function() { // Month w/leading 0; 01...12
            return _pad(f.n(), 2);
        },
        M: function() { // Shorthand month name; Jan...Dec
            return f.F().slice(0, 3);
        },
        n: function() { // Month; 1...12
            return jsdate.getMonth() + 1;
        },
        t: function() { // Days in month; 28...31
            return (new Date(f.Y(), f.n(), 0)).getDate();
        },
        // Year
        L: function() { // Is leap year?; 0 or 1
            var j = f.Y();
            return j % 4 === 0 & j % 100 !== 0 | j % 400 === 0;
        },
        o: function() { // ISO-8601 year
            var n = f.n(),
                    W = f.W(),
                    Y = f.Y();
            return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0);
        },
        Y: function() { // Full year; e.g. 1980...2010
            return jsdate.getFullYear();
        },
        y: function() { // Last two digits of year; 00...99
            return f.Y().toString().slice(-2);
        },
        // Time
        a: function() { // am or pm
            return jsdate.getHours() > 11 ? "pm" : "am";
        },
        A: function() { // AM or PM
            return f.a().toUpperCase();
        },
        B: function() { // Swatch Internet time; 000..999
            var H = jsdate.getUTCHours() * 36e2,
                    // Hours
                    i = jsdate.getUTCMinutes() * 60,
                    // Minutes
                    s = jsdate.getUTCSeconds(); // Seconds
            return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3);
        },
        g: function() { // 12-Hours; 1..12
            return f.G() % 12 || 12;
        },
        G: function() { // 24-Hours; 0..23
            return jsdate.getHours();
        },
        h: function() { // 12-Hours w/leading 0; 01..12
            return _pad(f.g(), 2);
        },
        H: function() { // 24-Hours w/leading 0; 00..23
            return _pad(f.G(), 2);
        },
        i: function() { // Minutes w/leading 0; 00..59
            return _pad(jsdate.getMinutes(), 2);
        },
        s: function() { // Seconds w/leading 0; 00..59
            return _pad(jsdate.getSeconds(), 2);
        },
        u: function() { // Microseconds; 000000-999000
            return _pad(jsdate.getMilliseconds() * 1000, 6);
        },
        // Timezone
        e: function() { // Timezone identifier; e.g. Atlantic/Azores, ...
            // The following works, but requires inclusion of the very large
            // timezone_abbreviations_list() function.
            /*              return that.date_default_timezone_get();
             */
            throw 'Not supported (see source code of date() for timezone on how to add support)';
        },
        I: function() { // DST observed?; 0 or 1
            // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
            // If they are not equal, then DST is observed.
            var a = new Date(f.Y(), 0),
                    // Jan 1
                    c = Date.UTC(f.Y(), 0),
                    // Jan 1 UTC
                    b = new Date(f.Y(), 6),
                    // Jul 1
                    d = Date.UTC(f.Y(), 6); // Jul 1 UTC
            return ((a - c) !== (b - d)) ? 1 : 0;
        },
        O: function() { // Difference to GMT in hour format; e.g. +0200
            var tzo = jsdate.getTimezoneOffset(),
                    a = Math.abs(tzo);
            return (tzo > 0 ? "-" : "+") + _pad(Math.floor(a / 60) * 100 + a % 60, 4);
        },
        P: function() { // Difference to GMT w/colon; e.g. +02:00
            var O = f.O();
            return (O.substr(0, 3) + ":" + O.substr(3, 2));
        },
        T: function() { // Timezone abbreviation; e.g. EST, MDT, ...
            // The following works, but requires inclusion of the very
            // large timezone_abbreviations_list() function.
            /*              var abbr = '', i = 0, os = 0, default = 0;
             if (!tal.length) {
             tal = that.timezone_abbreviations_list();
             }
             if (that.php_js && that.php_js.default_timezone) {
             default = that.php_js.default_timezone;
             for (abbr in tal) {
             for (i=0; i < tal[abbr].length; i++) {
             if (tal[abbr][i].timezone_id === default) {
             return abbr.toUpperCase();
             }
             }
             }
             }
             for (abbr in tal) {
             for (i = 0; i < tal[abbr].length; i++) {
             os = -jsdate.getTimezoneOffset() * 60;
             if (tal[abbr][i].offset === os) {
             return abbr.toUpperCase();
             }
             }
             }
             */
            return 'UTC';
        },
        Z: function() { // Timezone offset in seconds (-43200...50400)
            return -jsdate.getTimezoneOffset() * 60;
        },
        // Full Date/Time
        c: function() { // ISO-8601 date.
            return 'Y-m-d\\TH:i:sP'.replace(formatChr, formatChrCb);
        },
        r: function() { // RFC 2822
            return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb);
        },
        U: function() { // Seconds since UNIX epoch
            return jsdate / 1000 | 0;
        }
    };
    this.date = function(format, timestamp) {
        that = this;
        jsdate = (timestamp === undefined ? new Date() : // Not provided
                (timestamp instanceof Date) ? new Date(timestamp) : // JS Date()
                new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
                );
        return format.replace(formatChr, formatChrCb);
    };
    return this.date(format, timestamp);
}


/**
 * @author Kyle Florence <kyle[dot]florence[at]gmail[dot]com>
 * @website https://github.com/kflorence/jquery-deserialize/
 * @version 1.2.1
 *
 * Dual licensed under the MIT and GPLv2 licenses.
 */
(function(jQuery, undefined) {

    var push = Array.prototype.push,
            rcheck = /^(?:radio|checkbox)$/i,
            rplus = /\+/g,
            rselect = /^(?:option|select-one|select-multiple)$/i,
            rvalue = /^(?:button|color|date|datetime|datetime-local|email|hidden|month|number|password|range|reset|search|submit|tel|text|textarea|time|url|week)$/i;
    function getElements(elements) {
        return elements.map(function() {
            return this.elements ? jQuery.makeArray(this.elements) : this;
        }).filter(":input").get();
    }

    function getElementsByName(elements) {
        var current,
                elementsByName = {};
        jQuery.each(elements, function(i, element) {
            current = elementsByName[ element.name ];
            elementsByName[ element.name ] = current === undefined ? element :
                    (jQuery.isArray(current) ? current.concat(element) : [current, element]);
        });
        return elementsByName;
    }

    jQuery.fn.deserialize = function(data, options) {
        var i, length,
                elements = getElements(this),
                normalized = [];
        if (!data || !elements.length) {
            return this;
        }

        if (jQuery.isArray(data)) {
            normalized = data;
        } else if (jQuery.isPlainObject(data)) {
            var key, value;
            for (key in data) {
                jQuery.isArray(value = data[ key ]) ?
                        push.apply(normalized, jQuery.map(value, function(v) {
                    return {
                        name: key,
                        value: v
                    };
                })) : push.call(normalized, {
                    name: key,
                    value: value
                });
            }

        } else if (typeof data === "string") {
            var parts;
            data = data.split("&");
            for (i = 0, length = data.length; i < length; i++) {
                parts = data[ i ].split("=");
                push.call(normalized, {
                    name: decodeURIComponent(parts[ 0 ]),
                    value: decodeURIComponent(parts[ 1 ].replace(rplus, "%20"))
                });
            }
        }

        if (!(length = normalized.length)) {
            return this;
        }

        var current, element, j, len, name, property, type, value,
                change = jQuery.noop,
                complete = jQuery.noop,
                names = {};
        options = options || {};
        elements = getElementsByName(elements);
        // Backwards compatible with old arguments: data, callback
        if (jQuery.isFunction(options)) {
            complete = options;
        } else {
            change = jQuery.isFunction(options.change) ? options.change : change;
            complete = jQuery.isFunction(options.complete) ? options.complete : complete;
        }

        for (i = 0; i < length; i++) {
            current = normalized[ i ];
            name = current.name;
            value = current.value;
            if (!(element = elements[ name ])) {
                continue;
            }

            type = (len = element.length) ? element[ 0 ] : element;
            type = (type.type || type.nodeName).toLowerCase();
            property = null;
            if (rvalue.test(type)) {
                if (len) {
                    j = names[ name ];
                    element = element[ names[ name ] = (j == undefined) ? 0 : ++j ];
                }

                change.call(element, (element.value = value));
            } else if (rcheck.test(type)) {
                property = "checked";
            } else if (rselect.test(type)) {
                property = "selected";
            }

            if (property) {
                if (!len) {
                    element = [element];
                    len = 1;
                }

                for (j = 0; j < len; j++) {
                    current = element[ j ];
                    if (current.value == value) {
                        change.call(current, (current[ property ] = true) && value);
                    }
                }
            }
        }

        complete.call(this);
        return this;
    };
})(jQuery);

function jAviso(msg) {
    $.pnotify({
        title: 'CRM Mobile Informa:',
        text: msg,
        hide: true,
        sticker: false,
        history: false,
        icon: false,
        styling: 'jqueryui'
    });
}

function jSucesso(msg) {
    $.pnotify({
        title: 'CRM Mobile Informa:',
        text: msg,
        hide: true,
        sticker: false,
        history: false,
        icon: false,
        styling: 'jqueryui'
    });
}

function debug(tipo, msg) {
    console.log(date('Y-m-d H:i:s', (new Date()).getTime() / 1000) + "\n" + ' Mesagem: "' + msg + '" ' + "\n\n\n");
}

function number_format(number, decimals, dec_point, thousands_sep) {
    // http://kevin.vanzonneveld.net
    // +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +     bugfix by: Michael White (http://getsprink.com)
    // +     bugfix by: Benjamin Lupton
    // +     bugfix by: Allan Jensen (http://www.winternet.no)
    // +    revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // +     bugfix by: Howard Yeend
    // +    revised by: Luke Smith (http://lucassmith.name)
    // +     bugfix by: Diogo Resende
    // +     bugfix by: Rival
    // +      input by: Kheang Hok Chin (http://www.distantia.ca/)
    // +   improved by: davook
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +      input by: Jay Klehr
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +      input by: Amir Habibi (http://www.residence-mixte.com/)
    // +     bugfix by: Brett Zamir (http://brett-zamir.me)
    // +   improved by: Theriault
    // +      input by: Amirouche
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // *     example 1: number_format(1234.56);
    // *     returns 1: '1,235'
    // *     example 2: number_format(1234.56, 2, ',', ' ');
    // *     returns 2: '1 234,56'
    // *     example 3: number_format(1234.5678, 2, '.', '');
    // *     returns 3: '1234.57'
    // *     example 4: number_format(67, 2, ',', '.');
    // *     returns 4: '67,00'
    // *     example 5: number_format(1000);
    // *     returns 5: '1,000'
    // *     example 6: number_format(67.311, 2);
    // *     returns 6: '67.31'
    // *     example 7: number_format(1000.55, 1);
    // *     returns 7: '1,000.6'
    // *     example 8: number_format(67000, 5, ',', '.');
    // *     returns 8: '67.000,00000'
    // *     example 9: number_format(0.9, 0);
    // *     returns 9: '1'
    // *    example 10: number_format('1.20', 2);
    // *    returns 10: '1.20'
    // *    example 11: number_format('1.20', 4);
    // *    returns 11: '1.2000'
    // *    example 12: number_format('1.2000', 3);
    // *    returns 12: '1.200'
    // *    example 13: number_format('1 000,50', 2, '.', ' ');
    // *    returns 13: '100 050.00'
    // Strip all characters but numerical ones.
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function(n, prec) {
        var k = Math.pow(10, prec);
        return '' + Math.round(n * k) / k;
    };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}


/**
 * 
 * Regras de validação
 * @type Object
 * @return Boolean
 */
var _valida = {
// Limpa string
    clear: function(string) {
        var exp = /\.|\_|\:|\;|\ |\-/g;
        return string.toString().replace(exp, "");
    },
    // Valida CPF
    cpf: function(cpf) {
        var exp = /\.|\-/g;
        cpf = cpf.toString().replace(exp, "");
        var erro = false;
        var digitos_iguais = 1;
        if (cpf.length != 11) {
            erro = true;
        } else {
            if (cpf == "00000000000" || cpf == "11111111111" || cpf == "22222222222" || cpf == "33333333333" || cpf == "44444444444" || cpf == "55555555555" || cpf == "66666666666" || cpf == "77777777777" || cpf == "88888888888" || cpf == "99999999999") {
                erro = true;
            } else {
                for (i = 0; i < cpf.length - 1; i++) {
                    if (cpf.charAt(i) != cpf.charAt(i + 1)) {
                        digitos_iguais = 0;
                        break;
                    }
                }
                if (!digitos_iguais) {
                    var numeros = cpf.substring(0, 9);
                    var digitos = cpf.substring(9);
                    var soma = 0;
                    for (i = 10; i > 1; i--) {
                        soma += numeros.charAt(10 - i) * i;
                    }
                    var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                    if (resultado != digitos.charAt(0)) {
                        erro = true;
                    }
                    numeros = cpf.substring(0, 10);
                    soma = 0;
                    for (var i = 11; i > 1; i--) {
                        soma += numeros.charAt(11 - i) * i;
                    }
                    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                    if (resultado != digitos.charAt(1)) {
                        erro = true;
                    } else {
                        erro = false;
                    }
                } else {
                    erro = true;
                }
            }
        }
        return erro;
    },
    // Valida CNPJ
    cnpj: function(cnpj) {
        var erro = false;
        var exp = /\.|\-|\//g;
        cnpj = cnpj.toString().replace(exp, "");
        if (cnpj.length != 14) {
            erro = true;
        } else {
            if (cnpj == "00000000000000" || cnpj == "11111111111111" || cnpj == "22222222222222" || cnpj == "33333333333333" || cnpj == "44444444444444" || cnpj == "55555555555555" || cnpj == "66666666666666" || cnpj == "88888888888888" || cnpj == "99999999999999") {
                erro = true;
            } else {
                var valida = new Array(6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2);
                var dig1 = new Number;
                var dig2 = new Number;
                var digito = new Number(eval(cnpj.charAt(12) + cnpj.charAt(13)));
                for (i = 0; i < valida.length; i++) {
                    dig1 += (i > 0 ? (cnpj.charAt(i - 1) * valida[i]) : 0);
                    dig2 += cnpj.charAt(i) * valida[i];
                }
                dig1 = (((dig1 % 11) < 2) ? 0 : (11 - (dig1 % 11)));
                dig2 = (((dig2 % 11) < 2) ? 0 : (11 - (dig2 % 11)));
                if (((dig1 * 10) + dig2) != digito) {
                    erro = true;
                }
            }
        }
        return erro;
    },
    // Valida E-mail
    email: function(mail) {
        var er = new RegExp(/^[A-Za-z0-9_\-\.]+@[A-Za-z0-9_\-\.]{2,}\.[A-Za-z0-9]{2,}(\.[A-Za-z0-9])?/);
        if (er.test(mail)) {
            return true;
        } else {
            return false;
        }
    }
};

(function($) {
    $.fn.extend({
        form_valida: function() {
            var erro = 0;
            var form = this;
            var campos = "";

            $.each($(this).find(":input").not(':button, :disabled'), function() {
                var name = $(this).attr('id');
                var msg_error = '';

                if ($(this).hasClass("obrigatorio") && $.trim($(this).val()) == "") {
                    erro++;
                    if (msg_error != '') {
                        msg_error += '<br />';
                    }
                    msg_error += "Campo obrigatório";
                }

                if ($(this).hasClass("cpf")) {
                    if (_valida.cpf($.trim($(this).val())) == true) {
                        erro++;
                        if (msg_error != '') {
                            msg_error += '<br />';
                        }
                        msg_error += "CPF inválido";
                    }
                }


                if ($(this).hasClass("cnpj")) {
                    if (_valida.cnpj($.trim($(this).val())) == true) {
                        erro++;
                        if (msg_error != '') {
                            msg_error += '<br />';
                        }
                        msg_error += "CNPJ inválido";
                    }
                }

                if ($(this).hasClass("cpf_cnpj")) {
                    if ($.trim($(this).val()).length == 14) {
                        if (_valida.cpf($.trim($(this).val())) == true) {
                            erro++;
                            if (msg_error != '') {
                                msg_error += '<br />';
                            }
                            msg_error += "CPF inválido";
                        }
                    } else {
                        if (_valida.cnpj($.trim($(this).val())) == true) {
                            erro++;
                            if (msg_error != '') {
                                msg_error += '<br />';
                            }
                            msg_error += "CNPJ inválido";
                        }
                    }
                }

                if ($(this).hasClass("email")) {
                    if (_valida.email($.trim($(this).val())) == false) {
                        erro++;
                        if (msg_error != '') {
                            msg_error += '<br />';
                        }
                        msg_error += "E-mail inválida";
                    }
                }

                if (msg_error != "") {
                    if (campos != '') {
                        campos += ", ";
                    }
                    campos += '"' + name + '" : "' + $.trim(msg_error) + '"';
                }

            });
            if (erro > 0) {
                $(form).color_campos_form({
                    campos: $.parseJSON('{ ' + campos + ' }')
                });
                return false;
            } else {
                return true;
            }
        }
    });
})(jQuery);
(function($) {
    $.fn.extend({
        color_campos_form: function(parametros) {
            var defaults = {
                campos: {}
            };
            var options = $.extend(true, defaults, parametros);
            var msg = '';

            $.each(options.campos, function(a, b) {
                if (msg != '') {
                    msg += '<br />';
                }
                msg += b;
            });
            jAviso(msg);
        }
    });
})(jQuery);

/*
 * jQuery Mobile Framework : temporary extension to port jQuery UI's datepicker for mobile
 * Copyright (c) jQuery Project
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */
(function($, undefined) {

    //cache previous datepicker ui method
    var prevDp = $.fn.datepicker;

    //rewrite datepicker
    $.fn.datepicker = function(options) {

        var dp = this;

        //call cached datepicker plugin
        prevDp.call(this, options);

        //extend with some dom manipulation to update the markup for jQM
        //call immediately
        function updateDatepicker() {
            $(".ui-datepicker-header", dp).addClass("ui-body-c ui-corner-top").removeClass("ui-corner-all");
            $(".ui-datepicker-prev, .ui-datepicker-next", dp).attr("href", "#");
            $(".ui-datepicker-prev", dp).buttonMarkup({iconpos: "notext", icon: "arrow-l", shadow: true, corners: true});
            $(".ui-datepicker-next", dp).buttonMarkup({iconpos: "notext", icon: "arrow-r", shadow: true, corners: true});
            $(".ui-datepicker-calendar th", dp).addClass("ui-bar-c");
            $(".ui-datepicker-calendar td", dp).addClass("ui-body-c");
            $(".ui-datepicker-calendar a", dp).buttonMarkup({corners: false, shadow: false});
            $(".ui-datepicker-calendar a.ui-state-active", dp).addClass("ui-btn-active"); // selected date
            $(".ui-datepicker-calendar a.ui-state-highlight", dp).addClass("ui-btn-up-e"); // today"s date
            $(".ui-datepicker-calendar .ui-btn", dp).each(function() {
                var el = $(this);
                // remove extra button markup - necessary for date value to be interpreted correctly
                el.html(el.find(".ui-btn-text").text());
            });
        }
        ;

        //update now
        updateDatepicker();

        // and on click
        $(dp).click(updateDatepicker);

        //return jqm obj 
        return this;
    };

    //bind to pagecreate to automatically enhance date inputs	
    $(".ui-page").on("pagecreate", function() {
        $(".data", this).each(function() {
            $(this).after($("<div />").datepicker({altField: "#" + $(this).attr("id"), showOtherMonths: true}));
        });
    });
})(jQuery);

(function($) {
    $.fn.extend({
        insere_mascara: function(parametros) {
            var defaults = {
                date: {
                    minDate: null
                },
                numero: {
                    size: 12,
                    maxlength: 10,
                    mascara: "?9999999999"
                },
                alfa: {
                    size: 4,
                    maxlength: 3,
                    mascara: "?aaa",
                    titulo: "Informe somente caracters alfa"
                }
            };
            var options = $.extend(true, defaults, parametros);
            $(this).attr("onsubmit", "return false;");
            $.each($(this).find(":input").not(':button'), function() {
                if ($(this).attr("disabled")) {
                    $(this).addClass("textoDisabled");
                }
                if ($(this).attr("required")) {
                    $(this).addClass("obrigatorio");
                }
                if ($(this).hasClass("obrigatorio")) {
                    $(this).removeAttr("title");
                    $(this).attr("required", "required");
                    $(this).parent().addClass("obrigatorio");
                }
                if ($(this).hasClass("data")) {
                    $(this).attr("type", "date");
                }
                if ($(this).hasClass("email")) {
                    $(this).attr("title", "Informe um E-mail.").attr("maxlength", "255").css('width', '90%');
                }
                if ($(this).hasClass("cpf")) {
                    $(this).attr("title", "Informe um CPF.").attr("size", "16").attr("maxlength", "14");
                }
                if ($(this).hasClass("cnpj")) {
                    $(this).attr("title", "Informe um CNPJ.").attr("size", "20").attr("maxlength", "18");
                }
                if ($(this).hasClass("numero")) {
                    $(this).attr("type", "number");
                    $(this).attr("pattern", "[0-9]*");
                }
                if ($(this).hasClass("alfa")) {
                    $(this).attr("type", "text");
                    $(this).attr("pattern", "[a-zA-Z]*");
                }
            });
            $.each($(this).find(":input").not(':button'), function() {
                var concat = "";
                if ($(this).hasClass("obrigatorio")) {
                    concat = $(this).attr("title");
                    if (concat == undefined || $.trim(concat) == "") {
                        $(this).attr("title", "Campo obrigatório.");
                    } else {
                        $(this).attr("title", "Campo obrigatório, " + concat);
                    }
                }
            });
        }
    });
})(jQuery);

String.prototype.replaceAll = function(de, para) {
    var str = this;
    var pos = str.indexOf(de);
    while (pos > -1) {
        str = str.replace(de, para);
        pos = str.indexOf(de);
    }
    return(str);
};

function md5(str) {
    // http://kevin.vanzonneveld.net
    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // + namespaced by: Michael White (http://getsprink.com)
    // +    tweaked by: Jack
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // -    depends on: utf8_encode
    // *     example 1: md5('Kevin van Zonneveld');
    // *     returns 1: '6e658d4bfcb59cc13f96c14450ac40b9'
    var xl;
    var rotateLeft = function(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    };
    var addUnsigned = function(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    };
    var _F = function(x, y, z) {
        return (x & y) | ((~x) & z);
    };
    var _G = function(x, y, z) {
        return (x & z) | (y & (~z));
    };
    var _H = function(x, y, z) {
        return (x ^ y ^ z);
    };
    var _I = function(x, y, z) {
        return (y ^ (x | (~z)));
    };
    var _FF = function(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };
    var _GG = function(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };
    var _HH = function(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };
    var _II = function(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };
    var convertToWordArray = function(str) {
        var lWordCount;
        var lMessageLength = str.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = new Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    };
    var wordToHex = function(lValue) {
        var wordToHexValue = "",
                wordToHexValue_temp = "",
                lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            wordToHexValue_temp = "0" + lByte.toString(16);
            wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
        }
        return wordToHexValue;
    };
    var x = [],
            k, AA, BB, CC, DD, a, b, c, d, S11 = 7,
            S12 = 12,
            S13 = 17,
            S14 = 22,
            S21 = 5,
            S22 = 9,
            S23 = 14,
            S24 = 20,
            S31 = 4,
            S32 = 11,
            S33 = 16,
            S34 = 23,
            S41 = 6,
            S42 = 10,
            S43 = 15,
            S44 = 21;
    str = this.utf8_encode(str);
    x = convertToWordArray(str);
    a = 0x67452301;
    b = 0xEFCDAB89;
    c = 0x98BADCFE;
    d = 0x10325476;
    xl = x.length;
    for (k = 0; k < xl; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = addUnsigned(a, AA);
        b = addUnsigned(b, BB);
        c = addUnsigned(c, CC);
        d = addUnsigned(d, DD);
    }

    var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
    return temp.toLowerCase();
}

function utf8_encode(argString) {
// http://kevin.vanzonneveld.net
// +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
// +   improved by: sowberry
// +    tweaked by: Jack
// +   bugfixed by: Onno Marsman
// +   improved by: Yves Sucaet
// +   bugfixed by: Onno Marsman
// +   bugfixed by: Ulrich
// +   bugfixed by: Rafal Kukawski
// +   improved by: kirilloid
// *     example 1: utf8_encode('Kevin van Zonneveld');
// *     returns 1: 'Kevin van Zonneveld'

    if (argString === null || typeof argString === "undefined") {
        return "";
    }

    var string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    var utftext = '',
            start, end, stringl = 0;
    start = end = 0;
    stringl = string.length;
    for (var n = 0; n < stringl; n++) {
        var c1 = string.charCodeAt(n);
        var enc = null;
        if (c1 < 128) {
            end++;
        } else if (c1 > 127 && c1 < 2048) {
            enc = String.fromCharCode((c1 >> 6) | 192, (c1 & 63) | 128);
        } else {
            enc = String.fromCharCode((c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128);
        }
        if (enc !== null) {
            if (end > start) {
                utftext += string.slice(start, end);
            }
            utftext += enc;
            start = end = n + 1;
        }
    }

    if (end > start) {
        utftext += string.slice(start, stringl);
    }

    return utftext;
}

function json_encode(mixed_val) {
// http://kevin.vanzonneveld.net
// +      original by: Public Domain (http://www.json.org/json2.js)
// + reimplemented by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
// +      improved by: Michael White
// +      input by: felix
// +      bugfixed by: Brett Zamir (http://brett-zamir.me)
// *        example 1: json_encode(['e', {pluribus: 'unum'}]);
// *        returns 1: '[\n    "e",\n    {\n    "pluribus": "unum"\n}\n]'
    /*
     http://www.JSON.org/json2.js
     2008-11-19
     Public Domain.
     NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
     See http://www.JSON.org/js.html
     */
    var retVal, json = this.window.JSON;
    try {
        if (typeof json === 'object' && typeof json.stringify === 'function') {
            retVal = json.stringify(mixed_val); // Errors will not be caught here if our own equivalent to resource
            //  (an instance of PHPJS_Resource) is used
            if (retVal === undefined) {
                throw new SyntaxError('json_encode');
            }
            return retVal;
        }

        var value = mixed_val;
        var quote = function(string) {
            var escapable = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
            var meta = {// table of character substitutions
                '\b': '\\b',
                '\t': '\\t',
                '\n': '\\n',
                '\f': '\\f',
                '\r': '\\r',
                '"': '\\"',
                '\\': '\\\\'
            };
            escapable.lastIndex = 0;
            return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
                var c = meta[a];
                return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' : '"' + string + '"';
        };
        var str = function(key, holder) {
            var gap = '';
            var indent = '    ';
            var i = 0; // The loop counter.
            var k = ''; // The member key.
            var v = ''; // The member value.
            var length = 0;
            var mind = gap;
            var partial = [];
            var value = holder[key];
            // If the value has a toJSON method, call it to obtain a replacement value.
            if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
                value = value.toJSON(key);
            }

// What happens next depends on the value's type.
            switch (typeof value) {
                case 'string':
                    return quote(value);
                case 'number':
                    // JSON numbers must be finite. Encode non-finite numbers as null.
                    return isFinite(value) ? String(value) : 'null';
                case 'boolean':
                case 'null':
                    // If the value is a boolean or null, convert it to a string. Note:
                    // typeof null does not produce 'null'. The case is included here in
                    // the remote chance that this gets fixed someday.
                    return String(value);
                case 'object':
                    // If the type is 'object', we might be dealing with an object or an array or
                    // null.
                    // Due to a specification blunder in ECMAScript, typeof null is 'object',
                    // so watch out for that case.
                    if (!value) {
                        return 'null';
                    }
                    if ((this.PHPJS_Resource && value instanceof this.PHPJS_Resource) || (window.PHPJS_Resource && value instanceof window.PHPJS_Resource)) {
                        throw new SyntaxError('json_encode');
                    }

// Make an array to hold the partial results of stringifying this object value.
                    gap += indent;
                    partial = [];
                    // Is the value an array?
                    if (Object.prototype.toString.apply(value) === '[object Array]') {
// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.
                        length = value.length;
                        for (i = 0; i < length; i += 1) {
                            partial[i] = str(i, value) || 'null';
                        }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.
                        v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
                        gap = mind;
                        return v;
                    }

// Iterate through all of the keys in the object.
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.
                    v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
                    gap = mind;
                    return v;
                case 'undefined':
                    // Fall-through
                case 'function':
                    // Fall-through
                default:
                    throw new SyntaxError('json_encode');
            }
        };
        // Make a fake root object containing our value under the key of ''.
        // Return the result of stringifying the value.
        return str('', {
            '': value
        });
    } catch (err) { // Todo: ensure error handling above throws a SyntaxError in all cases where it could
// (i.e., when the JSON global is not available and there is an error)
        if (!(err instanceof SyntaxError)) {
            throw new Error('Unexpected error type in json_encode()');
        }
        this.php_js = this.php_js || {};
        this.php_js.last_error_json = 4; // usable by json_last_error()
        return null;
    }
}

function rtrim(str, charlist) {
    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Erkekjetter
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +   input by: rem
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // *     example 1: rtrim('    Kevin van Zonneveld    ');
    // *     returns 1: '    Kevin van Zonneveld'
    charlist = !charlist ? ' \\s\u00A0' : (charlist + '').replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '\\$1');
    var re = new RegExp('[' + charlist + ']+$', 'g');
    return (str + '').replace(re, '');
}

String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{' + i + '\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

function block(remove) {
    $('body').append("<div class='ui-loader-background'> </div>");
    $.mobile.loading('show', {
        text: 'Aguarde sincronizando a base de dados.',
        textVisible: true,
        theme: 'e',
        textonly: false
    });
    $('.ui-loader').css('display', 'block');
    if (remove == true) {
        $('div.ui-loader-background').remove();
        $.mobile.loading('hide');
        $('.ui-loader').css('display', 'none');
    }
}

function TimeCounter() {
    this.startDate = null;
    this.ellapsedTime = null;

    this.start = function() {
        this.startDate = new Date();
    }

    this.stop = function() {
        return (new Date() - this.startDate) / 1000;
    }
}