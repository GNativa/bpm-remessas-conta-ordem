class ColecaoCampos {
    static #campos = {};

    constructor() {
    }

    obterCampo(id = "", idAgrupado = "") {
        const campos = ColecaoCampos.#campos;

        if (!campos.hasOwnProperty(idAgrupado)) {
            throw new Error(`Não há campos salvos com o ID agrupado "${idAgrupado}"`);
        }

        const campoObtido = campos[idAgrupado].find((campo = new Campo()) => {
            return campo.id === id;
        });

        if (!campoObtido) {
            throw new Error(`Não há nenhum campo salvo com o ID "${id}"`);
        }

        return campoObtido;
    }

    salvarCampo(campo = new Campo()) {
        const campos = ColecaoCampos.#campos;

        if (!campos.hasOwnProperty(campo.idAgrupado)) {
            campos[campo.idAgrupado] = [];
        }

        const listaCampos = campos[campo.idAgrupado];
        listaCampos.push(campo);
    }

    salvarCampos(campos = [new Campo()]) {
        for (const campo of campos) {
            this.salvarCampo(campo);
        }
    }

    removerCampo(campo = new Campo()) {
        const campos = ColecaoCampos.#campos;

        if (!campo.idAgrupado) {
            throw new Error(`O ID agrupado do campo "${campo.id}" está vazio.`);
        }

        if (!campos.hasOwnProperty(campo.idAgrupado) || campos[campo.idAgrupado].length === 0) {
            throw new Error(`Não há campos salvos com o ID agrupado "${campo.idAgrupado}".`);
        }

        campos[campo.idAgrupado] = campos[campo.idAgrupado].filter((elemento) => {
            return elemento.id !== campo.id;
        });
    }

    /*
    #campos = {
        "id": [campo, campo, campo],
    }
     */

    obterCampos() {
        const campos = [];

        for (const lista in ColecaoCampos.#campos) {
            campos.push(ColecaoCampos.#campos[lista]);
        }

        return campos.flat();
    }

    /*
    estaVazia() {
        return Object.keys(ColecaoCampos.#campos).length === 0;
    }
     */
}