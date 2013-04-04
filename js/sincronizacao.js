var tcount = new TimeCounter();
$(document).on('pageinit', function() {
    tcount.start();
    block(false);
    _sincronicacao.produtos.total();
});

_sincronicacao = {
    produtos: {
        qtdAtual: 0,
        qtdMax: 0,
        sequencia: 0,
        insert: function(result) {
            var i = 0;
            var total = result.length;
            $.each(result, function(a, b) {
                var query = 'INSERT INTO produtos (id_produtos, cod_produto, dsc_produto, desconto_maximo, data_hora_atualizacao, estoque, valor, id_empresas) VALUES ("' + b.id_produtos + '","' + b.cod_produto + '","' + b.dsc_produto + '","' + b.desconto_maximo + '","' + date('Y-m-d H:i:s') + '","' + b.estoque + '",' + b.valor + ',"' + b.id_empresas + '");';
                debug('QUERY', query);
                db.transaction(function(tx) {
                    tx.executeSql(query, [],
                            function() {
                                i++;
                                $('#tr_produtos td:eq(1)').html('<b class="ui-table-cell-label">Total sincronizado</b> ' + i);
                                if (i == total) {
                                    $('#tr_produtos td:eq(3)').html('<b class="ui-table-cell-label">Situação</b> <span class="situacoes_sincronizacao_1">Sincronizado</span>');
                                    _sincronicacao.produtos.sequencia += 1;
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
            $.ajax({
                url: _situacoes.urls.produtos_total,
                dataType: 'html',
                type: 'GET',
                beforeSend: function() {
                    $('#tr_produtos td:eq(2)').html('<b class="ui-table-cell-label">Total registro</b> 0');
                },
                success: function(result) {
                    $('#tr_produtos td:eq(2)').html('<b class="ui-table-cell-label">Total registro</b> ' + result);
                    $('#tr_produtos td:eq(0)').html('<b class="ui-table-cell-label">Atualização</b> ' + date('d/m/Y H:i:s'));
                    _sincronicacao.produtos.lista();
                    _sincronicacao.produtos.sequencia = 0;
                    _sincronicacao.produtos.qtdMax = result;
                },
                error: function() {
                    $('#tr_produtos td:eq(3)').html('<b class="ui-table-cell-label">Situação</b> <span class="situacoes_sincronizacao_2">Error</span>');
                    _sincronicacao.fim();
                }
            });
        },
        lista: function() {
            $.ajax({
                url: _situacoes.urls.produtos_lista,
                dataType: 'json',
                type: 'GET',
                beforeSend: function() {
                    $('#tr_produtos td:eq(1)').html('<b class="ui-table-cell-label">Total sincronizado</b> 0');
                    $('#tr_produtos td:eq(3)').html('<b class="ui-table-cell-label">Situação</b> <span class="situacoes_sincronizacao_4">Sincronizando</span>');
                },
                success: function(result) {
                    var i = 0;
                    var total = result.length;
                    _sincronicacao.produtos.qtdAtual += total;
                    if (total != 0) {
                        if (_sincronicacao.produtos.sequencia == 0) {
                            var query = 'DELETE FROM produtos;';
                            debug('QUERY', query);
                            db.transaction(function(tx) {
                                tx.executeSql(query, [],
                                        function() {
                                            $('#tr_produtos td:eq(1)').html('<b class="ui-table-cell-label">Total sincronizado</b> ' + i);
                                            debug('SUCCESS', 'Insert OK');
                                            _sincronicacao.produtos.insert(result);
                                        },
                                        function(tx, r) {
                                            debug('ERROR', r.message);
                                        });
                            });
                        } else {
                            _sincronicacao.produtos.insert(result);
                        }
                    }
                },
                error: function() {
                    $('#tr_produtos td:eq(3)').html('<b class="ui-table-cell-label">Situação</b> <span class="situacoes_sincronizacao_2">Error</span>');
                    _sincronicacao.fim();
                }
            });
        }
    },
    fim: function() {
        block(true);
        jAviso('Tempo decorrido para a atualização ' + tcount.stop() + ' Segundos.');
    }
};
