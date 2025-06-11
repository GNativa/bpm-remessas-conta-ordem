class Constantes {
    static gerais = Object.freeze({
        atributos: Object.freeze({
            sequencia: "data-index",
        }),
    });

    static campos = Object.freeze({
        prefixoIdBotaoPesquisa: "botao-",
        classes: Object.freeze({
            carregaveis: "carregaveis-",
        }),
        atributos: Object.freeze({
            fonte: "data-fonte",
            campoFonte: "data-campo-fonte",
            linhaListaObjetos: "data-linha-lista-",
            campoListaObjetos: "data-lista",
            sequenciaCampoLista: "data-lista-seq",
        }),
    });

    static telas = Object.freeze({
        busca: "busca",
        atributos: Object.freeze({
            id: "tela-",
            idTitulo: "titulo-",
            idFechar: "fechar-",
        }),
    });

    static fontes = Object.freeze({
        dadosTeste: [
            {"A": 1, "B": 2, "C": 3},
            {"A": 1, "B": 3, "C": 5},
            {"A": 1, "B": 7, "C": 9},
            {"A": 1, "B": 10, "C": 11},
            {"A": 2, "B": 2, "C": 3},
        ],
        tipos: Object.freeze({
            api: "api",
            tabela: "tabela",
        }),
        linhasPreSelecao: 5,
    });
}