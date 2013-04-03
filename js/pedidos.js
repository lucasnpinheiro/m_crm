$(document).on('pageinit', function() {
    var i = 0;
    $('table#table-consulta-pedidos tbody tr').each(function() {
        i++;
        if (i > 5) {
            i = 1;
        }
        $(this).find("td:eq(3)").html('<b class="ui-table-cell-label">Situação</b><span class="situacoes_pedido_' + i + '">' + _situacoes.pedido[i] + '</span>');
    });
    $('form').insere_mascara();
});