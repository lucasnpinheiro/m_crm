// verifica suporte ao banco de dados.
if (db != null) {

    function verificar_tabelas() {
        // tabelas
        var tabelas = [
            {
                tbl: "DROP TABLE IF EXISTS logs"
            },
            {
                tbl: "DROP TABLE IF EXISTS equipamento"
            },
            {
                tbl: "DROP TABLE IF EXISTS empresas"
            },
            {
                tbl: "DROP TABLE IF EXISTS equipamentos"
            },
            {
                tbl: "DROP TABLE IF EXISTS clientes"
            },
            {
                tbl: "DROP TABLE IF EXISTS produtos"
            },
            {
                tbl: "DROP TABLE IF EXISTS usuarios"
            },
            {
                tbl: "DROP TABLE IF EXISTS pedidos"
            },
            {
                tbl: "DROP TABLE IF EXISTS pedidos_itens"
            },
            {
                tbl: "DROP TABLE IF EXISTS sqlite_sequence"
            },
            {
                tbl: "CREATE TABLE IF NOT EXISTS empresas ( id_empresas INTEGER PRIMARY KEY AUTOINCREMENT, dsc_hash VARCHAR(10) , cpf_cnpj VARCHAR(14) , dsc_empresa VARCHAR(50) , data_hora_cadastro TEXT   , data_hora_exclusao TEXT   )"
            },
            {
                tbl: "CREATE TABLE IF NOT EXISTS empresas_chaves ( id_empresas_chaves INTEGER PRIMARY KEY AUTOINCREMENT, id_empresas INTEGER , dsc_chave VARCHAR(10)  , id_equipamentos)"
            },
            {
                tbl: "CREATE TABLE IF NOT EXISTS equipamentos ( id_equipamentos INTEGER PRIMARY KEY AUTOINCREMENT, id_empresas INTEGER , imei VARCHAR(100) )"
            },
            {
                tbl: "CREATE TABLE IF NOT EXISTS clientes ( id_clientes INTEGER PRIMARY KEY AUTOINCREMENT, id_empresas INTEGER , cod_cliente VARCHAR(50) , dsc_cliente VARCHAR(45) , data_hora_atualizacao TEXT   , data_hora_exclusao TEXT  )"
            },
            {
                tbl: "CREATE TABLE IF NOT EXISTS produtos ( id_produtos INTEGER PRIMARY KEY AUTOINCREMENT, id_empresas INTEGER , cod_produto VARCHAR(50) , dsc_produto VARCHAR(100) , estoque REAL (10,5)  DEFAULT 0 , desconto_maximo REAL (10,2)  DEFAULT 0 , data_hora_atualizacao TEXT   , valor REAL (10,2) )"
            },
            {
                tbl: "CREATE TABLE IF NOT EXISTS usuarios ( id_usuarios INTEGER PRIMARY KEY AUTOINCREMENT, id_empresas INTEGER , cod_usuario VARCHAR(50) , dsc_usuario VARCHAR(50)  , usuario VARCHAR(50) , nome VARCHAR(50) , senha VARCHAR(32) , data_hora_atualizacao TEXT   , data_hora_exclusao TEXT  )"
            },
            {
                tbl: "CREATE TABLE IF NOT EXISTS pedidos ( id_pedidos INTEGER PRIMARY KEY AUTOINCREMENT, id_empresas INTEGER , id_clientes INTEGER , id_equipamentos INTEGER , id_usuarios INTEGER , data_hora_cadastro TEXT  , data_hora_finalizacao TEXT  , data_hora_envio TEXT   , data_hora_transmissao TEXT   , data_hora_exclusao TEXT   , observacao VARCHAR(255) )"
            },
            {
                tbl: "CREATE TABLE IF NOT EXISTS pedidos_itens ( id_pedidos_itens INTEGER PRIMARY KEY AUTOINCREMENT, id_pedidos INTEGER , id_produtos INTEGER , data_hora_cadastro TEXT  , quantidade VARCHAR(45) , valor_unitario VARCHAR(45) , data_hora_exclusao TEXT  )"
            }
        ];

        $.each(tabelas, function(a, b) {
            db.transaction(function(tx) {
                tx.executeSql(b.tbl, [], function(tx, result) {
                    debug('SUCESSO', b.tbl);
                    if(a == (tabelas.length -1)){
                        jSucesso('Por favor logar novamente.');
                    }
                }, function(tx, result) {
                    debug('ERROR', result.message);
                });
            });
        });

    }
}
