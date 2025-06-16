class ColecaoCampos {
    #campos;

    constructor() {
        this.#campos = new Map();
    }

    obterCampo(id = "", idAgrupado = "") {
        const campos = this.#campos;
        const lista = campos.get(idAgrupado);

        if (!lista) {
            throw new Error(`Não há campos salvos com o ID agrupado "${idAgrupado}"`);
        }

        const campoObtido = lista.find((campo = new Campo()) => {
            return campo.id === id;
        });

        if (!campoObtido) {
            throw new Error(`Não há nenhum campo salvo com o ID "${id}"`);
        }

        return campoObtido;
    }

    salvarCampo(campo = new Campo()) {
        const campos = this.#campos;

        if (!campos.get(campo.idAgrupado)) {
            campos.set(campo.idAgrupado, []);
        }

        const listaCampos = campos.get(campo.idAgrupado);
        listaCampos.push(campo);
    }

    salvarCampos(campos = [new Campo()]) {
        for (const campo of campos) {
            this.salvarCampo(campo);
        }
    }

    removerCampo(campo = new Campo()) {
        const campos = this.#campos;

        if (!campo.idAgrupado) {
            throw new Error(`O ID agrupado do campo "${campo.id}" está vazio.`);
        }

        const lista = campos.get(campo.idAgrupado);

        if (!lista || lista.length === 0) {
            throw new Error(`Não há campos salvos com o ID agrupado "${campo.idAgrupado}".`);
        }

        campos.set(campo.idAgrupado, lista.filter((elemento) => {
            return elemento.id !== campo.id;
        }));
    }

    removerCampos(campos = [new Campo()]) {
        for (const campo of campos) {
            this.removerCampo(campo);
        }
    }

    /*
    #campos = {
        "id": [campo, campo, campo],
    }
     */

    obterListas() {
        return this.#campos.values();
    }

    obterCampos() {
        const campos = [];

        for (const lista of this.#campos.values()) {
            campos.push(lista);
        }

        return campos.flat();
    }

    obterLista(idAgrupado = "") {
        const campos = this.#campos;

        const lista = campos.get(idAgrupado);

        if (!lista) {
            throw new Error(`Não há uma lista de campos com o ID agrupado "${idAgrupado}"`);
        }

        return lista;
    }

    /*
    estaVazia() {
        return Object.keys(ColecaoCampos.#campos).length === 0;
    }
     */
}