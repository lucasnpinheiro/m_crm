$(document).on('pageinit', function() {
    var i = 0;
    $('table#table-consulta-pedidos tbody tr').each(function() {
        i++;
        if (i > 5) {
            i = 0;
        }
        $(this).find("td:eq(3)").html('<b class="ui-table-cell-label">Situação</b><span class="situacoes_pedido_' + i + '">' + _situacoes.pedido[i] + '</span>');
    });
    $.each(_situacoes.sincronizacao, function(a, b) {
        $('#situacao_envio').append('<option value="' + a + '">' + b + '</option>');
    });
    $.each(_situacoes.pedido, function(a, b) {
        $('#situacao_pedido').append('<option value="' + a + '">' + b + '</option>');
    });
    $('form').insere_mascara();
});