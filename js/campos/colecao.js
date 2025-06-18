class ColecaoCampos {
    #campos;

    constructor() {
        this.#campos = new Map();
    }

    obterPorLinha(idAgrupado, linha) {
        const campos = this.#campos;
        const lista = campos.get(idAgrupado);

        if (!lista) {
            throw new Error(`Não há campos salvos com o ID agrupado "${idAgrupado}"`);
        }

        const campoObtido = lista.find((campo = new Campo()) => {
            return campo.linhaLista === linha;
        });

        if (!campoObtido) {
            throw new Error(`Não há nenhum campo salvo com o ID "${idAgrupado}" na linha ${linha}.`);
        }

        return campoObtido;
    }

    obterCampo(id) {
        const campos = this.#campos;
        let campo = campos.get(id)[0];

        if (!campo) {
            throw new Error(`Não há nenhum campo salvo com o ID "${id}"`);
        }

        return campo;
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

    obterListas() {
        return this.#campos.values();
    }

    obterTodosCampos() {
        const campos = [];

        for (const lista of this.#campos.values()) {
            campos.push(lista);
        }

        return campos.flat();
    }

    obter(idAgrupado = "") {
        const campos = this.#campos;

        const lista = campos.get(idAgrupado);

        if (!lista) {
            throw new Error(`Não há uma lista de campos com o ID agrupado "${idAgrupado}"`);
        }

        return lista;
    }

    obterVarios(idsAgrupados = [""]) {
        const campos = this.#campos;
        const lista = [];

        for (const id of idsAgrupados) {
            const camposAgrupados = campos.get(id);

            if (!camposAgrupados) {
                throw new Error(`Não há uma lista de campos com o ID agrupado "${id}"`);
            }

            lista.push(campos.get(id));
        }

        return lista.flat();
    }


    /*
    estaVazia() {
        return Object.keys(ColecaoCampos.#campos).length === 0;
    }
     */
}