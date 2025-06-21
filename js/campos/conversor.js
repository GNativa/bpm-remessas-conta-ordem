class Conversor {
    static #conversores =
        new Map()
            .set("texto", (valor) => valor.toString())
            .set("decimal", (valor) => Number(valor))
            .set("booleano", (valor) => valor === true)
            .set("inteiro", (valor) => Number(valor).toFixed(0))
            .set("data", (valor) => valor.slice(0,10));

    #idCampo;
    #propriedade;
    #tipo;
    #carregar;
    #salvar;

    constructor(idCampo = "", propriedade = "", tipo = "",
                carregar = true, salvar = true) {
        this.#idCampo = idCampo;
        this.#propriedade = propriedade;
        this.#tipo = tipo;

        if (!Conversor.#conversores.has(tipo)) {
            throw Error(`Tipo de dados "${tipo}" não suportado para converter e salvar em um campo.`);
        }

        this.#carregar = carregar ?? true;
        this.#salvar = salvar ?? true;
    }

    get carregar() {
        return this.#carregar;
    }

    get salvar() {
        return this.#salvar;
    }

    get idCampo() {
        return this.#idCampo;
    }

    get propriedade() {
        return this.#propriedade;
    }

    obterValor(objeto) {
        const converter = Conversor.#conversores.get(this.#tipo);
        return converter(objeto[this.#propriedade]);
    }
}