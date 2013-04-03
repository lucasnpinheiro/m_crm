$(document).on('pageinit', function() {
    $('table#table-consulta-pedidos tbody tr').each(function() {
        var t = Math.floor(Math.random() * 6);
        t = (t < 1 ? 1 : t);
        $(this).find("td:eq(3)").html('<b class="ui-table-cell-label">Situação</b><span class="situacoes_pedido_' + t + '">' + _situacoes.pedido[t] + '</span>');
    });
    $.each(_situacoes.sincronizacao, function(a, b) {
        $('#situacao_envio').append('<option value="' + a + '">' + b + '</option>');
    });
    $.each(_situacoes.pedido, function(a, b) {
        $('#situacao_pedido').append('<option value="' + a + '">' + b + '</option>');
    });
    $('form').insere_mascara();
});