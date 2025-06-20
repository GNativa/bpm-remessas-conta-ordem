class FormularioBase {
    #campos;
    #secoes = new Map();
    #fontes = new Map();
    #validador;
    #personalizacao = new Map();

    constructor(colecao, validador, secoes, camposObrigatorios, camposBloqueados, camposOcultos) {
        this.#campos = colecao;
        this.#validador = validador;

        this.#validador.definirCamposObrigatorios(camposObrigatorios);
        this.#validador.definirCamposBloqueados(camposBloqueados);
        this.#validador.definirCamposOcultos(camposOcultos);
    }

    salvarSecao(secao) {
        this.#secoes.set(secao.id, secao);
    }

    obterCampo(id) {

    }

    carregarListaDeObjetos(array, listaDeObjetos, conversores = [new Conversor()]) {
        for (let i = 0; i < array.length; i++) {
            if (i > 0) {
                listaDeObjetos.adicionarLinha();
            }

            const indice = listaDeObjetos.obterIndiceUltimaLinha();

            for (const conversor of conversores) {
                const campo = this.#campos.obterPorLinha(conversor.idCampo, indice);
                const valor = conversor.obterValor(array[i]);
                campo.val(valor);
            }
        }
    }

    gerar() {
        for (const secao of this.#secoes.values()) {
            secao.gerar();
        }
    }

    get campos() {
        return this.#campos;
    }

    get fontes() {
        return Object.freeze(this.#fontes);
    }

    get personalizacao() {
        return Object.freeze(this.#personalizacao);
    }
}