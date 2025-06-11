class ColecaoCampos {
    static #campos = {};

    constructor() {

    }

    obterCampo(id) {
        return ColecaoCampos.#campos[id];
    }

    salvarCampo(campo = Campo()) {
        ColecaoCampos.#campos[campo.id] = campo;
    }

    removerCampo(id) {
        delete ColecaoCampos.#campos[id];
    }

    estaVazia() {
        return Object.keys(ColecaoCampos.#campos).length === 0;
    }
}