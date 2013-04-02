// verifica suporte ao banco de dados.
if (window.openDatabase) {
    // conexão
    var db = window.openDatabase("crm_mobile", "", "CRM MOBILE", 5 * 1000 * 1000);

    if (_session.get('reset_banco') == 'N') {
        verificar_tabelas();
        _session.set('reset_banco', 'S');
    } else {
        _session.set('reset_banco', 'N');
    }

    $(document).ready(function() {

        $('#frm_login :submit').click(function(e) {
            e.preventDefault();
            var usuario = $(this).closest('form').find('#usuario').val();
            var senha = $(this).closest('form').find('#senha').val();

            var query = 'SELECT * FROM usuarios WHERE usuario="' + usuario + '" AND  senha="' + md5(senha) + '"';

            db.transaction(function(tx) {
                tx.executeSql(query, [], function(tx, result) {
                    debug('SUCESSO', query);
                    debug('TOTAL', result.rows.length);
                    if (result.rows.length != 0) {
                        debug('SUSSESO', 'ID Usuário: ' + result.rows.item(0).id_usuarios);
                        _session.set('id_usuarios', result.rows.item(0).id_usuarios);
                        _session.set('usuario', result.rows.item(0).usuario);
                        _constant.redirect('painel.html');
                    } else {
                        jAviso('Usuário e/ou senha invalidos.');
                        insert_usuarios(usuario, senha);
                    }
                }, function(tx, result) {
                    debug('ERROR', result.message);
                });
            });
        });

        if (_session.get('usuario') != "" || _session.get('usuario') != undefined) {
            $('.crm_mobile_atutenticacao').html('Usuário: ' + _session.get('usuario'));
        }
        $('.logout').click(function(e) {
            e.preventDefault();
            _session.remove('reset_banco');
            _session.remove('usuario');
            _session.remove('id_usuario');
            _constant.redirect('index.html');
        });
    });

    function insert_usuarios(usuario, senha) {
        var query = 'INSERT INTO usuarios (id_empresas, cod_usuario, dsc_usuario, usuario, nome, senha) VALUES (1, "123", "Lucas Pinheiro", "' + usuario + '", "Lucas Teste",  "' + md5(senha) + '");';
        db.transaction(function(tx) {
            tx.executeSql(query, [], function(tx, result) {
                debug('SUCESSO', query);
                debug('TOTAL', result.rows.length);
                if (result.rows.length != 0) {
                    debug('TOTAL', result.rows.item(0).id_usuarios);
                    jAviso('Usuário cadastrado com sucesso.');
                } else {
                    jAviso('Não foi possivel cadastrar o usuário.');
                }
            }, function(tx, result) {
                debug('ERROR', result.message);
            });
        });
    }



    function verificar_tabelas() {
        // tabelas
        var tabelas = [
            /*{
             tbl : "DROP TABLE IF EXISTS logs"
             },
             {
             tbl : "DROP TABLE IF EXISTS equipamento"
             },
             {
             tbl : "DROP TABLE IF EXISTS empresas"
             },
             {
             tbl : "DROP TABLE IF EXISTS equipamentos"
             },
             {
             tbl : "DROP TABLE IF EXISTS clientes"
             },
             {
             tbl : "DROP TABLE IF EXISTS produtos"
             },
             {
             tbl : "DROP TABLE IF EXISTS usuarios"
             },
             {
             tbl : "DROP TABLE IF EXISTS pedidos"
             },
             {
             tbl : "DROP TABLE IF EXISTS pedidos_itens"
             },
             {
             tbl : "DROP TABLE IF EXISTS sqlite_sequence"
             },*/
            {
                tbl: "CREATE TABLE IF NOT EXISTS empresas ( id_empresas INTEGER PRIMARY KEY AUTOINCREMENT, dsc_hash VARCHAR(10) , cpf_cnpj VARCHAR(14) , dsc_empresa VARCHAR(50) , data_hora_cadastro DATETIME  , data_hora_exclusao DATETIME  )"
            },
            {
                tbl: "CREATE TABLE IF NOT EXISTS empresas_chaves ( id_empresas_chaves INTEGER PRIMARY KEY AUTOINCREMENT, id_empresas INTEGER , dsc_chave VARCHAR(10)  , id_equipamentos)"
            },
            {
                tbl: "CREATE TABLE IF NOT EXISTS equipamentos ( id_equipamentos INTEGER PRIMARY KEY AUTOINCREMENT, id_empresas INTEGER , imei VARCHAR(100) )"
            },
            {
                tbl: "CREATE TABLE IF NOT EXISTS clientes ( id_clientes INTEGER PRIMARY KEY AUTOINCREMENT, id_empresas INTEGER , cod_cliente VARCHAR(50) , dsc_cliente VARCHAR(45) , data_hora_atualizacao DATETIME  , data_hora_exclusao DATETIME )"
            },
            {
                tbl: "CREATE TABLE IF NOT EXISTS produtos ( id_produtos INTEGER PRIMARY KEY AUTOINCREMENT, id_empresas INTEGER , cod_produto VARCHAR(50) , dsc_produto VARCHAR(100) , estoque DECIMAL(10,5)  DEFAULT 0 , desconto_maximo DECIMAL(10,2)  DEFAULT 0 , data_hora_atualizacao DATETIME  , data_hora_exclusao DATETIME )"
            },
            {
                tbl: "CREATE TABLE IF NOT EXISTS usuarios ( id_usuarios INTEGER PRIMARY KEY AUTOINCREMENT, id_empresas INTEGER , cod_usuario VARCHAR(50) , dsc_usuario VARCHAR(50)  , usuario VARCHAR(50) , nome VARCHAR(50) , senha VARCHAR(32) , data_hora_atualizacao DATETIME  , data_hora_exclusao DATETIME )"
            },
            {
                tbl: "CREATE TABLE IF NOT EXISTS pedidos ( id_pedidos INTEGER PRIMARY KEY AUTOINCREMENT, id_empresas INTEGER , id_clientes INTEGER , id_equipamentos INTEGER , id_usuarios INTEGER , data_hora_cadastro DATETIME , data_hora_finalizacao DATETIME , data_hora_envio DATETIME  , data_hora_transmissao DATETIME  , data_hora_exclusao DATETIME  , observacao VARCHAR(255) )"
            },
            {
                tbl: "CREATE TABLE IF NOT EXISTS pedidos_itens ( id_pedidos_itens INTEGER PRIMARY KEY AUTOINCREMENT, id_pedidos INTEGER , id_produtos INTEGER , data_hora_cadastro DATETIME , quantidade VARCHAR(45) , valor_unitario VARCHAR(45) , data_hora_exclusao DATETIME )"
            }
        ];

        $.each(tabelas, function(a, b) {

            db.transaction(function(tx) {
                tx.executeSql(b.tbl, [], function(tx, result) {
                    debug('SUCESSO', b.tbl);
                }, function(tx, result) {
                    debug('ERROR', result.message);
                });
            });
        });

    }

} else {
    jAviso('Navegador sem suporte ao banco de dados SqLite.');
}
