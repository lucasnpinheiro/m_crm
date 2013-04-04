var _situacoes = {
    urls: {
        produtos_total: 'http://s2i.com.br:8084/WsCrmMobile/produtos/registros/',
        produtos_lista: 'http://s2i.com.br:8084/WsCrmMobile/produtos'
    },
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
        1: '<span class="situacoes_protutos_1">{0}</span>',
        2: '<span class="situacoes_protutos_2">{0}</span>',
        min: '<span class="situacoes_protutos_3">{0}</span>',
        max: '<span class="situacoes_protutos_4">{0}</span>',
    }
}

// conexão com o banco de dados local
var db = null;
if (window.openDatabase) {
    var db = window.openDatabase("crm_mobile", "", "CRM MOBILE", 5 * 1000 * 1000);
} else {
    jAviso('Navegador sem suporte ao banco de dados SqLite.');
}

$(document).bind("mobileinit", function() {
    $.extend($.mobile, {
        ajaxEnabled: false,
        touchOverflowEnabled: false,
        defaultPageTransition: 'none',
        defaultDialogTransition: 'none',
        loadingMessage: 'Carregando...',
        buttonMarkup: {hoverDelay: 0}
    });
});