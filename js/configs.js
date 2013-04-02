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
    pedido: {
        1: 'Aguardando',
        2: 'Enviado',
        3: 'Error',
        4: 'Cancelado',
        5: 'Aberto'
    },
    produtos: {
        A: '<span class="situacoes_protutos_1">{0}</span>',
        B: '<span class="situacoes_protutos_2">{0}</span>',
        min: '<span class="situacoes_protutos_3">{0}</span>',
        max: '<span class="situacoes_protutos_4">{0}</span>',
    }
}

$(document).on('pageinit', function() {
    $('table#table-produtos tbody tr').each(function() {
        var t = _situacoes.produtos.A.format(Math.floor((Math.random() * 100) + 1));
        $(this).find("td:eq(2)").html('<b class="ui-table-cell-label">Estoque</b>' + _situacoes.produtos.A.format(t));
    });
    $('table#table-consulta-pedidos tbody tr').each(function() {
        var t = Math.floor(Math.random() * 6);
        t = (t < 1 ? 1 : t);
        $(this).find("td:eq(3)").html('<b class="ui-table-cell-label">Situação</b><span class="situacoes_pedido_' + t + '">' + _situacoes.pedido[t] + '</span>');
    });
    $.each(_situacoes.sincronizacao, function(a, b) {
        $('#situacao_envio').append('<option value="' + a + '">' + b + '</option>');
    });
    $.each(_situacoes.pedido, function(a, b) {
        $('#situacao_pedido').append('<option value="' + a + '">' + b + '</option>');
    });
    $('form').insere_mascara();
});

// handling document ready and phonegap deviceready
window.addEventListener('load', function() {
    document.addEventListener('deviceready', onDeviceReady, false);
}, false);

// Phonegap is loaded and can be used
function onDeviceReady() {
    getDeviceInfo();
}

// get device info
function getDeviceInfo() {
    $.each(device,function(a,b){
        alert(a + ' === '+ b);
    });
//    $('#devName').text(device.name);
//    $('#devPlatform').text(device.platform);
//    $('#devUUID').text(device.uuid);
//    $('#devVersion').text(device.version);
    $('#devPhonegap').text(device.phonegap);
}