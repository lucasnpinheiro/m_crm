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

var _constant = {
    version: 1,
    vrprefix: 'crm_mobile_',
    titles: {
        aviso: 'CRM Mobile informa:',
        erro: 'CRM Mobile error:',
        sucesso: 'CRM Mobile informa:'
    },
    redirect: function(url) {
        window.location.href = url;
    }
};

var _situacoes = {
    clientes: {
        1: 'Ativo',
        2: 'Inativo',
        3: 'Bloqueado',
        4: 'Bloqueado pagamento',
        5: 'Cancelado'
    },
    sincronizacao: {
        1: 'Sincronizado',
        2: 'Error',
        3: 'Não sincronizado',
        4: 'Sincronizando',
        5: 'Cancelado'
    },
    produtos: {
        A: '<span class="situacoes_protutos_1">{0}</span>',
        B: '<span class="situacoes_protutos_2">{0}</span>',
        min: '<span class="situacoes_protutos_3">{0}</span>',
        max: '<span class="situacoes_protutos_4">{0}</span>',
    }
}