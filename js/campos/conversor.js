class Conversor {
    static #conversores =
        new Map()
            .set("texto", (valor) => valor.toString())
            .set("decimal", (valor) => Number(valor))
            .set("booleano", (valor) => valor === "on")
            .set("inteiro", (valor) => Number(valor).toFixed(0))
            .set("data", (valor) => valor.slice(0,10));

    #idCampo;
    #propriedade;
    #tipo;

    constructor(idCampo = "", propriedade = "", tipo = "") {
        this.#idCampo = idCampo;
        this.#propriedade = propriedade;
        this.#tipo = tipo;

        if (!Conversor.#conversores.has(tipo)) {
            throw Error(`Tipo de dados "${tipo}" não suportado para converter e salvar em um campo.`);
        }
    }

    get idCampo() {
        return this.#idCampo;
    }

    get propriedade() {
        return this.#propriedade;
    }

    obterValor(objeto) {
        const converter = this.#conversores.get(this.#idCampo);
        return converter(objeto[this.#propriedade]);
    }
}