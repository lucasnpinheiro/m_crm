var tcount = new TimeCounter();
$(document).on('pageinit', function() {
    document.addEventListener("deviceready", onDeviceReady, false);
    _sincronicacao.produtos.total();
});

_sincronicacao = {
    conexao: {
        nome: '',
        status: false
    },
    produtos: {
        qtdPaginacao: 50,
        qtdAtual: 0,
        qtdMax: 0,
        sequencia: 0,
        insert: function(result) {
            var i = 0;
            var total = result.length;
            $.each(result, function(a, b) {
                var query = 'INSERT OR REPLACE INTO produtos (id_produtos, cod_produto, dsc_produto, desconto_maximo, data_hora_atualizacao, estoque, valor, id_empresas) VALUES ("' + b.id_produtos + '","' + b.cod_produto + '","' + b.dsc_produto + '","' + b.desconto_maximo + '","' + date('Y-m-d H:i:s') + '","' + b.estoque + '",' + b.valor + ',"' + b.id_empresas + '");';
                debug('QUERY', query);
                db.transaction(function(tx) {
                    tx.executeSql(query, [],
                            function() {
                                i++;
                                _sincronicacao.produtos.sequencia++;
                                $('#tr_produtos td:eq(1)').html('<b class="ui-table-cell-label">Total sincronizado</b> ' + _sincronicacao.produtos.sequencia);
                                if (i == total) {
                                    $('#tr_produtos td:eq(3)').html('<b class="ui-table-cell-label">Situação</b> <span class="situacoes_sincronizacao_1">Sincronizado</span>');
                                    if (_sincronicacao.produtos.qtdAtual < _sincronicacao.produtos.qtdMax) {
                                        _sincronicacao.produtos.lista();
                                    } else {
                                        _sincronicacao.fim();
                                    }
                                }
                            },
                            function(tx, r) {
                                $('#tr_produtos td:eq(3)').html('<b class="ui-table-cell-label">Situação</b> <span class="situacoes_sincronizacao_2">Error</span>');
                                debug('ERROR', r.message);
                                _sincronicacao.fim();
                            });
                });
            });
        },
        total: function() {
            if (_sincronicacao.conexao.status == true) {
                $.ajax({
                    url: _situacoes.urls.produtos_total,
                    dataType: 'html',
                    type: 'GET',
                    beforeSend: function() {
                        tcount.start();
                        block(false);
                        $('#tr_produtos td:eq(2)').html('<b class="ui-table-cell-label">Total registro</b> 0');
                    },
                    success: function(result) {
                        $('#tr_produtos td:eq(2)').html('<b class="ui-table-cell-label">Total registro</b> ' + result);
                        $('#tr_produtos td:eq(0)').html('<b class="ui-table-cell-label">Atualização</b> ' + date('d/m/Y H:i:s'));
                        _sincronicacao.produtos.qtdMax = result;
                        _sincronicacao.produtos.lista();
                    },
                    error: function() {
                        $('#tr_produtos td:eq(3)').html('<b class="ui-table-cell-label">Situação</b> <span class="situacoes_sincronizacao_2">Error</span>');
                        _sincronicacao.fim();
                    }
                });
            } else {
                _sincronicacao.fim();
                jAviso('Sem conexão "' + _sincronicacao.conexao.nome + '"');
            }
        },
        lista: function() {
            if (_sincronicacao.conexao.status == true) {
                $.ajax({
                    url: _situacoes.urls.produtos_lista,
                    dataType: 'json',
                    type: 'GET',
                    data: {
                        inicio: _sincronicacao.produtos.sequencia + 1,
                        qtde: _sincronicacao.produtos.qtdPaginacao
                    },
                    beforeSend: function() {
                        $('#tr_produtos td:eq(1)').html('<b class="ui-table-cell-label">Total sincronizado</b> ' + _sincronicacao.produtos.qtdAtual);
                        $('#tr_produtos td:eq(3)').html('<b class="ui-table-cell-label">Situação</b> <span class="situacoes_sincronizacao_4">Sincronizando</span>');
                    },
                    success: function(result) {
                        var total = result.length;
                        if (total > 0) {
                            _sincronicacao.produtos.qtdAtual += total;
                            _sincronicacao.produtos.insert(result);
                        } else {
                            _sincronicacao.produtos.sequencia++;
                            $('#tr_produtos td:eq(1)').html('<b class="ui-table-cell-label">Total sincronizado</b> ' + _sincronicacao.produtos.sequencia);
                            _sincronicacao.fim();
                        }
                    },
                    error: function() {
                        $('#tr_produtos td:eq(3)').html('<b class="ui-table-cell-label">Situação</b> <span class="situacoes_sincronizacao_2">Error</span>');
                        _sincronicacao.fim();
                    }
                });
            } else {
                _sincronicacao.fim();
                jAviso('Sem conexão "' + _sincronicacao.conexao.nome + '"');
            }
        }
    },
    fim: function() {
        block(true);
        jAviso('Tempo decorrido para a atualização da tabela de produtos ' + tcount.stop() + ' segundos.');
    }
};




// Cordova is loaded and it is now safe to make calls Cordova methods
//
function onDeviceReady() {
    checkConnection();
}

function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.NONE] = 'No network connection';

    _sincronicacao.conexao.nome = states[networkState];

    switch (states[networkState])
    {
        case 'Unknown connection':
        case 'No network connection':
            _sincronicacao.produtos.qtdPaginacao = 0;
            _sincronicacao.conexao.status = false;
            break;
        case 'Cell 3G connection':
            _sincronicacao.produtos.qtdPaginacao = 40;
            _sincronicacao.conexao.status = true;
            break;
        case 'Cell 4G connection':
        case 'WiFi connection':
            _sincronicacao.produtos.qtdPaginacao = 100;
            _sincronicacao.conexao.status = true;
            break;
        default:
            _sincronicacao.produtos.qtdPaginacao = 25;
            _sincronicacao.conexao.status = true;
    }
}