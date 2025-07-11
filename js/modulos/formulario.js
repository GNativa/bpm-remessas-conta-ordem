/*
    > Formulário
        - Mantém o estado do formulário, realizando carregamento e salvamento de dados, validações, etc.
 */

class Formulario {
    #fontes = {};
    #secoes = new Map();
    #campos;
    #conversores = [];
    #validador;
    #secaoControle = null;
    #secaoRemessa = null;
    #personalizacao;

    constructor(colecao, validador) {
        this.#campos = colecao;
        this.#validador = validador;

        this.#conversores = [
            new Conversor("selecionar","remessas_selecionada", "booleano", false),
            new Conversor(
                "observacaoGerada",
                "remessas_observacao_gerada",
                "booleano",
                true,
                false
            ),
            new Conversor("dataEmissao","remessas_data_emissao", "data"),
            new Conversor("empresa","remessas_empresa", "inteiro"),
            new Conversor("filial","remessas_filial", "inteiro"),
            new Conversor("serie","remessas_serie", "texto"),
            new Conversor("contrato","remessas_contrato", "texto"),
            new Conversor("situacao","remessas_situacao", "texto", true, false),
            new Conversor(
                "situacaoDocEletronico",
                "remessas_situacao_documento_eletronico",
                "texto",
                true,
                false
            ),
            new Conversor("remessa","remessas_numero", "inteiro"),
            new Conversor("cliente","remessas_cliente", "inteiro", true, true),
            new Conversor("nomeCliente","remessas_nome_cliente", "texto"),
            new Conversor("notaVenda","remessas_nota_venda", "inteiro"),
            new Conversor("serieLegalNotaVenda","remessas_serie_legal_nota_venda", "texto"),
            new Conversor(
                "clienteNotaVenda",
                "remessas_cliente_nota_venda",
                "inteiro",
                true,
                false
            ),
            new Conversor("nomeClienteNotaVenda","remessas_nome_cliente_nota_venda", "texto"),
            new Conversor("ieClienteNotaVenda","remessas_ie_cliente_nota_venda", "texto"),
            new Conversor(
                "enderecoClienteNotaVenda",
                "remessas_endereco_cliente_nota_venda",
                "texto"
            ),
            new Conversor(
                "documentoClienteNotaVenda",
                "remessas_documento_cliente_nota_venda",
                "texto"
            ),
            new Conversor("dataEmissaoNotaVenda","remessas_data_emissao_nota_venda", "data"),
            new Conversor(
                "observacao",
                "remessas_observacao",
                "texto",
                true,
                false
            ),
            new Conversor("safra","remessas_safra", "texto"),
            new Conversor("placa","remessas_placa", "texto"),
            new Conversor("motorista","remessas_motorista", "texto"),
            new Conversor(
                "numeroNotaRecebida",
                "remessas_nota_recebida",
                "inteiro",
                false
            ),
            new Conversor(
                "emissaoNotaRecebida",
                "remessas_data_emissao_nota_recebida",
                "data",
                false
            ),
        ];

