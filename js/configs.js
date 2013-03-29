var _constant = {
    version: 1,
    vrprefix: 'crm_mobile_',
    titles: {
        aviso: 'CRM Mobile informa:',
        erro: 'CRM Mobile error:',
        sucesso: 'CRM Mobile informa:'
    },
    base_url: function(url) {
        var base_url = window.location.hostname;
        return  base_url = 'http://' + base_url + (base_url != 'm.crm.s2i.com.br' ? '/crm_mobile/' : '/') + (url != undefined ? url : '');
    },
    redirect: function(url) {
        window.location.href = _constant.base_url(url);
    }
};

$(document).bind("mobileinit", function() {
    $.mobile.ajaxEnabled = false;
});