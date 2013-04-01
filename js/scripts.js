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
    // +   bugfixed by: kirilloid
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
            enc = String.fromCharCode(
                    (c1 >> 6) | 192,
                    (c1 & 63) | 128
                    );
        } else if (c1 & 0xF800 != 0xD800) {
            enc = String.fromCharCode(
                    (c1 >> 12) | 224,
                    ((c1 >> 6) & 63) | 128,
                    (c1 & 63) | 128
                    );
        } else { // surrogate pairs
            if (c1 & 0xFC00 != 0xD800) {
                throw new RangeError("Unmatched trail surrogate at " + n);
            }
            var c2 = string.charCodeAt(++n);
            if (c2 & 0xFC00 != 0xDC00) {
                throw new RangeError("Unmatched lead surrogate at " + (n - 1));
            }
            c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
            enc = String.fromCharCode(
                    (c1 >> 18) | 240,
                    ((c1 >> 12) & 63) | 128,
                    ((c1 >> 6) & 63) | 128,
                    (c1 & 63) | 128
                    );
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



function utf8_decode(str_data) {
    // http://kevin.vanzonneveld.net
    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // +      input by: Aman Gupta
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Norman "zEh" Fuchs
    // +   bugfixed by: hitwork
    // +   bugfixed by: Onno Marsman
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: kirilloid
    // *     example 1: utf8_decode('Kevin van Zonneveld');
    // *     returns 1: 'Kevin van Zonneveld'

    var tmp_arr = [],
            i = 0,
            ac = 0,
            c1 = 0,
            c2 = 0,
            c3 = 0,
            c4 = 0;

    str_data += '';

    while (i < str_data.length) {
        c1 = str_data.charCodeAt(i);
        if (c1 <= 191) {
            tmp_arr[ac++] = String.fromCharCode(c1);
            i++;
        } else if (c1 <= 223) {
            c2 = str_data.charCodeAt(i + 1);
            tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
            i += 2;
        } else if (c1 <= 239) {
            // http://en.wikipedia.org/wiki/UTF-8#Codepage_layout
            c2 = str_data.charCodeAt(i + 1);
            c3 = str_data.charCodeAt(i + 2);
            tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        } else {
            c2 = str_data.charCodeAt(i + 1);
            c3 = str_data.charCodeAt(i + 2);
            c4 = str_data.charCodeAt(i + 3);
            c1 = ((c1 & 7) << 18) | ((c2 & 63) << 12) | ((c3 & 63) << 6) | (c4 & 63);
            c1 -= 0x10000;
            tmp_arr[ac++] = String.fromCharCode(0xD800 | ((c1 >> 10) & 0x3FF));
            tmp_arr[ac++] = String.fromCharCode(0xDC00 | (c1 & 0x3FF));
            i += 4;
        }
    }

    return tmp_arr.join('');
}


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
        hide: false,
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
        hide: false,
        sticker: false,
        history: false,
        icon: false,
        styling: 'jqueryui'
    });
}

function debug(tipo, msg) {
    console.log(date('Y-m-d H:i:s', (new Date()).getTime() / 1000) + "\n" + ' Mesagem: "' + msg + '" ' + "\n\n\n");
}


/**
 * 
 * Regras de validação
 * @type Object
 * @return Boolean
 */
