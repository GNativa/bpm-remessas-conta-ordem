/*
    > Formulário
        - Mantém o estado do formulário, realizando carregamento e salvamento de dados, validações, etc.
 */

class Formulario {
    #fontes = {};
    #colecao;
    #validador;
    #secaoControle = null;
    #secaoRemessa = null;
    #personalizacao;

    constructor(colecao, validador) {
        this.#colecao = colecao;
        this.#validador = validador;

        this.#personalizacao = {
            titulo: "Remessas de venda por conta e ordem",
        };

        this.#validador.definirCamposObrigatorios({
            "etapaUnica": ["numeroNotaRecebida", "dataEmissaoNotaRecebida"],
        });

        this.#validador.definirCamposBloqueados({
            "etapaUnica": ["dataEmissao", "empresa", "filial", "serie", "contrato", "remessa", "situacao",
                "situacaoDocEletronico", "cliente", "notaVenda", "serieLegalNotaVenda", "safra", "observacaoNotaVenda"],
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
            new CampoFactory("dataEmissao", (id) => {
                return new CampoData(id, "Data de emissão da remessa", 2);
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
            new CampoFactory("remessa", (id) => {
                return new CampoTexto(id, "Remessa", 2);
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
            new CampoFactory("observacaoNotaVenda", (id) => {
                return new CampoTexto(id, "Observação da nota de venda", 8, null, null, null, null, null, null, 5);
            }),
            new CampoFactory("numeroNotaRecebida", (id) => {
                return new CampoTexto(id, "Nota recebida", 2);
            }),
            new CampoFactory("dataEmissaoNotaRecebida", (id) => {
                return new CampoData(id, "Data de emissão", 2);
            }),
        ];

        this.#secaoControle = new Secao("controle", "Controle", camposControle, this.#colecao);
        this.#secaoRemessa = new ListaObjetos("remessa", "Remessas", this.#colecao, camposRemessa, this.#validador);


        this.#secaoControle.gerar();
        this.#secaoRemessa.gerar();
    }

    obterValidacoes() {
        return [];
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
        const remessas = mapa.get("remessas");

        for (let i = 0; i < remessas.length; i++) {
            const indice = this.#secaoRemessa.obterIndiceUltimaLinha();

            const dataEmissao = this.#colecao.obterCampoPorLinha("dataEmissao", indice);
            dataEmissao.val(remessas[i]["remessas_data_emissao"].slice(0,10));

            const empresa = this.#colecao.obterCampoPorLinha("empresa", indice);
            empresa.val(Number(remessas[i]["remessas_empresa"]));

            const filial = this.#colecao.obterCampoPorLinha("filial", indice);
            filial.val(Number(remessas[i]["remessas_filial"]));

            const serie = this.#colecao.obterCampoPorLinha("serie", indice);
            serie.val(remessas[i]["remessas_serie"]);

            const contrato = this.#colecao.obterCampoPorLinha("contrato", indice);
            contrato.val(remessas[i]["remessas_contrato"]);

            const remessa = this.#colecao.obterCampoPorLinha("remessa", indice);
            remessa.val(Number(remessas[i]["remessas_numero"]));

            const situacao = this.#colecao.obterCampoPorLinha("situacao", indice);
            situacao.val(remessas[i]["remessas_situacao"]);

            const situacaoDocEletronico = this.#colecao.obterCampoPorLinha("situacaoDocEletronico", indice);
            situacaoDocEletronico.val(remessas[i]["remessas_situacao_documento_eletronico"]);

            const cliente = this.#colecao.obterCampoPorLinha("cliente", indice);
            cliente.val(Number(remessas[i]["remessas_cliente"]));

            const notaVenda = this.#colecao.obterCampoPorLinha("notaVenda", indice);
            notaVenda.val(Number(remessas[i]["remessas_nota_venda"]));

            const serieLegalNotaVenda = this.#colecao.obterCampoPorLinha("serieLegalNotaVenda", indice);
            serieLegalNotaVenda.val(Number(remessas[i]["remessas_serie_legal_nota_venda"]));

            const observacaoNotaVenda = this.#colecao.obterCampoPorLinha("observacaoNotaVenda", indice);
            observacaoNotaVenda.val(remessas[i]["remessas_observacao_nota_venda"]);

            this.#secaoRemessa.adicionarLinha();
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

    obterFontes() {
        return Object.freeze(this.#fontes);
    }

    obterPersonalizacao() {
        return Object.freeze(this.#personalizacao);
    }
}