        this.#personalizacao = {
            titulo: "Remessas de venda por conta e ordem",
        };

        this.#validador.definirCamposObrigatorios({
            "etapaUnica": [],
        });

        this.#validador.definirCamposBloqueados({
            "etapaUnica": [
                "observacaoGerada", "dataEmissao", "empresa", "filial", "serie", "contrato", "remessa", "situacao",
                "situacaoDocEletronico", "cliente", "nomeCliente", "notaVenda", "serieLegalNotaVenda",
                "clienteNotaVenda", "nomeClienteNotaVenda", "dataEmissaoNotaVenda", "safra", "placa", "motorista",
                "observacao"
            ],
        });

        this.#validador.definirCamposOcultos({
            "etapaUnica": [
                "filiaisUsuario", "ieClienteNotaVenda", "enderecoClienteNotaVenda", "documentoClienteNotaVenda",
                "cliente", "clienteNotaVenda",
            ],
        });
    }

    // gerar(): void
    /*
        Define os campos do formulário, agrupados por seção, e suas propriedades.
     */
    gerar() {
        const camposControle = [
            new CampoTexto("filiaisUsuario", "Abrangência de filiais do usuário (ERP, empresa 1)", 12, null, null,
                null, null, null, null, 5),
        ];
        const camposRemessa = [
            new CampoFactory("selecionar", (id) => {
                return new CampoCheckbox(id, "Selecionar", 2, "Marque aqui para indicar que "
                    + "deseja gerar a observação da remessa, fechá-la e gerar seu XML.");
            }),
            new CampoFactory("observacaoGerada", (id) => {
                return new CampoCheckbox(id, "Observação já foi gerada?", 2, "Indica se a observação "
                    + "da remessa já foi gerada/preenchida.");
            }),
            new CampoFactory("empresa", (id) => {
                return new CampoTexto(id, "Empresa", 2);
            }),
            new CampoFactory("filial", (id) => {
                return new CampoTexto(id, "Filial", 2);
            }),
            new CampoFactory("remessa", (id) => {
                return new CampoTexto(id, "Remessa", 2);
            }),
            new CampoFactory("dataEmissao", (id) => {
                return new CampoData(id, "Data de emissão", 2);
            }),
            new CampoFactory("serie", (id) => {
                return new CampoTexto(id, "Série", 2);
            }),
            new CampoFactory("contrato", (id) => {
                return new CampoTexto(id, "Contrato", 2);
            }),
            new CampoFactory("situacao", (id) => {
                return new CampoTexto(id, "Situação", 2);
            }),
            new CampoFactory("situacaoDocEletronico", (id) => {
                return new CampoTexto(id, "Situação (documento eletrônico)", 2);
            }),
            new CampoFactory("cliente", (id) => {
                return new CampoTexto(id, "Cliente", 2);
            }),
            new CampoFactory("nomeCliente", (id) => {
                return new CampoTexto(id, "Nome do cliente", 2);
            }),
            new CampoFactory("notaVenda", (id) => {
                return new CampoTexto(id, "Nota de venda", 2);
            }),
            new CampoFactory("serieLegalNotaVenda", (id) => {
                return new CampoTexto(id, "Série legal da nota de venda", 2);
            }),
            new CampoFactory("clienteNotaVenda", (id) => {
                return new CampoTexto(id, "Cliente da nota de venda", 2);
            }),
            new CampoFactory("nomeClienteNotaVenda", (id) => {
                return new CampoTexto(id, "Nome do cliente da nota de venda", 2);
            }),
            new CampoFactory("ieClienteNotaVenda", (id) => {
                return new CampoTexto(id, "I.E. do cliente da nota de venda", 2);
            }),
            new CampoFactory("enderecoClienteNotaVenda", (id) => {
                return new CampoTexto(id, "Endereço do cliente da nota de venda", 6);
            }),
            new CampoFactory("documentoClienteNotaVenda", (id) => {
                return new CampoTexto(id, "Documento do cliente da nota de venda", 2);
            }),
            new CampoFactory("dataEmissaoNotaVenda", (id) => {
                return new CampoData(id, "Emissão da nota de venda", 2);
            }),
            new CampoFactory("safra", (id) => {
                return new CampoTexto(id, "Safra", 2);
            }),
            new CampoFactory("placa", (id) => {
                return new CampoTexto(id, "Placa", 2);
            }),
            new CampoFactory("motorista", (id) => {
                return new CampoTexto(id, "Motorista", 2);
            }),
            new CampoFactory("observacao", (id) => {
                return new CampoTexto(id, "Observação atual da remessa", 4, null, null, null, null, null, null, 5);
            }),
            new CampoFactory("numeroNotaRecebida", (id) => {
                return new CampoTexto(id, "Nota recebida", 2);
            }),
            new CampoFactory("emissaoNotaRecebida", (id) => {
                return new CampoData(id, "Emissão da nota recebida", 2,
                    null, null, null, true);
            }),
        ];

        this.#secaoControle = new Secao("controle", "Controle", camposControle, this.#campos);
        this.#secaoRemessa = new ListaObjetos(
            "remessa", "Remessas", this.#campos, this.#validador,
            camposRemessa,["empresa", "filial", "contrato", "remessa"],
            false, false
        );

        this.#salvarSecao(this.#secaoControle);
        this.#salvarSecao(this.#secaoRemessa);

        this.#secaoControle.gerar();
        this.#secaoRemessa.gerar();
    }

    #salvarSecao(secao) {
        this.#secoes.set(secao.id, secao);
    }

    finalizar() {
        for (const secao of this.#secoes.values()) {
            if (!(secao instanceof ListaObjetos)) continue;

            secao.exibirLinhas();
        }
    }

    obterValidacoes() {
        return [
            new Validacao(
            () => {
                    const campoRemessa = this.#campos.obter("remessa");
                    return campoRemessa.length === 1
                        && campoRemessa[0].valor() === "";
                },
                "Não há nenhuma remessa disponível no momento.",
                () => this.#campos.obter("remessa"),
                () => this.#campos.obter("remessa"),
                null,
                null,
                null,
                null,
                null,
                true
            ),
            new Validacao(
                () => {
                    const campos = this.#campos.obter("selecionar");

                    const selecionouAoMenosUm = campos.some((selecionado) => {
                        return selecionado.valor() === true;
                    });

                    return !selecionouAoMenosUm;
                },
                "Selecione ao menos uma nota.",
                () => this.#campos.obter("selecionar"),
                () => this.#campos.obter("selecionar"),
                null,
                null,
                null,
                null,
                null,
                true
            ),
            new Validacao(
                (campo) => {
                    return campo.valor() === true;
                },
                null,
                () => this.#campos.obter("selecionar"),
                null,
                () => {
                    const colecao = this.#campos.obterVarios(
                        ["numeroNotaRecebida", "emissaoNotaRecebida"]
                    );
                    return colecao;
                }
            ),
            new Validacao(
                (campo) => {
                    return campo.valor() !== "" && !/^[1-9]([0-9]*)$/.test(campo.valor());
                },
                "Insira um número válido.",
                () => this.#campos.obter("numeroNotaRecebida"),
                () => this.#campos.obter("numeroNotaRecebida"),
            ),
            /*
            new Validacao(
                (campo) => {
                    const linha = campo.linhaLista;
                    const selecionar = this.#campos.obterPorLinha("selecionar", linha);
                    const observacaoJaGerada = this.#campos.obterPorLinha("observacaoGerada", linha);

                    return selecionar.valor() === true && observacaoJaGerada.valor() === true;
                },
                "A observação desta remessa já foi gerada.",
                () => this.#campos.obterVarios(["selecionar", "observacaoGerada"]),
                () => this.#campos.obter("observacaoGerada"),
            )
             */
        ];
    }

    // salvarDados(): Promise<{}>
    /*
        Guarda os dados de todos os campos em um objeto para uso na função _saveData da API do workflow.
     */
    async salvarDados() {
        let dados = {};

        dados["remessas"] = this.carregarArrayPorLista(this.#secaoRemessa);
        dados["remessas_json"] = JSON.stringify(dados["remessas"]);
        dados["abrangencia_filiais"] = this.#campos.obterCampo("filiaisUsuario").valor();

        return dados;
    }

    carregarDadosFluxo(mapa) {
        const filiais = mapa.get("abrangencia_filiais");

        const campoAbrangenciaFiliais = this.#campos.obterCampo("filiaisUsuario");
        campoAbrangenciaFiliais.valor(filiais);

        const sucesso = mapa.get("sucesso");

        if (sucesso === false) {
            const mensagem = mapa.get("mensagem_retorno");
            Mensagem.exibir("Erro ao carregar as remessas", `${mensagem}`, "erro");
            return;
        }

        const remessas = mapa.get("remessas");

        if (!remessas) {
            return;
        }

        this.carregarListaDeObjetos(remessas, this.#secaoRemessa);
    }

    // carregarDadosFormulario(mapa: Map): void
    /*
        Extrai os dados do mapa obtido como retorno da API do workflow,
        repassando-os para os campos e variáveis necessárias.
     */
    carregarDadosFormulario(mapa) {
        const remessas = mapa.get("remessas");

        if (!remessas) {
            return;
        }

        this.carregarListaDeObjetos(JSON.parse(remessas), this.#secaoRemessa);
    }

    // definirEstadoInicial(): void
    /*
        Configura máscaras de campos, consultas de APIs e parâmetros diversos.
     */
    definirEstadoInicial() {
    }

    // configurarEventos(): void
    /*
        Configura eventos em elementos diversos.
     */
    configurarEventos() {
        // A implementar.
    }

    // TODO: utilizar classe mãe (FormularioBase) para não precisar expor
    //  métodos fixos ao criador do formulário,
    //   como obterFontes, obterPersonalizacao e possivelmente outros
    //    que poderiam ser sobrescritos
    obterFontes() {
        return Object.freeze(this.#fontes);
    }

    obterPersonalizacao() {
        return Object.freeze(this.#personalizacao);
    }

    carregarArrayPorLista(listaDeObjetos) {
        const array = [];

        for (let i = 0; i < listaDeObjetos.tamanho; i++) {
            const objeto = {};

            if (this.#conversores.length === 0) {
                for (const campo of listaDeObjetos.obterLinha(i)) {
                    objeto[campo.id] = campo.valor();
                }
            }
            else {
                for (const conversor of this.#conversores) {
                    if (!conversor.salvar) {
                        continue;
                    }

                    objeto[conversor.propriedade] = this.#campos.obterPorLinha(conversor.idCampo, i).valor();
                }
            }

            array.push(objeto);
        }

        return array;
    }

    carregarListaDeObjetos(array, listaDeObjetos) {
        for (let i = 0; i < array.length; i++) {
            if (i > 0) {
                listaDeObjetos.adicionarLinha();
            }

            const indice = listaDeObjetos.obterIndiceUltimaLinha();

            for (const conversor of this.#conversores) {
                if (!conversor.carregar) {
                    continue;
                }

                const campo = this.#campos.obterPorLinha(conversor.idCampo, indice);
                const valor = conversor.obterValor(array[i]);
                campo.valor(valor);
            }
        }
    }
}