var _valida = {
    // Limpa string
    clear : function(string) {
        var exp = /\.|\_|\:|\;|\ |\-/g;
        return string.toString().replace(exp, "");
    },
    // Valida Registro
    registro : function(registro) {
        registro = String(_valida.clear(registro));
        if ( registro.length == 11 ) {
            var dc1 = registro.substr(9, 1);
            var dc2 = registro.substr(10, 1);
            registro = registro.split("");
            for ( var i = 0; i < registro.length; i++ ) {
                registro[i] = parseInt(registro[i], 10);
            }
            var soma1 = ((registro[0] * 2) + (registro[1] * 3) + (registro[2] * 4) + (registro[3] * 5) + (registro[4] * 6) + (registro[5] * 7) + (registro[6] * 8) + (registro[7] * 9) + (registro[8] * 10));
            var mod_soma1 = soma1 % 11;
            if ( mod_soma1 > 1 ) {
                mod_soma1 = 11 - mod_soma1;
            } else {
                mod_soma1 = 0;
            }
            var soma2 = ((mod_soma1 * 2 + registro[0] * 3 + registro[1] * 4 + registro[2] * 5 + registro[3] * 6 + registro[4] * 7 + registro[5] * 8 + registro[6] * 9 + registro[7] * 10 + registro[8] * 11));
            var mod_soma2 = soma2 % 11;
            if ( mod_soma2 > 1 ) {
                mod_soma2 = 11 - mod_soma2;
            } else {
                mod_soma2 = 0;
            }
            if ( (mod_soma1 == dc1) && (mod_soma2 == dc2) ) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    // Valida Data
    data : function(data) {
        var date = data;
        var array_data = new Array;
        var ExpReg = new RegExp("(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[012])/[12][0-9]{3}");
        array_data = date.split("/");
        var erro = false;
        if ( date.search(ExpReg) == -1 ) {
            erro = true;
        } else {
            if ( ((array_data[1] == 4) || (array_data[1] == 6) || (array_data[1] == 9) || (array_data[1] == 11)) && (array_data[0] > 30) ) {
                erro = true;
            } else {
                if ( array_data[1] == 2 ) {
                    if ( (array_data[0] > 28) && ((array_data[2] % 4) != 0) ) {
                        erro = true;
                    }
                    if ( (array_data[0] > 29) && ((array_data[2] % 4) == 0) ) {
                        erro = true;
                    }
                }
            }
        }
        return erro;
    },
    // Valida Hora
    hora : function(h) {
        var retorno = false;
        if ( h.length > 4 ) {
            var novaHora = h.split(":");
            var hora = (novaHora[0] == undefined || novaHora[0] == "" ? null : novaHora[0]);
            var minuto = (novaHora[1] == undefined || novaHora[1] == "" ? null : novaHora[1]);
            var segundo = (novaHora[2] == undefined || novaHora[2] == "" ? null : novaHora[2]);
            if ( hora != null ) {
                if ( (hora >= 0) && (hora <= 23) ) {
                    if ( minuto != null ) {
                        if ( (minuto >= 0) && (minuto <= 59) ) {
                            if ( segundo != null ) {
                                if ( (segundo >= 0) && (segundo <= 59) ) {
                                    retorno = false;
                                } else {
                                    retorno = true;
                                }
                            } else {
                                retorno = false;
                            }
                        } else {
                            retorno = true;
                        }
                    }
                } else {
                    retorno = true;
                }
            } else {
                retorno = true;
            }
        } else {
            retorno = true;
        }
        return retorno;
    },
    // Valida Mac
    mac_address : function(string) {
        var erros = false;
        string = string.split(":");
        var padrao = /[0-9]|[a-fA-F]{2}/;
        if ( string.length != 6 ) {
            erros = true;
        } else {
            $.each(string, function(a, b) {
                if ( b.search(padrao) < 0 ) {
                    erros = true;
                }
            });
        }
        return erros;
    },
    // Valida Hora Maior
    hora_maior : function(hora_inicio, hora_fim) {
        var hie = hora_inicio.split(":");
        var hieh = hie[0];
        var hiem = hie[1];
        var hies = (hie[2] == undefined ? 0 : hie[2]);
        var hi = new Date(1970, 1, 1, hieh, hiem, hies);
        var hfe = hora_fim.split(":");
        var hfeh = hfe[0];
        var hfem = hfe[1];
        var hfes = (hfe[2] == undefined ? 0 : hfe[2]);
        var hf = new Date(1970, 1, 1, hfeh, hfem, hfes);
        if ( hi.getTime() > hf.getTime() ) {
            return false;
        } else {
            return true;
        }
    },
    // Valida Data Hora Maior
    data_hora_maior : function(data_hora_inicio, data_hora_fim) {
        var di = data_hora_inicio.split(" ");
        var df = data_hora_fim.split(" ");
        if ( valida_data_maior(di[0], df[0]) == true ) {
            if ( valida_hora_maior(di[1], df[1]) == true ) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    // Valida Data Maior
    data_maior : function(data_inicio, data_fim) {
        var hie = data_inicio.split("/");
        var hieh = hie[0];
        var hiem = hie[1];
        var hies = (hie[2] == undefined ? 0 : hie[2]);
        var hi = new Date(hies, hiem, hieh);
        var hfe = data_fim.split("/");
        var hfeh = hfe[0];
        var hfem = hfe[1];
        var hfes = (hfe[2] == undefined ? 0 : hfe[2]);
        var hf = new Date(hfes, hfem, hfeh);
        if ( hi.getTime() > hf.getTime() ) {
            return false;
        } else {
            return true;
        }
    },
    // Valida Data Hora
    data_hora : function(data_hora) {
        if ( data_hora != '' ) {
            var explode = data_hora.split(" ");
            var data = (explode[0] == undefined || explode[0] == "" ? null : explode[0]);
            var hora = (explode[1] == undefined || explode[1] == "" ? null : explode[1]);
            var retorno = false;
            if ( data != null ) {
                if ( _valida.data($.trim(data)) == true ) {
                    retorno = true;
                }
            } else {
                retorno = true;
            }
            if ( hora != null ) {
                if ( _valida.hora($.trim(hora)) == true ) {
                    retorno = true;
                }
            } else {
                retorno = true;
            }
            return retorno;
        } else {
            return false;
        }
    },
    // Valida CPF
    cpf : function(cpf) {
        var exp = /\.|\-/g;
        cpf = cpf.toString().replace(exp, "");
        var erro = false;
        var digitos_iguais = 1;
        if ( cpf.length != 11 ) {
            erro = true;
        } else {
            if ( cpf == "00000000000" || cpf == "11111111111" || cpf == "22222222222" || cpf == "33333333333" || cpf == "44444444444" || cpf == "55555555555" || cpf == "66666666666" || cpf == "77777777777" || cpf == "88888888888" || cpf == "99999999999" ) {
                erro = true;
            } else {
                for ( i = 0; i < cpf.length - 1; i++ ) {
                    if ( cpf.charAt(i) != cpf.charAt(i + 1) ) {
                        digitos_iguais = 0;
                        break;
                    }
                }
                if ( !digitos_iguais ) {
                    var numeros = cpf.substring(0, 9);
                    var digitos = cpf.substring(9);
                    var soma = 0;
                    for ( i = 10; i > 1; i-- ) {
                        soma += numeros.charAt(10 - i) * i;
                    }
                    var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                    if ( resultado != digitos.charAt(0) ) {
                        erro = true;
                    }
                    numeros = cpf.substring(0, 10);
                    soma = 0;
                    for ( var i = 11; i > 1; i-- ) {
                        soma += numeros.charAt(11 - i) * i;
                    }
                    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                    if ( resultado != digitos.charAt(1) ) {
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
    cnpj : function(cnpj) {
        var erro = false;
        var exp = /\.|\-|\//g;
        cnpj = cnpj.toString().replace(exp, "");
        if ( cnpj.length != 14 ) {
            erro = true;
        } else {
            if ( cnpj == "00000000000000" || cnpj == "11111111111111" || cnpj == "22222222222222" || cnpj == "33333333333333" || cnpj == "44444444444444" || cnpj == "55555555555555" || cnpj == "66666666666666" || cnpj == "88888888888888" || cnpj == "99999999999999" ) {
                erro = true;
            } else {
                var valida = new Array(6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2);
                var dig1 = new Number;
                var dig2 = new Number;
                var digito = new Number(eval(cnpj.charAt(12) + cnpj.charAt(13)));
                for ( i = 0; i < valida.length; i++ ) {
                    dig1 += (i > 0 ? (cnpj.charAt(i - 1) * valida[i]) : 0);
                    dig2 += cnpj.charAt(i) * valida[i];
                }
                dig1 = (((dig1 % 11) < 2) ? 0 : (11 - (dig1 % 11)));
                dig2 = (((dig2 % 11) < 2) ? 0 : (11 - (dig2 % 11)));
                if ( ((dig1 * 10) + dig2) != digito ) {
                    erro = true;
                }
            }
        }
        return erro;
    },
    // Valida E-mail
    email : function(mail) {
        var er = new RegExp(/^[A-Za-z0-9_\-\.]+@[A-Za-z0-9_\-\.]{2,}\.[A-Za-z0-9]{2,}(\.[A-Za-z0-9])?/);
        if ( er.test(mail) ) {
            return true;
        } else {
            return false;
        }
    }
};

/**
 * 
 * Regras de String
 * @type Object
 * @return String
 */

var _string = {
    // formata numero
    number_format : function(number, decimals, dec_point, thousands_sep) {
        var n = number, prec = decimals;
        n = !isFinite(+n) ? 0 : +n;
        prec = !isFinite(+prec) ? 0 : Math.abs(prec);
        var sep = (typeof thousands_sep == "undefined") ? "," : thousands_sep;
        var dec = (typeof dec_point == "undefined") ? "." : dec_point;
        var s = (prec > 0) ? n.toFixed(prec) : Math.round(n).toFixed(prec);
        var abs = Math.abs(n).toFixed(prec);
        var _, i;
        if ( abs >= 1000 ) {
            _ = abs.split(/\D/);
            i = _[0].length % 3 || 3;
            _[0] = s.slice(0, i + (n < 0)) + _[0].slice(i).replace(/(\d{3})/g, sep + "$1");
            s = _.join(dec);
        } else {
            s = s.replace(".", dec);
        }
        return s;
    },
    // converter moeda
    converter_moeda : function(str, sub1, sub2) {
        if ( sub1 == undefined ) {
            sub1 = ",";
        }
        if ( sub2 == undefined ) {
            sub2 = ".";
        }
        var numero = str.split(".");
        var numero_novo = "";
        for ( var i = 0; i < numero.length; i++ ) {
            numero_novo += numero[i];
        }
        numero_novo = numero_novo.replace(sub1, sub2);
        return parseFloat(numero_novo);
    },
    // converte rgb para hexadecimal
    rgb_to_hex : function(a) {
        if ( !$.browser.msie ) {
            var d = a.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            if ( d != null ) {
                function b(c) {
                    return("0" + parseInt(c).toString(16)).slice(-2);
                }
                return"#" + b(d[1]) + b(d[2]) + b(d[3]);
            } else {
                return a;
            }
        } else {
            return a;
        }
    },
    // gerar mascara
    mascara : function(str, formato) {
        if ( str.length > formato.length ) {
            return false;
        } else {
            var saida = "";
            var cont = 0;
            for ( var i = 0; i < formato.length; i++ ) {
                if ( formato[i] == "9" ) {
                    saida += str[cont];
                    cont++;
                } else {
                    saida += formato[i];
                }
            }
            return saida;
        }
    },
    // formata data
    formata_data : function(data) {
        var dt = data.split("-");
        return dt[2] + "/" + dt[1] + "/" + dt[0];
    },
    // limpa string
    limpa_string : function(str) {
        if ( str ) {
            var novo_str = "";
            novo_str = str.replaceAll("(", "");
            novo_str = novo_str.replaceAll(")", "");
            novo_str = novo_str.replaceAll('"', "");
            novo_str = novo_str.replaceAll("'", "");
            novo_str = novo_str.replaceAll("-", "");
            novo_str = novo_str.replaceAll("_", "");
            novo_str = novo_str.replaceAll(":", "");
            novo_str = novo_str.replaceAll("[", "");
            novo_str = novo_str.replaceAll("]", "");
            novo_str = novo_str.replaceAll("{", "");
            novo_str = novo_str.replaceAll("}", "");
            novo_str = novo_str.replaceAll("&", "");
            novo_str = novo_str.replaceAll("%", "");
            novo_str = novo_str.replaceAll("$", "");
            novo_str = novo_str.replaceAll("#", "");
            novo_str = novo_str.replaceAll("@", "");
            novo_str = novo_str.replaceAll(" ", "");
            return novo_str;
        } else {
            return"";
        }
    }
};

/**
 * 
 * @param Object obj
 * @param Boolean remover
 */

function load_img(obj, remover) {
    $(obj).after('<img src="' + base_url + 'themes/default/imagem/ajax-loader.gif" class="load_' + $(obj).attr('id') + '" />');
    if ( remover == true ) {
        $('.load_' + $(obj).attr('id')).remove();
    }
}

/**
 * 
 * @type Object
 * @return String description
 */
var _url = {
    // explode urk
    explode : function() {
        var url = location.href;
        url = url.replace(base_url, "");
        return url.split("/");
    },
    // segmento da url
    segment : function(posicao, retorno) {
        if ( posicao == undefined || posicao == "" || posicao == 0 ) {
            return null;
        } else {
            var urls = _url.explode();
            if ( urls[(posicao - 1)] == undefined ) {
                return (retorno == undefined ? null : retorno);
            } else {
                return urls[(posicao - 1)];
            }
        }
    },
    // monta string sem a url
    string : function() {
        var n_url = '';
        if ( _url.explode.length > 0 ) {
            for ( var i = 0; i < _url.explode.length; i++ ) {
                n_url += _url.explode[i] + '/';
            }
        }
        return n_url;
    },
    total : function() {
        return _url.explode.length;
    }
};

/**
 * 
 * @type Object
 * @return String
 */
_json = {
    // url a ser codificada
    url_encode : function(form) {
        var new_form = json_encode($(form).serializeObject());
        var convert = base64_encode(new_form);
        convert = convert.replace(/\+/g, ".");
        convert = convert.replace(/\=/g, "-");
        convert = convert.replace(/\//g, "~");
        return convert;
    },
    // url a ser decodificada
    url_decode : function(str) {
        str = str.replace(/\./g, "+");
        str = str.replace(/\-/g, "=");
        str = str.replace(/\~/g, "/");
        str = new String(str);
        var convert = base64_decode(str);
        return $.parseJSON(convert);
    }
};

/**
 * Função para criação de subtitulo
 * @param Object  
 */
(function($) {
    $.fn.extend({
        subtitulo : function(parametros) {
            var defaults = {
                msg : "",
                css : { }
            };

            var options = $.extend(true, defaults, parametros);
            $(this).after('<span class="exemplo_span">' + options.msg + "</span>");
            $(this).next().css(options.css);
            return false;
        }
    });
})(jQuery);


/**
 * Função para criação de botões
 * @param Object  
 */
(function($) {
    $.fn.extend({
        bt : function(parametros) {
            var defaults = {
                icon : "",
                icon2 : "",
                text : "",
                title : "",
                path : ""
            };

            var options = $.extend(true, defaults, parametros);
            return $(this).each(function() {
                $(this).button({
                    icons : {
                        primary : options.icon,
                        secondary : options.icon2
                    },
                    label : options.text,
                    text : options.text
                }).attr("title", options.title);

                if ( $.trim(options.text) == '' || $.trim(options.text) == "&nbsp" ) {
                    $(this).find('.ui-button-text').css({
                        'padding' : ".4em 0em .4em 2.1em"
                    }).html('&nbsp');
                }

                if ( options.path != "" ) {
                    options.path = (options.path.substr(-1) != "/" ? options.path + "/" : options.path);
                    $(this).attr("permissao_perfil_path", options.path);
                    $(this).addClass("permissao_perfil_path_ajax");
                }
            });
            return false;
        }
    });
})(jQuery);

(function($) {
    $.fn.extend({
        form_valida : function(parametros) {
            var defaults = {
                id_msg : "#msg"
            };

            var options = $.extend(true, defaults, parametros);
            var erro = 0;
            var form = this;
            var campos = "";

            $(".ui-tabs-nav li").css("background", "").removeAttr("title");

            $(this).find(":input").removeClass('textoErro').removeClass('textoSucesso').removeClass('textoAviso');

            $.each($(this).find(":input").not(':button, :disabled'), function() {
                var name = $(this).attr('id');
                var msg_error = '';

                if ( $(this).hasClass("obrigatorio") && $.trim($(this).val()) == "" ) {
                    erro++;
                    if ( msg_error != '' ) {
                        msg_error += '<br />';
                    }
                    msg_error += "Campo obrigatório";
                }

                if ( $(this).hasClass("data") ) {
                    if ( _valida.data($.trim($(this).val())) == true ) {
                        erro++;
                        if ( msg_error != '' ) {
                            msg_error += '<br />';
                        }
                        msg_error += "Data inválida";
                    }
                }

                if ( ($(this).hasClass("hora") || $(this).hasClass("hora_segundos")) ) {
                    if ( _valida.hora($.trim($(this).val())) == true ) {
                        erro++;
                        if ( msg_error != '' ) {
                            msg_error += '<br />';
                        }
                        msg_error += "Hora inválida";
                    }
                }

                if ( $(this).hasClass("data_hora") ) {
                    if ( _valida.data_hora($.trim($(this).val())) == true ) {
                        erro++;
                        if ( msg_error != '' ) {
                            msg_error += '<br />';
                        }
                        msg_error += "Data/Hora inválida";
                    }
                }

                if ( $(this).hasClass("cpf") ) {
                    if ( _valida.cpf($.trim($(this).val())) == true ) {
                        erro++;
                        if ( msg_error != '' ) {
                            msg_error += '<br />';
                        }
                        msg_error += "CPF inválido";
                    }
                }


                if ( $(this).hasClass("cnpj") ) {
                    if ( _valida.cnpj($.trim($(this).val())) == true ) {
                        erro++;
                        if ( msg_error != '' ) {
                            msg_error += '<br />';
                        }
                        msg_error += "CNPJ inválido";
                    }
                }

                if ( $(this).hasClass("cpf_cnpj") ) {
                    if ( $.trim($(this).val()).length == 14 ) {
                        if ( _valida.cpf($.trim($(this).val())) == true ) {
                            erro++;
                            if ( msg_error != '' ) {
                                msg_error += '<br />';
                            }
                            msg_error += "CPF inválido";
                        }
                    } else {
                        if ( _valida.cnpj($.trim($(this).val())) == true ) {
                            erro++;
                            if ( msg_error != '' ) {
                                msg_error += '<br />';
                            }
                            msg_error += "CNPJ inválido";
                        }
                    }
                }

                if ( $(this).hasClass("mac") ) {
                    if ( _valida.mac_address($.trim($(this).val())) == true ) {
                        erro++;
                        if ( msg_error != '' ) {
                            msg_error += '<br />';
                        }
                        msg_error += "MAC inválido";
                    }
                }

                if ( $(this).hasClass("placa") ) {
                    if ( $.trim($(this).val()).length != 8 ) {
                        erro++;
                        if ( msg_error != '' ) {
                            msg_error += '<br />';
                        }
                        msg_error += "Placa inválida";
                    }
                }

                if ( $(this).hasClass("email") ) {
                    if ( _valida.email($.trim($(this).val())) == false ) {
                        erro++;
                        if ( msg_error != '' ) {
                            msg_error += '<br />';
                        }
                        msg_error += "E-mail inválida";
                    }
                }

                if ( $(this).hasClass("telefone") ) {
                    if ( $.trim($(this).val()).length < 14 && $.trim($(this).val()).length > 15 ) {
                        erro++;
                        if ( msg_error != '' ) {
                            msg_error += '<br />';
                        }
                        msg_error += "Formato do telefone inválido";
                    }
                }

                if ( msg_error != "" ) {
                    if ( campos != '' ) {
                        campos += ", ";
                    }
                    campos += '"' + name + '" : "' + $.trim(msg_error) + '"';
                }

            });
            if ( erro > 0 ) {
                $(form).color_campos_form({
                    campos : $.parseJSON('{ ' + campos + ' }'),
                    id_msg : options.id_msg
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
        color_campos_form : function(parametros) {
            var defaults = {
                class_erro : "textoErro",
                class_sucesso : "textoSucesso",
                class_aviso : "textoAviso",
                class_desabilitado : "textoDisabled",
                class_span_erro : "spanError",
                msg : "Os campos destacados em vermelho, são de preenchimento obrigatório ou contém erros.",
                campos : { },
                id_msg : "#msg"
            };

            var options = $.extend(true, defaults, parametros);
            var obj = $(this);
            var meuArray = new Array();

            $('.' + options.class_span_erro).remove();

            $(options.id_msg).msg({
                css : 'erro',
                descricao : options.msg
            });

            $(".ui-tabs-nav li").css("background", "").removeAttr("title");
            $.each(options.campos, function(a, b) {
                meuArray[a] = b;
            });
            $.each(obj.find(":input").not(':button'), function(c, d) {
                $(d).removeClass(options.class_sucesso).removeClass(options.class_erro).removeClass(options.class_aviso).addClass(options.class_sucesso);
                if ( meuArray[$(d).attr("id")] ) {
                    var b = meuArray[$(d).attr("id")];
                    $(d).removeClass(options.class_sucesso).removeClass(options.class_erro).removeClass(options.class_aviso).removeAttr("title").addClass(options.class_erro).attr("title", b);
                    if ( $(d).next().is(":button") ) {
                        $(d).next().after('<span class="span_remove_error_' + $(d).attr("id") + ' ' + options.class_span_erro + '">' + b + '</span>');
                    } else {
                        $(d).after('<span class="span_remove_error_' + $(d).attr("id") + ' ' + options.class_span_erro + '">' + b + '</span>');
                    }

                    if ( $(".ui-tabs-nav").html() != null ) {
                        if ( $(d).hasClass(options.class_erro) ) {
                            var id_tabs = $(d).closest(".ui-tabs-panel").attr("id");
                            $('.ui-tabs-nav li a[href="#' + id_tabs + '"]').attr("title", "A erro(s) no(s) campo(s) desta aba.").closest("li").css("background", "#F6BEC1");
                        }
                    }
                }
            });
        }
    });
})(jQuery);

(function($) {
    $.fn.extend({
        clear_form : function() {
            $(this).find(":input").not(':button').each(function() {
                switch ( this.type ) {
                    case"password":
                    case"select-multiple":
                    case"select-one":
                    case"select":
                    case"text":
                    case"textarea":
                        $(this).val("");
                        break;
                    case"checkbox":
                    case"radio":
                        this.checked = false;
                        break;
                }
            });
        }
    });
})(jQuery);

(function($) {
    $.fn.extend({
        insere_mascara : function(parametros) {
            var defaults = {
                date : {
                    minDate : null
                },
                numero : {
                    size : 12,
                    maxlength : 10,
                    mascara : "?9999999999"
                },
                alfa : {
                    size : 4,
                    maxlength : 3,
                    mascara : "?aaa",
                    titulo : "Informe somente caracters alfa"
                }
            };

            var options = $.extend(true, defaults, parametros);
            $(this).attr("onsubmit", "return false;");
            $.each($(this).find(":input").not(':button'), function() {
                $(this).unmask();
                $(this).maskMoney('destroy');
                /*if ($(this).hasClass("textoDisabled")) {
                 $(this).removeAttr("title").removeClass("obrigatorio");
                 }*/
                if ( $(this).attr("disabled") ) {
                    $(this).addClass("textoDisabled");
                }
                if ( $(this).hasClass("obrigatorio") ) {
                    $(this).removeAttr("title");
                    $(this).attr("required", "required");
                }
                if ( $(this).hasClass("data") ) {
                    $(this).mask("?99/99/9999").datepicker({
                        'minDate' : options.date.minDate
                    }).attr("title", "Informe uma Data").attr("size", "12").attr("maxlength", "10");
                }
                if ( $(this).hasClass("mes_data") ) {
                    $(this).mask("?99/9999").attr("title", "Informe uma Mês e Ano").attr("size", "9").attr("maxlength", "7");
                }
                if ( $(this).hasClass("email") ) {
                    $(this).attr("title", "Informe um E-mail.").attr("maxlength", "255").css('width', '90%');
                }
                if ( $(this).hasClass("hora") ) {
                    $(this).attr("title", "Informe uma Hora.").mask("?99:99").attr("size", "7").attr("maxlength", "5");
                }
                if ( $(this).hasClass("hora_segundos") ) {
                    $(this).mask("?99:99:99").attr("title", "Informe uma Hora.").attr("size", "10").attr("maxlength", "8");
                }
                if ( $(this).hasClass("data_hora") ) {
                    $(this).datetimepicker({
                        'showSecond' : true,
                        'timeFormat' : "hh:mm:ss"
                    }).mask("?99/99/9999 99:99:99").attr("title", "Informe uma Data/Hora.").attr("size", "22").attr("maxlength", "19");
                }
                if ( $(this).hasClass("placa") ) {
                    $(this).mask("?aaa-9999").attr("title", "Informe uma Placa.").attr("size", "10").attr("maxlength", "8").css({
                        'text-transform' : "uppercase"
                    });
                }
                if ( $(this).hasClass("cpf") ) {
                    $(this).mask("?999.999.999-99").attr("title", "Informe um CPF.").attr("size", "16").attr("maxlength", "14");
                }
                if ( $(this).hasClass("cpf_cnpj") ) {
                    $(this).mask("?99.999.999/9999-99").on("focusout", function(event) {
                        var target, phone, element;
                        target = (event.currentTarget) ? event.currentTarget : event.srcElement;
                        phone = target.value.replace(/\D/g, "");
                        element = $(target);
                        element.unmask();
                        if ( phone.length > 11 ) {
                            element.attr("title", "Informe um CNPJ.").attr("size", "20").attr("maxlength", "18").mask("?99.999.999/9999-99");
                        } else {
                            element.mask("?999.999.999-99").attr("title", "Informe um CPF.").attr("size", "16").attr("maxlength", "14");
                        }
                    });
                }
                if ( $(this).hasClass("mac") ) {
                    $(this).mask("?**:**:**:**:**:**").css({
                        'text-transform' : "uppercase"
                    }).attr("title", "Informe um MAC.").attr("size", "19").attr("maxlength", "17");
                }
                if ( $(this).hasClass("telefone") ) {
                    $(this).mask("?(99) 9999-99999").on("focusout", function(event) {
                        var target, phone, element;
                        target = (event.currentTarget) ? event.currentTarget : event.srcElement;
                        phone = target.value.replace(/\D/g, "");
                        element = $(target);
                        element.unmask();
                        if ( phone.substr(0, 2) == '11' ) {
                            element.mask("?(99) 99999-9999");
                        } else {
                            element.mask("?(99) 9999-9999");
                        }
                    }).attr("title", "Informe um Telefone com DDD.").attr("size", "16").attr("maxlength", "14");
                }
                if ( $(this).hasClass("cnpj") ) {
                    $(this).mask("?99.999.999/9999-99").attr("title", "Informe um CNPJ.").attr("size", "20").attr("maxlength", "18");
                }
                if ( $(this).hasClass("pis") ) {
                    $(this).mask("?999.99999.99-9");
                    $(this).attr("title", "Informe um PIS.");
                    $(this).attr("size", "16");
                    $(this).attr("maxlength", "14");
                }
                if ( $(this).hasClass("ctps") ) {
                    $(this).mask("?9999999");
                    $(this).attr("title", "Informe um CPTS.");
                    $(this).attr("size", "9");
                    $(this).attr("maxlength", "7");
                }
                if ( $(this).hasClass("ctps_serie") ) {
                    $(this).mask("?99999");
                    $(this).attr("title", "Informe a série.");
                    $(this).attr("size", "7");
                    $(this).attr("maxlength", "5");
                }
                if ( $(this).hasClass("cep") ) {
                    $(this).mask("?99999-999");
                    $(this).attr("title", "Informe um CEP.");
                    $(this).attr("size", "11");
                    $(this).attr("maxlength", "9");
                }
                if ( $(this).hasClass("numero") ) {
                    var qtd = $(this).attr('maxlength');
                    if ( !qtd ) {
                        $(this).mask(options.numero.mascara, {
                            placeholder : ""
                        });
                    } else {
                        var masc = '?';
                        for ( var i = 0; i < parseInt(qtd); i++ ) {
                            masc += '9';
                        }
                        $(this).mask(masc, {
                            placeholder : ""
                        });
                    }
                    $(this).attr("title", "Informe o número.");
                    $(this).attr("size", (!$(this).attr('size') || $(this).attr('size') == '' ? options.numero.size : $(this).attr('size')));
                    $(this).attr("maxlength", (!$(this).attr('maxlength') || $(this).attr('maxlength') == '' ? options.numero.maxlength : $(this).attr('maxlength')));
                }
                if ( $(this).hasClass("alfa") ) {
                    $(this).mask(options.alfa.mascara, {
                        placeholder : ""
                    });
                    $(this).attr("title", options.alfa.titulo);
                    $(this).attr("size", options.alfa.size);
                    $(this).attr("maxlength", options.alfa.maxlength);
                }
                if ( $(this).hasClass("peso") ) {
                    $(this).maskMoney({
                        allowNegative : true,
                        precision : 3
                    });
                    $(this).attr("title", "Informe o peso.");
                }
                if ( $(this).hasClass("altura_largura") ) {
                    $(this).maskMoney({
                        allowNegative : true,
                        precision : 2
                    });
                    $(this).attr("title", "Informe a (altura/largura).");
                }
                if ( $(this).hasClass("moeda") ) {
                    $(this).maskMoney({
                        allowNegative : true,
                        precision : 2
                    });
                    $(this).attr("title", "Informe valor Monetário.");
                }
                if ( $(this).hasClass("latitude_longitude") ) {
                    $(this).maskMoney({
                        allowNegative : true,
                        precision : 6
                    });
                    $(this).attr("title", "Informe valor " + $(this).attr("name") + ".");
                }
            });

            $.each($(this).find(":input").not(':button'), function() {
                var concat = "";
                if ( $(this).hasClass("obrigatorio") ) {
                    concat = $(this).attr("title");
                    if ( concat == undefined || $.trim(concat) == "" ) {
                        $(this).attr("title", "Campo obrigatório.");
                    } else {
                        $(this).attr("title", "Campo obrigatório, " + concat);
                    }
                }
            });
        }
    });
})(jQuery);

(function($) {
    $.fn.cep = function(parametros) {
        $(this).on('change', function() {
            var defaults = {
                msg : "Aguarde... Buscado dados do CEP.",
                success : function(a, b, c) {
                },
                error : function(a, b, c) {
                }
            };
            var obj = this;
            var options = $.extend(true, defaults, parametros);
            load_img(obj, false);
            $.ajax({
                url : base_url + "cep/index/" + _valida.clear($(obj).val()),
                dataType : "json",
                async : false,
                success : function(response) {
                    options.success.call(null, response, obj, options);
                    load_img(obj, true);
                },
                error : function() {
                    options.error.call(null, $.parseJSON('{"cod":"404","msg":"CEP não localizado."}'), obj, options);
                    load_img(obj, true);
                }
            });
        });
    };

})(jQuery);

(function($) {
    $.fn.extend({
        print_frame : function(parametros) {
            var defaults = {
                html : "",
                height : ($(window).height() - ($(window).height() / 10)),
                width : ($(window).width() - 100),
                title : ""
            };

            var options = $.extend(true, defaults, parametros);
            $("#dialog:ui-dialog").dialog("destroy");
            $("#dialog-message p").html('<iframe src="' + options.html + '" name="print_modal" id="print_modal" width="99%" height="' + (options.height - 100) + '" frameborder="0" marginheight="0" marginwidth="0" scrolling="auto" style="overflow: auto;"></iframe>');
            $("#dialog-message").dialog({
                title : options.title,
                modal : true,
                resizable : true,
                position : "center",
                width : options.width,
                height : options.height,
                buttons : {
                    Fechar : function() {
                        $(this).dialog("close");
                    },
                    Imprimir : function() {
                        if ( $.browser.msie ) {
                            window.frames.print_modal.focus();
                            window.frames.print_modal.print();
                        } else {
                            window.frames.print_modal.focus();
                            window.frames.print_modal.print();
                        }
                    }
                },
                open : function() {
                    $(this).parent().find(".ui-dialog-buttonpane button:first-child").button({
                        icons : {
                            primary : "ui-icon-circle-close"
                        }
                    });
                    $(this).parent().find(".ui-dialog-buttonpane button:first-child").next().button({
                        icons : {
                            primary : "ui-icon-print"
                        }
                    });
                }
            });
            return false;
        }
    });
})(jQuery);

(function($) {
    $.fn.clearTextLimit = function() {
        return this.each(function() {
            this.onkeydown = this.onkeyup = null;
        });
    };

    $.fn.textLimit = function(limit, callback) {
        if ( typeof callback !== "function" ) {
            var callback = function() {
            };

        }
        return this.each(function() {
            this.limit = limit;
            this.callback = callback;
            this.onkeydown = this.onkeyup = function() {
                this.value = this.value.substr(0, this.limit);
                this.reached = this.limit - this.value.length;
                this.reached = (this.reached == 0) ? true : false;
                return this.callback(this.value.length, this.limit, this.reached);
            };

        });
    };

})(jQuery);

(function($) {
    $.fn.extend({
        form_consultar : function() {
            var obj = this;
            var form = $(this).closest("form");
            $(form).attr("method", "post");
            $(form).attr("onsubmit", "return false;");
            $(obj).on('click', function(a) {
                a.preventDefault();
                if ( $(form).form_valida() == true ) {
                    $('#msg').msg({
                        css : 'sucesso',
                        descricao : 'Aguarde... Executando operação.'
                    });
                    $(form).removeAttr("onsubmit").attr("method", "post").submit();
                    return true;
                } else {
                    return false;
                }
            });
        }
    });
})(jQuery);

$.fn.removeTr = function() {
    $(this).closest("tr").addClass("excluida").delay(1000).fadeOut("slow", function() {
        $(this).remove();
    });
};

(function($) {

    $.fn.msg = function(options) {
        var settings = $.extend(true, {
            remove : false,
            css : '',
            descricao : '',
            id_time : ''
        }, options);

        if ( settings.remove == false ) {
            return this.each(function() {
                switch ( settings.css ) {
                    case "erro":
                        settings.descricao = '<h3>S2I informa:</h3><span class="msg_fechar">X</span>' + settings.descricao;
                        break;
                    case "aviso":
                        settings.descricao = '<h3>S2I informa:</h3><span class="msg_fechar">X</span>' + settings.descricao;
                        break;
                    case "sucesso":
                        settings.descricao = '<h3>S2I informa:</h3><span class="msg_fechar">X</span>' + settings.descricao;
                        break;
                    default:
                }
                $('.msg').removeClass('aviso').removeClass('sucesso').removeClass('erro').hide();
                $(this).addClass('msg borda_redonda ' + settings.css);
                $(this).find('p').html(settings.descricao);
                $(this).fadeIn();

                $('.msg_fechar').bt({
                    icon : "ui-icon-circle-close",
                    title : "Fechar",
                    path : ""
                }).on('click', function() {
                    clearTimeout(settings.id_time);
                    $(this).closest('.msg').hide().removeClass().addClass('msg').find('p').html('');
                });

                settings.id_time = setTimeout(function() {
                    $('.msg').fadeOut().removeClass().addClass('msg').find('p').html('');
                }, 10000);

            });
        } else {
            return $('.msg').each(function() {
                clearTimeout(settings.id_time);
                $(this).hide().removeClass().addClass('msg').find('p').html('');
            });
        }
    };

    $.fn.table = function(options) {
        var obj = this;
        var _header = {
            title : '',
            type : '',
            order : '',
            edit : false,
            id : '',
            name : '',
            value : '',
            label : '',
            cls : ''
        };
        var params = {
            add_button : null,
            option : { },
            header : {
                0 : _header
            },
            _temp : function(objeto, params) {
                var d = new Date();
                return d.getTime();
            },
            _line : function(objeto, params, tipo) {
                var tmp = params._temp(objeto, params);
                var tr = '<tr>';
                $.each(params.header, function(a, w) {
                    var b = _header = {
                        title : (w.title == undefined ? '' : w.title),
                        type : (w.type == undefined ? '' : w.type),
                        order : (w.order == undefined ? '' : w.order),
                        edit : (w.edit == undefined ? false : w.edit),
                        id : (w.id == undefined ? '' : w.id),
                        name : (w.name == undefined ? '' : w.name),
                        value : (w.value == undefined ? '' : w.value),
                        label : (w.label == undefined ? '' : w.label),
                        cls : (w.cls == undefined ? '' : w.cls)
                    };
                    ;

                    if ( tipo == 'td' ) {
                        if ( b.edit == true ) {
                            switch ( b.type ) {
                                case 'textarea':
                                    tr += '<td id="' + b.id + '" ><textarea name="' + b.name.replace('{temp}', tmp) + '" class="' + b.cls + '">' + b.value + '</textarea></td>';
                                    break;
                                case 'radio':
                                    tr += '<td id="' + b.id + '" ><input type="' + b.type + '" name="' + b.name.replace('{temp}', tmp) + '" id="' + b.id + '_' + tmp + '" value="' + b.value + '" class="' + b.cls + '"/>' + b.label + '</td>';
                                    break;
                                case 'checkbox':
                                    tr += '<td id="' + b.id + '" ><input type="' + b.type + '" name="' + b.name.replace('{temp}', tmp) + '" id="' + b.id + '_' + tmp + '" value="' + b.value + '" class="' + b.cls + '"/>' + b.label + '</td>';
                                    break;
                                case 'select':
                                    tr += '<td id="' + b.id + '" ><select name="' + b.name.replace('{temp}', tmp) + '" id="' + b.id + '_' + tmp + '" class="' + b.cls + '">' + b.value + '</select></td>';
                                    break;
                                default:
                                    tr += '<td id="' + b.id + '" ><input type="' + b.type + '" name="' + b.name.replace('{temp}', tmp) + '" id="' + b.id + '_' + tmp + '" value="' + b.value + '" class="' + b.cls + '"/></td>';
                                    break;
                            }
                        } else {
                            tr += '<td id="' + b.id + '" class="' + b.cls + '">' + b.title + '</td>';
                        }
                    } else if ( tipo == 'th' ) {
                        tr += '<th id="' + b.id + '">' + b.title + '</th>';
                    }
                });
                if ( tipo == 'td' ) {
                    tr += '<td class="remover_table"><a class="bt_remover_table_tr"></a></td>';
                } else if ( tipo == 'th' ) {
                    tr += '<th class="remover_table">Ação</th>';
                }
                return tr + '</tr>'
            },
            _template : function(objeto, params) {
                //if ($(objeto).find('table').html() == '') {
                var tmp = '<table class="zebra">';
                tmp += '<thead>';
                tmp += '<tr>';
                tmp += params._line(objeto, params, 'th');
                tmp += '</tr>';
                tmp += '</thead>';
                tmp += '<tbody>';
                tmp += '<tr>';
                tmp += '</tr>';
                tmp += '</tbody>';
                tmp += '</table>';
                $(objeto).html(tmp);
            },
            add : function(objeto, params, event) {
                $(objeto).find('table tbody').prepend(params._line(objeto, params, 'td'));
            },
            _add : function(objeto, params, event) {
                $(objeto).find('table tbody').prepend(params._line(objeto, params, 'td'));
            },
            update : function(objeto, params) {

            },
            remove : function(objeto, params, event) {
                $(event).closest('tr').remove();
                return false;
            },
            _button : function(objeto, params) {
                $('.bt_remover_table_tr').bt({
                    icon : "ui-icon-circle-close",
                    text : "",
                    title : "Excluir",
                    path : ""
                }).on('click', function(e) {
                    e.preventDefault();
                    params.remove.call(null, objeto, params, this);
                    params._button(objeto, params);
                });
            }
        };

        var settings = $.extend(true, params, options);
        $(window).load(function() {
            settings._template(obj, settings);

            $(settings.add_button).on('click', function(e) {
                e.preventDefault();
                settings.add.call(null, obj, settings, this);
                settings._button(obj, settings);
                $('form').insere_mascara();
            });
            settings.update.call(null, obj, settings);
            settings._button(obj, settings);
            $('form').insere_mascara();
        });
    };

    $.fn.modal_load_combo = function(options) {
        return this.each(function() {
            var obj = this;
            var settings = $.extend(true, {
                obj : obj,
                title : null,
                width : 500,
                height : 200,
                load_modal : {
                    type : 'post',
                    dataType : 'html',
                    url : null,
                    data : {
                    }
                },
                gravar : {
                    type : 'post',
                    dataType : 'json',
                    url : null
                },
                atualiza_combo : {
                    type : 'post',
                    dataType : 'html',
                    url : null,
                    msg : '',
                    data : {
                    },
                    load : function(gravar, combo, settings) {

                    }
                }
            }, options);


            $(this).after('<button class="bt_add_modal_combo bt_add_modal_combo_' + $(this).attr('id') + '"></button>');
            $('.bt_add_modal_combo_' + $(this).attr('id')).bt({
                icon : "ui-icon-circle-plus",
                title : "Adicionar itens",
                path : ""
            }).on('click', function(e) {
                e.preventDefault();
                settings = $.extend(true, settings, options);

                var load_modal_data = '';
                $.each(settings.load_modal.data, function(a, b) {
                    if ( load_modal_data != '' ) {
                        load_modal_data += ', ';
                    }
                    load_modal_data += '"' + a + '":"' + $(b).val() + '"'
                });
                $.ajax({
                    type : settings.load_modal.type,
                    data : $.parseJSON('{' + load_modal_data + '}'),
                    dataType : settings.load_modal.dataType,
                    url : settings.load_modal.url,
                    success : function(b) {

                        $.modal({
                            html : b,
                            title : settings.title,
                            width : settings.width,
                            height : settings.height,
                            buttons : {
                                "Gravar" : function() {
                                    var form = $(this).find('form');
                                    if ( $(form).form_valida() == true ) {
                                        $(this).dialog('close');

                                        $.ajax({
                                            type : settings.gravar.type,
                                            data : $(form).serialize(),
                                            dataType : settings.gravar.dataType,
                                            url : settings.gravar.url,
                                            success : function(b) {
                                                load_modal_data = '';
                                                $.each(settings.atualiza_combo.data, function(a, b) {
                                                    if ( load_modal_data != '' ) {
                                                        load_modal_data += ', ';
                                                    }
                                                    load_modal_data += '"' + a + '":"' + $(b).val() + '"'
                                                });
                                                $.ajax({
                                                    type : settings.atualiza_combo.type,
                                                    data : $.parseJSON('{' + load_modal_data + '}'),
                                                    dataType : settings.atualiza_combo.dataType,
                                                    url : settings.atualiza_combo.url,
                                                    success : function(c) {
                                                        $(obj).html(c).val(b.id);
                                                        $('.msg_sucesso_combo').remove();
                                                        $(obj).next().after('<span class="msg_sucesso_combo">' + settings.gravar.msg + '</span>');
                                                        settings.atualiza_combo.load.call(null, b, c, settings);
                                                    }
                                                });
                                            }
                                        });
                                    }
                                },
                                "Fechar" : function() {
                                    $(this).dialog('close');
                                }
                            }
                        });
                    }
                });
            });
        });
    };

    $.fn.enterKey = function(fnc) {
        return this.each(function() {
            $(this).keypress(function(ev) {
                var keycode = (ev.keyCode ? ev.keyCode : ev.which);
                if ( keycode == '13' ) {
                    fnc.call(this, ev);
                }
            })
        })
    }

    $.modal = function(options) {

        var settings = $.extend(true, {
            html : '',
            title : '',
            width : '',
            height : '',
            buttons : { }
        }, options);

        $("#dialog-message").remove();

        if ( $("#dialog-message").length == 0 ) {
            $("body").append('<div id="dialog-message"><p></p></div>');
        }
        $("#dialog:ui-dialog").dialog("destroy");
        $("#dialog-message p").html(settings.html);
        $("#dialog-message").dialog({
            title : settings.title,
            modal : true,
            resizable : true,
            position : "center",
            width : settings.width,
            height : settings.height,
            buttons : settings.buttons
        });
    };


    $.fn.send = function(options) {
        var form_2 = (!$(this).attr('form') ? $(this).closest('form') : '#' + $(this).attr('form'));
        $(form_2).attr('onsubmit', false);
        $(this).on('click', function(e) {
            e.preventDefault();
            var settings = $.extend(true, {
                type : 'POST',
                dataType : 'json',
                modal : false,
                modal_options : {
                    title : '',
                    html : '',
                    width : 500,
                    height : 500
                },
                id_msg : '#msg',
                success : function(result, form, obj) {
                },
                error : function(result, form, obj) {
                },
                extra : function(result, form, obj) {
                }
            }, options);
            var $this = this;
            var form = (!$(this).attr('form') ? $(this).closest('form') : '#' + $(this).attr('form'));
            settings.extra.call(null, { }, form, $this);
            if ( settings.modal == true ) {
                $.modal({
                    html : settings.modal_options.html,
                    title : settings.modal_options.title,
                    width : settings.modal_options.width,
                    height : settings.modal_options.height,
                    buttons : {
                        'Não' : function() {
                            $(this).dialog("close");
                        },
                        'Sim' : function() {
                            $(this).dialog("close");
                            _send();
                        }
                    }
                });
            } else {
                _send();
            }

            function _send() {
                if ( $(form).form_valida() == true ) {
                    $.ajax({
                        type : settings.type,
                        data : $(form).serialize(),
                        dataType : settings.dataType,
                        url : $(form).attr('action'),
                        beforeSend : function() {
                            $(settings.id_msg).msg({
                                css : 'aviso',
                                descricao : 'Aguarde... Executando operação.'
                            });
                        },
                        success : function(b) {
                            if ( settings.dataType == 'json' ) {
                                var cssTipo = '';
                                if ( b.cod == 999 ) {
                                    cssTipo = 'sucesso';
                                    $(form).find('#' + $(form).attr('id_hidden')).val(b.id);
                                    $(form).find(':input').not(':button').removeClass('textoSucesso');
                                    $(form).attr('not_save', 'S');
                                } else {
                                    cssTipo = 'erro';
                                    $(form).color_campos_form({
                                        campos : b.campos
                                    });
                                }
                                $(settings.id_msg).msg({
                                    css : cssTipo,
                                    descricao : b.msg
                                });
                                settings.success.call(null, b, form, $this);
                            } else {
                                settings.success.call(null, b, form, $this);
                            }
                        }
                    });
                } else {
                    settings.error.call(null, { }, form, $this);
                }
            }
        });
    }

    $.fn.combos = function(options) {
        $(this).on('change', function(e) {
            e.preventDefault();
            var settings = $.extend(true, {
                url : '',
                alt : '',
                type : 'POST',
                posts : function(obj, options) {
                    return '';
                },
                success : function(result, obj, options) {
                },
                error : function(result, obj, options) {
                }
            }, options);
            var $this = this;
            if ( $.trim($(this).val()) != '' ) {
                $.ajax({
                    type : settings.type,
                    data : settings.posts.call(null, $this, options),
                    dataType : "html",
                    url : settings.url,
                    beforeSend : function() {
                        load_img($this, false);
                    },
                    success : function(b) {
                        load_img($this, true);
                        if ( settings.alt != '' ) {
                            $(settings.alt).html(b);
                        }
                        settings.success.call(null, b, $this, options);
                    },
                    error : function(b) {
                        load_img($this, true);
                        settings.error.call(null, b, $this, options);
                    }
                });
            }
        });
    }

    $.removerItem = function(options) {
        var settings = $.extend(true, {
            remove_tr : false,
            url : '',
            type : 'GET',
            dataType : 'json',
            id_msg : '#msg',
            modal_options : {
                title : 'CRM',
                msg : 'Deseja remover este registro?',
                width : 300,
                height : 200
            },
            posts : { },
            success : function(result, obj) {
            },
            error : function(result, obj) {
            }
        }, options);
        var $this = this;
        if ( $("#dialog-message").length == 0 ) {
            $("body").append('<div id="dialog-message"><p></p></div>');
        }
        $("#dialog:ui-dialog").dialog("destroy");
        $("#dialog-message p").html(settings.modal_options.msg);
        $("#dialog-message").dialog({
            title : settings.modal_options.title,
            modal : true,
            resizable : true,
            position : "center",
            width : settings.modal_options.width,
            height : settings.modal_options.height,
            buttons : {
                'Não' : function() {
                    $(this).dialog("close");
                },
                'Sim' : function() {
                    $(this).dialog("close");
                    $.ajax({
                        type : settings.type,
                        data : settings.posts,
                        dataType : settings.dataType,
                        url : settings.url,
                        beforeSend : function() {
                            $(settings.id_msg).msg({
                                css : 'aviso',
                                descricao : 'Aguarde... Executando operação.'
                            });
                        },
                        success : function(b) {
                            $(settings.id_msg).msg({
                                remove : true
                            });
                            if ( settings.remove_tr == true ) {
                                $($this).removeTr();
                            }
                            settings.success.call(null, b, $this);
                        },
                        error : function(b) {
                            $(settings.id_msg).msg({
                                remove : true
                            });
                            settings.error.call(null, b, $this);
                        }
                    });
                }
            }
        });
    }

})(jQuery);


String.prototype.replaceAll = function(de, para) {
    var str = this;
    var pos = str.indexOf(de);
    while ( pos > -1 ) {
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
        if ( lX4 & lY4 ) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if ( lX4 | lY4 ) {
            if ( lResult & 0x40000000 ) {
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
        while ( lByteCount < lMessageLength ) {
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
        for ( lCount = 0; lCount <= 3; lCount++ ) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            wordToHexValue_temp = "0" + lByte.toString(16);
            wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
        }
        return wordToHexValue;
    };

    var x = [ ],
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
    for ( k = 0; k < xl; k += 16 ) {
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

    if ( argString === null || typeof argString === "undefined" ) {
        return "";
    }

    var string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    var utftext = '',
            start, end, stringl = 0;

    start = end = 0;
    stringl = string.length;
    for ( var n = 0; n < stringl; n++ ) {
        var c1 = string.charCodeAt(n);
        var enc = null;

        if ( c1 < 128 ) {
            end++;
        } else if ( c1 > 127 && c1 < 2048 ) {
            enc = String.fromCharCode((c1 >> 6) | 192, (c1 & 63) | 128);
        } else {
            enc = String.fromCharCode((c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128);
        }
        if ( enc !== null ) {
            if ( end > start ) {
                utftext += string.slice(start, end);
            }
            utftext += enc;
            start = end = n + 1;
        }
    }

    if ( end > start ) {
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
        if ( typeof json === 'object' && typeof json.stringify === 'function' ) {
            retVal = json.stringify(mixed_val); // Errors will not be caught here if our own equivalent to resource
            //  (an instance of PHPJS_Resource) is used
            if ( retVal === undefined ) {
                throw new SyntaxError('json_encode');
            }
            return retVal;
        }

        var value = mixed_val;

        var quote = function(string) {
            var escapable = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
            var meta = { // table of character substitutions
                '\b' : '\\b',
                '\t' : '\\t',
                '\n' : '\\n',
                '\f' : '\\f',
                '\r' : '\\r',
                '"' : '\\"',
                '\\' : '\\\\'
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
            var partial = [ ];
            var value = holder[key];

            // If the value has a toJSON method, call it to obtain a replacement value.
            if ( value && typeof value === 'object' && typeof value.toJSON === 'function' ) {
                value = value.toJSON(key);
            }

            // What happens next depends on the value's type.
            switch ( typeof value ) {
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
                    if ( !value ) {
                        return 'null';
                    }
                    if ( (this.PHPJS_Resource && value instanceof this.PHPJS_Resource) || (window.PHPJS_Resource && value instanceof window.PHPJS_Resource) ) {
                        throw new SyntaxError('json_encode');
                    }

                    // Make an array to hold the partial results of stringifying this object value.
                    gap += indent;
                    partial = [ ];

                    // Is the value an array?
                    if ( Object.prototype.toString.apply(value) === '[object Array]' ) {
                        // The value is an array. Stringify every element. Use null as a placeholder
                        // for non-JSON values.
                        length = value.length;
                        for ( i = 0; i < length; i += 1 ) {
                            partial[i] = str(i, value) || 'null';
                        }

                        // Join all of the elements together, separated with commas, and wrap them in
                        // brackets.
                        v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
                        gap = mind;
                        return v;
                    }

                    // Iterate through all of the keys in the object.
                    for ( k in value ) {
                        if ( Object.hasOwnProperty.call(value, k) ) {
                            v = str(k, value);
                            if ( v ) {
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
            '' : value
        });

    } catch ( err ) { // Todo: ensure error handling above throws a SyntaxError in all cases where it could
        // (i.e., when the JSON global is not available and there is an error)
        if ( !(err instanceof SyntaxError) ) {
            throw new Error('Unexpected error type in json_encode()');
        }
        this.php_js = this.php_js || { };
        this.php_js.last_error_json = 4; // usable by json_last_error()
        return null;
    }
}