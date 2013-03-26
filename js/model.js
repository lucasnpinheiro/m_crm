var base_url = window.location.hostname;
base_url = 'http://' + base_url + (base_url != 'm.crm.s2i.com.br' ? '/crm_mobile/' : '/');

if ( window.openDatabase ) {
    // conexão
    var db = window.openDatabase("crm_mobile", "", "CRM MOBILE", 5 * 1000 * 1000);

    // tabelas

    var tabelas = [
        /*{ tbl : "DROP TABLE IF EXISTS logs" },
         { tbl : "DROP TABLE IF EXISTS equipamento" },
         { tbl : "DROP TABLE IF EXISTS empresas" },
         { tbl : "DROP TABLE IF EXISTS equipamentos" },
         { tbl : "DROP TABLE IF EXISTS clientes" },
         { tbl : "DROP TABLE IF EXISTS produtos" },
         { tbl : "DROP TABLE IF EXISTS usuarios" },
         { tbl : "DROP TABLE IF EXISTS pedidos" },
         { tbl : "DROP TABLE IF EXISTS pedidos_itens" },
         { tbl : "DROP TABLE IF EXISTS sqlite_sequence" },*/
        { tbl : "CREATE TABLE IF NOT EXISTS empresas ( id_empresas INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, dsc_hash VARCHAR(10) NOT NULL , cpf_cnpj VARCHAR(14) NOT NULL , dsc_empresa VARCHAR(50) NOT NULL , data_hora_cadastro DATETIME NULL , data_hora_exclusao DATETIME NULL )" },
        { tbl : "CREATE TABLE IF NOT EXISTS empresas_chaves ( id_empresas_chaves INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, id_empresas INTEGER NOT NULL, dsc_chave VARCHAR(10) NULL , id_equipamentosNULL)" },
        { tbl : "CREATE TABLE IF NOT EXISTS equipamentos ( id_equipamentos INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, id_empresas INTEGER NOT NULL, imei VARCHAR(100) NULL)" },
        { tbl : "CREATE TABLE IF NOT EXISTS clientes ( id_clientes INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, id_empresas INTEGER NOT NULL, cod_cliente VARCHAR(50) NOT NULL , dsc_cliente VARCHAR(45) NOT NULL , data_hora_atualizacao DATETIME NULL , data_hora_exclusao DATETIME NULL)" },
        { tbl : "CREATE TABLE IF NOT EXISTS produtos ( id_produtos INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, id_empresas INTEGER NOT NULL, cod_produto VARCHAR(50) NOT NULL , dsc_produto VARCHAR(100) NOT NULL , estoque DECIMAL(10,5) NULL DEFAULT 0 , desconto_maximo DECIMAL(10,2) NULL DEFAULT 0 , data_hora_atualizacao DATETIME NULL , data_hora_exclusao DATETIME NULL)" },
        { tbl : "CREATE TABLE IF NOT EXISTS usuarios ( id_usuarios INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, id_empresas INTEGER NOT NULL, cod_usuario VARCHAR(50) NOT NULL , dsc_usuario VARCHAR(50) NULL , nome VARCHAR(50) NOT NULL , senha VARCHAR(32) NOT NULL , data_hora_atualizacao DATETIME NULL , data_hora_exclusao DATETIME NULL)" },
        { tbl : "CREATE TABLE IF NOT EXISTS pedidos ( id_pedidos INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, id_empresas INTEGER NOT NULL, id_clientes INTEGER NOT NULL, id_equipamentos INTEGER NOT NULL, id_usuarios INTEGER NOT NULL, data_hora_cadastro DATETIME NOT NULL , data_hora_finalizacao DATETIME NOT NULL , data_hora_envio DATETIME NULL , data_hora_transmissao DATETIME NULL , data_hora_exclusao DATETIME NULL , observacao VARCHAR(255) NULL)" },
        { tbl : "CREATE TABLE IF NOT EXISTS pedidos_itens ( id_pedidos_itens INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, id_pedidos INTEGER NOT NULL, id_produtos INTEGER NOT NULL, data_hora_cadastro DATETIME NOT NULL , quantidade VARCHAR(45) NOT NULL , valor_unitario VARCHAR(45) NOT NULL , data_hora_exclusao DATETIME NULL)" }
    ];

    $.each(tabelas, function(a, b) {

        db.transaction(function(tx) {
            tx.executeSql(b.tbl, [ ], function(tx, result) {
                debug('SUCESSO', b.tbl);
            }, function(tx, result) {
                debug('ERROR', result.message);
            });
        });
    });

    function debug(tipo, msg) {
        var d = new Date();
        console.log(tipo + ' ' + d.getDay() + '/' + d.getMonth() + '/' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + "\n" + ' Mesagem: "' + msg + '" ' + "\n\n\n");
    }

} else {
    alert('Navegador sem suporte ao banco de dados SqLite.');
}


$('#frm_login :submit').click(function(e){
    e.preventDefault();
    alert($(this).closest('form').serialize());
});