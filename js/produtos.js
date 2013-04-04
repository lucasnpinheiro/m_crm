$(document).on('pageinit', function() {
    $('form').insere_mascara();
});

function produtos_consultar_ultimos() {
    var query = 'SELECT * FROM produtos ORDER BY data_hora_atualizacao DESC LIMIT';

    db.transaction(function(tx) {
        tx.executeSql(query, [], function(tx, result) {
            debug('SUCESSO', query);
            debug('TOTAL', result.rows.length);
            if (result.rows.length != 0) {
                debug('SUSSESO', 'ID Usuário: ' + result.rows.item(0).id_usuarios);
                _session.set('id_usuarios', result.rows.item(0).id_usuarios);
                _session.set('usuario', result.rows.item(0).usuario);
                _constant.redirect('painel.html');
            } else {
                jAviso('Usuário e/ou senha invalidos.');
                insert_usuarios(usuario, senha);
            }
        }, function(tx, result) {
            debug('ERROR', result.message);
        });
    });
}