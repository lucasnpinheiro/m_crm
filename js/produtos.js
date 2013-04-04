$(document).on('pageinit', function() {
    produtos_consultar_ultimos();
    $('form').insere_mascara();
    $('#bt_consultar_produtos').on('click', function(e) {
        e.preventDefault();
        if ($.trim($('#search').val()) != '') {
            var query = 'SELECT * FROM produtos WHERE dsc_produto LIKE "%' + $('#search').val() + '%" OR cod_produto LIKE "%' + $('#search').val() + '%"';
            _produtos_consultar(query);
        } else {
            jAviso('Informe o nome produto ou código do produto.');
        }
    });
});

function produtos_consultar_ultimos() {
    var query = 'SELECT * FROM produtos ORDER BY data_hora_atualizacao DESC LIMIT 10';
    _produtos_consultar(query);
}

function _produtos_consultar(query) {
    $('#table-produtos tbody').html('');
    db.transaction(function(tx) {
        tx.executeSql(query, [], function(tx, result) {
            debug('SUCESSO', query);
            debug('TOTAL', result.rows.length);
            if (result.rows.length == 0) {
                jAviso('Nenum registro localizado.');
            } else {
                for (var i = 0; i < result.rows.length; i++) {
                    var rest = result.rows.item(i);
                    var tr = '<tr>';
                    tr += ' <th><b class="ui-table-cell-label">Produto</b>' + rest.dsc_produto + '</th>';
                    tr += ' <td><b class="ui-table-cell-label">Cód.</b>' + rest.cod_produto + '</td>';
                    tr += ' <td><b class="ui-table-cell-label">Marca</b>Não informado</td>';
                    tr += ' <td><b class="ui-table-cell-label">Estoque</b><span class="situacoes_protutos_1"><span class="situacoes_protutos_1">' + rest.estoque + '</span></span></td>';
                    tr += ' <td><b class="ui-table-cell-label">Valores</b><span class="situacoes_produtos_3">R$ ' + number_format(rest.valor, 2, ',', '.') + ' </span> | <span class="situacoes_produtos_4">R$ ' + number_format(rest.desconto_maximo, 2, ',', '.') + '</span></td>';
                    tr += ' <td><b class="ui-table-cell-label">Atualização</b>' + date('d/m/Y H:i:s', new Date(rest.data_hora_atualizacao)) + '</td>';
                    tr += '</tr>';
                    $('#table-produtos tbody').append(tr);
                }
            }
        }, function(tx, result) {
            debug('ERROR', result.message);
        });
    });
}