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