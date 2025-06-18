/*
    > Formulário
        - Mantém o estado do formulário, realizando carregamento e salvamento de dados, validações, etc.
 */

class Formulario {
    #fontes = {};
    #campos;
    #validador;
    #secaoControle = null;
    #secaoRemessa = null;
    #personalizacao;

    constructor(colecao, validador) {
        this.#campos = colecao;
        this.#validador = validador;

        this.#personalizacao = {
            titulo: "Remessas de venda por conta e ordem",
        };

        this.#validador.definirCamposObrigatorios({
            "etapaUnica": [],
        });

        this.#validador.definirCamposBloqueados({
            "etapaUnica": [
                "dataEmissao", "empresa", "filial", "serie", "contrato", "remessa", "situacao",
                "situacaoDocEletronico", "cliente", "notaVenda", "serieLegalNotaVenda", "safra", "placa", "observacao"
            ],
        });

        this.#validador.definirCamposOcultos({
            "etapaUnica": [],
        });
    }

    // gerar(): void
    /*
        Define os campos do formulário, agrupados por seção, e suas propriedades.
     */
    gerar() {
        const camposControle = [
            new CampoTexto("filiaisUsuario", "Abrangência de filiais do usuário (ERP, empresa 1)", 12, null, null,
                null, null, null, 5),
        ];
        const camposRemessa = [
            new CampoFactory("selecionar", (id) => {
                return new CampoCheckbox(id, "Selecionar", 2, "Selecione a nota que deseja"
                + " alterar.");
            }),
            new CampoFactory("remessa", (id) => {
                return new CampoTexto(id, "Remessa", 2);
            }),
            new CampoFactory("dataEmissao", (id) => {
                return new CampoData(id, "Data de emissão", 2);
            }),
            new CampoFactory("empresa", (id) => {
                return new CampoTexto(id, "Empresa", 2);
            }),
            new CampoFactory("filial", (id) => {
                return new CampoTexto(id, "Filial", 2);
            }),
            new CampoFactory("serie", (id) => {
                return new CampoTexto(id, "Série", 2);
            }),
            new CampoFactory("contrato", (id) => {
                return new CampoTexto(id, "Contrato", 2);
            }),
            new CampoFactory("situacao", (id) => {
                return new CampoTexto(id, "Situação", 4);
            }),
            new CampoFactory("situacaoDocEletronico", (id) => {
                return new CampoTexto(id, "Situação do documento eletrônico", 4);
            }),
            new CampoFactory("cliente", (id) => {
                return new CampoTexto(id, "Cliente", 2);
            }),
            new CampoFactory("notaVenda", (id) => {
                return new CampoTexto(id, "Nota de venda", 2);
            }),
            new CampoFactory("serieLegalNotaVenda", (id) => {
                return new CampoTexto(id, "Série legal da nota de venda", 2);
            }),
            new CampoFactory("safra", (id) => {
                return new CampoTexto(id, "Safra", 2);
            }),
            new CampoFactory("placa", (id) => {
                return new CampoTexto(id, "Placa", 2);
            }),
            new CampoFactory("observacao", (id) => {
                return new CampoTexto(id, "Observação da remessa", 8, null, null, null, null, null, null, 5);
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
        this.#secaoRemessa = new ListaObjetos("remessa", "Remessas", this.#campos, camposRemessa,
            this.#validador, true, true);

        this.#secaoControle.gerar();
        this.#secaoRemessa.gerar();
    }

    obterValidacoes() {
        return [
            new Validacao(() => {
                    const campoRemessa = this.#campos.obter("remessa");
                    return campoRemessa.length === 1
                        && campoRemessa[0].val() === "";
                },
                "Não há nenhuma remessa disponível no momento.",
                () => this.#campos.obter("remessa"),
                () => this.#campos.obter("remessa"),
                null,
                null,
                null,
                null,
                null,
                true),
            new Validacao(() => {
                    const campos = this.#campos.obter("selecionar");

                    const selecionouAoMenosUm = campos.some((selecionado) => {
                        return selecionado.campo.prop("checked") === true;
                    });

                    return !selecionouAoMenosUm;
                },
                "Selecione ao menos uma nota para alterar sua observação.",
                () => this.#campos.obter("selecionar"),
                () => this.#campos.obter("selecionar"),
                null,
                null,
                null,
                null,
                null,
                true),
            new Validacao((campo) => {
                    return campo.campo.prop("checked");
                },
                null,
                () => this.#campos.obter("selecionar"),
                null,
                () => {
                    const colecao = this.#campos.obterVarios(
                        ["numeroNotaRecebida", "emissaoNotaRecebida"]
                    );
                    return colecao;
                })
        ];
    }

    // #salvarDados(): Promise<{}>
    /*
        Guarda os dados de todos os campos em um objeto para uso na função _saveData da API do workflow.
     */
    async salvarDados() {
        let dados = {};

        // dados.x = campos["x"].val();

        return dados;
    }

    carregarDadosFluxo(mapa) {
        const filiais = mapa.get("abrangencia_filiais");

        const campoAbrangenciaFiliais = this.#campos.obterCampo("filiaisUsuario");
        campoAbrangenciaFiliais.val(filiais);

        const remessas = mapa.get("remessas");

        for (let i = 0; i < remessas.length; i++) {
            if (i > 0) {
                this.#secaoRemessa.adicionarLinha();
            }

            const indice = this.#secaoRemessa.obterIndiceUltimaLinha();

            const dataEmissao = this.#campos.obterPorLinha("dataEmissao", indice);
            dataEmissao.val(remessas[i]["remessas_data_emissao"].slice(0,10));

            const empresa = this.#campos.obterPorLinha("empresa", indice);
            empresa.val(Number(remessas[i]["remessas_empresa"]));

            const filial = this.#campos.obterPorLinha("filial", indice);
            filial.val(Number(remessas[i]["remessas_filial"]));

            const serie = this.#campos.obterPorLinha("serie", indice);
            serie.val(remessas[i]["remessas_serie"]);

            const contrato = this.#campos.obterPorLinha("contrato", indice);
            contrato.val(remessas[i]["remessas_contrato"]);

            const remessa = this.#campos.obterPorLinha("remessa", indice);
            remessa.val(Number(remessas[i]["remessas_numero"]));

            const situacao = this.#campos.obterPorLinha("situacao", indice);
            situacao.val(remessas[i]["remessas_situacao"]);

            const situacaoDocEletronico = this.#campos.obterPorLinha("situacaoDocEletronico", indice);
            situacaoDocEletronico.val(remessas[i]["remessas_situacao_documento_eletronico"]);

            const cliente = this.#campos.obterPorLinha("cliente", indice);
            cliente.val(Number(remessas[i]["remessas_cliente"]));

            const notaVenda = this.#campos.obterPorLinha("notaVenda", indice);
            notaVenda.val(Number(remessas[i]["remessas_nota_venda"]));

            const serieLegalNotaVenda = this.#campos.obterPorLinha("serieLegalNotaVenda", indice);
            serieLegalNotaVenda.val(Number(remessas[i]["remessas_serie_legal_nota_venda"]));

            const observacao = this.#campos.obterPorLinha("observacao", indice);
            observacao.val(remessas[i]["remessas_observacao"]);

            const safra = this.#campos.obterPorLinha("safra", indice);
            safra.val(remessas[i]["remessas_safra"]);

            const placa = this.#campos.obterPorLinha("placa", indice);
            placa.val(remessas[i]["remessas_placa"]);
        }
    }

    // carregarDadosFormulario(mapa: Map): void
    /*
        Extrai os dados do mapa obtido como retorno da API do workflow,
        repassando-os para os campos e variáveis necessárias.
     */
    carregarDadosFormulario(mapa) {

        // campos["x"].val(mapa.get("x") || "");
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

    // TODO: criar classe mãe para não precisar expor
    //  métodos fixos ao criador do formulário,
    //   como obterFontes, obterPersonalizacao e possivelmente outros
    //    que poderiam ser sobrescritos
    obterFontes() {
        return Object.freeze(this.#fontes);
    }

    obterPersonalizacao() {
        return Object.freeze(this.#personalizacao);
    }
}