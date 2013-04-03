$(document).on('pageinit', function() {
    $('table#table-produtos tbody tr').each(function() {
        var t = _situacoes.produtos.A.format(Math.floor((Math.random() * 100) + 1));
        $(this).find("td:eq(2)").html('<b class="ui-table-cell-label">Estoque</b>' + _situacoes.produtos.A.format(t));
    });
    $('form').insere_mascara();
});