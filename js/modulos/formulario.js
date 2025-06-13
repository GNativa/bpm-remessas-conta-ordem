/*
    > Formulário
        - Mantém o estado do formulário, realizando carregamento e salvamento de dados, validações etc.
 */

const Formulario = (() => {
    // Variáveis para uso em validações, consultas, etc.
    let fontes = {};

    let secaoRemessa;

    const personalizacao = {
        titulo: "Remessas de venda por conta e ordem",
    };

    const camposObrigatorios = {                       // Listas dos IDs agrupados dos campos obrigatórios por etapa
        "etapa1": [],
    };

    const camposBloqueados = {                         // Listas dos IDs agrupados dos campos bloqueados por etapa
        "etapa1": [],
    };

    const camposOcultos = {                            // Listas dos IDs agrupados dos campos ocultos por etapa
        "etapa1": [],
    };

    // obterValidacoes(): array<Validacao>
    /*
        Validações a serem usadas no formulário.
     */
    function obterValidacoes() {
        return [];
    }

    // salvarDados(): Promise<{}>
    /*
        Guarda os dados de todos os campos em um objeto para uso na função _saveData da API do workflow.
     */
    async function salvarDados() {
        let dados = {};

        // dados.x = campos["x"].val();

        return dados;
    }

    // carregarDados(mapa: Map): void
    /*
        Extrai os dados do mapa obtido como retorno da API do workflow,
        repassando-os para os campos e variáveis necessárias.
     */
    function carregarDados(mapa) {
        // campos["x"].val(mapa.get("x") || "");
    }

    // definirEstadoInicial(): void
    /*
        Configura máscaras de campos, consultas de APIs e parâmetros diversos.
     */
    function definirEstadoInicial() {
    }

    // configurarEventos(): void
    /*
        Configura eventos em elementos diversos.
     */
    function configurarEventos() {
        // A implementar.
    }

    // gerar(): void
    /*
        Define os campos do formulário, agrupados por seção, e suas propriedades.
     */
    function gerar() {
        const camposRemessa = [
            new CampoFactory("teste", (id) => {
                return new CampoTexto(
                    id, "Observações de teste", 12,
                );
            }),
        ];

        secaoRemessa = new ListaObjetos("remessa", "Remessas", null, new ColecaoCampos(), camposRemessa, );
        secaoRemessa.gerar();
    }

    return {
        personalizacao,
        camposObrigatorios,
        camposBloqueados,
        camposOcultos,
        fontes,
        carregarDados,
        salvarDados,
        obterValidacoes,
        definirEstadoInicial,
        configurarEventos,
        gerar
    };
})();