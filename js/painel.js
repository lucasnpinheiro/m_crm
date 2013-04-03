$(document).on('pageinit', function() {

    if (_session.get('usuario') != "" || _session.get('usuario') != undefined) {
        $('.crm_mobile_atutenticacao').html('Usuário: ' + _session.get('usuario'));
    }
    $('.logout').click(function(e) {
        e.preventDefault();
        _session.remove('reset_banco');
        _session.remove('usuario');
        _session.remove('id_usuario');
        _constant.redirect('index.html');
    });
});