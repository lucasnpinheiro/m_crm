var tcount = new TimeCounter();
$(document).on('pageinit', function() {
    onDeviceReady();
    document.addEventListener("deviceready", onDeviceReady, false);
    _sincronicacao.produtos.total();

    $('a.reload').on('click', function() {
        var acao = $(this).closest('tr').attr('id');

        switch (acao) {
            case 'tr_produtos':
                _sincronicacao.produtos.lista();
                break;
            case 'tr_clientes':
                break;
            case 'tr_usuarios':
                break;
            case 'tr_pedidos':
                break;
        }
    });
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
                        _sincronicacao.produtos.error();
                    }
                });
            } else {
                _sincronicacao.produtos.error();
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
                        _sincronicacao.produtos.error();
                    }
                });
            } else {
                _sincronicacao.produtos.error();
                jAviso('Sem conexão "' + _sincronicacao.conexao.nome + '"');
            }
        },
        error: function() {
            _sincronicacao.fim();
            $('#tr_produtos td:eq(3)').html('<b class="ui-table-cell-label">Situação</b> <span class="situacoes_sincronizacao_2">Error</span>');
            $('#tr_produtos td:eq(4)').html('<b class="ui-table-cell-label">Ação</b> <a href="#" class="reload" data-role="button" data-icon="refresh" data-iconpos="notext" data-theme="c" data-inline="true">Recarregar</a>');
            $('a.reload').button('refresh');
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
    if (!navigator.connection) {
        _sincronicacao.produtos.qtdPaginacao = 500;
        _sincronicacao.conexao.status = true;
        _sincronicacao.conexao.nome = 'Conexão desconhecida';
    } else {
        var networkState = navigator.connection.type;

        var states = {};
        states[Connection.UNKNOWN] = 'Conexão desconhecida';
        states[Connection.ETHERNET] = 'Conexão Ethernet';
        states[Connection.WIFI] = 'Conexão Wi-Fi';
        states[Connection.CELL_2G] = 'Conexão 2G celular';
        states[Connection.CELL_3G] = 'Conexão 3G celular';
        states[Connection.CELL_4G] = 'Conexão 4G celular';
        states[Connection.NONE] = 'Sem ligação à rede';

        _sincronicacao.conexao.nome = states[networkState];

        switch (states[networkState])
        {
            case 'Conexão desconhecida':
            case 'Sem ligação à rede':
                _sincronicacao.produtos.qtdPaginacao = 0;
                _sincronicacao.conexao.status = false;
                break;
            case 'Conexão 3G celular':
                _sincronicacao.produtos.qtdPaginacao = 40;
                _sincronicacao.conexao.status = true;
                break;
            case 'Conexão 4G celular':
            case 'Conexão Wi-Fi':
                _sincronicacao.produtos.qtdPaginacao = 100;
                _sincronicacao.conexao.status = true;
                break;
            default:
                _sincronicacao.produtos.qtdPaginacao = 25;
                _sincronicacao.conexao.status = true;
        }
    }
}