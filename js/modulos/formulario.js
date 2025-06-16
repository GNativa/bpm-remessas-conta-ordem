/*
    > Formulário
        - Mantém o estado do formulário, realizando carregamento e salvamento de dados, validações etc.
 */

class Formulario {
    #fontes;
    #colecao;
    #validador;
    #secaoRemessa;
    #personalizacao;
    #camposObrigatorios;
    #camposBloqueados;
    #camposOcultos;

    constructor(colecao, validador) {
        this.#fontes = {};
        this.#colecao = colecao;
        this.#validador = validador;

        this.#personalizacao = {
            titulo: "Remessas de venda por conta e ordem",
        };

        this.#camposObrigatorios = {
            "etapa1": [],
        };
        this.#camposBloqueados = {
            "etapa1": [],
        };
        this.#camposOcultos = {
            "etapa1": [],
        }

        this.#secaoRemessa = null;
    }

    // gerar(): void
    /*
        Define os campos do formulário, agrupados por seção, e suas propriedades.
     */
    gerar() {
        const camposRemessa = [
            new CampoFactory("teste", (id) => {
                return new CampoTexto(
                    id, "Observações de teste", 12,
                );
            }),
        ];

        this.#secaoRemessa = new ListaObjetos(
            "remessa", "Remessas", this.#colecao, camposRemessa, this.#validador
        );

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

    // carregarDados(mapa: Map): void
    /*
        Extrai os dados do mapa obtido como retorno da API do workflow,
        repassando-os para os campos e variáveis necessárias.
     */
    carregarDados(mapa) {
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

    obterCamposObrigatorios() {
        return Object.freeze(this.#camposObrigatorios);;
    }

    obterCamposBloqueados() {
        return Object.freeze(this.#camposBloqueados);
    }

    obterCamposOcultos() {
        return Object.freeze(this.#camposOcultos);
    }

    obterPersonalizacao() {
        return Object.freeze(this.#personalizacao);
    }
}