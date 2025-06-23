class ListaObjetos extends Secao {
    #colecao;
    #factories;
    #validador;
    #camposLista = new Map();
    #permiteAdicionarLinhas;
    #permiteRemoverLinhas;

    constructor(id, titulo, colecao, factories, validador, permiteAdicionarLinhas = true, permiteRemoverLinhas = true) {
        super(id, titulo, null);
        this.#factories = factories ?? [];
        this.#validador = validador;
        this.#colecao = colecao;
        this.#permiteAdicionarLinhas = permiteAdicionarLinhas;
        this.#permiteRemoverLinhas = permiteRemoverLinhas;
    }

    get tamanho() {
        return this.#camposLista.size;
    }

    obterLinha(indice) {
        return this.#camposLista.get(indice);
    }

    criarLinha() {
        const indice = this.obterIndiceUltimaLinha() + 1;

        const linhaItem = $(`<div ${Constantes.campos.atributos.linhaListaObjetos}${this.id}="${indice}" class="row g-3"></div>`);
        const colunaSuperior = $(`<div class="col-6 d-flex justify-content-start align-items-center fw-bold">${indice + 1}</div>`);
        const colunaBotaoRemover = $(`<div class="col-6 d-flex justify-content-end"></div>`);
        const botaoRemover = $(`
            <button type="button" title="Remover linha" id="removerLinhaSecao${this.id}${indice}" class="btn botao ms-3">
                <i class="bi bi-x fs-5"></i>
            </button>
        `);

        botaoRemover.on("click", () => {
            this.removerLinha(indice);
        });

        const hr = $("<hr>");

        if (indice === 0 || Utilitario.obterEtapa() === null) {
            botaoRemover.prop("disabled", true);
            hr.addClass("border-2");
        }
        else {
            hr.addClass("border-1");
            //linhaItem.addClass("mt-1");
        }

        if (this.#permiteRemoverLinhas) {
            colunaBotaoRemover.append(botaoRemover);
        }

        linhaItem.append(colunaSuperior);
        linhaItem.append(colunaBotaoRemover);
        this.divSecao.append(linhaItem);

        const camposDaLinha = [];

        for (const factory of this.#factories) {
            const novoId = `${factory.idCampo}${indice}`;

            if (camposDaLinha.find((campo) => campo.id === novoId)
             || document.getElementById(novoId) !== null) {
                this.lancarErroDeCampoDuplicado(factory.idCampo);
            }

            const campo = factory.construir(novoId);
            campo.atribuirListaObjetos(this);
            campo.atribuirIdAgrupado(factory.idCampo);
            campo.atribuirLinhaLista(indice);

            linhaItem.append(campo.coluna);
            camposDaLinha.push(campo);
        }

        this.divSecao.append(linhaItem);
        linhaItem.before(hr);
        this.#camposLista.set(indice, camposDaLinha);
    }

    salvarCampos() {
        const campos = this.#camposLista.get(this.obterIndiceUltimaLinha());
        this.#colecao.salvarCampos(campos);

        if (this.obterIndiceUltimaLinha() > 0) {
            this.#validador.configurarValidacoesFixas(Utilitario.obterEtapa(), this.#colecao, this.obterIndiceUltimaLinha());
            this.#validador.configurarValidacoes(true);
        }
    }

    removerLinha(indice = 0) {
        $(`
            [${Constantes.campos.atributos.linhaListaObjetos}${this.id}="${indice}"],
            hr:has(+ [${Constantes.campos.atributos.linhaListaObjetos}${this.id}="${indice}"])
        `).remove();

        const lista = this.#camposLista.get(indice);
        this.#colecao.removerCampos(lista);
        this.#validador.removerCamposValidados(lista);
        this.#camposLista.delete(indice);

        this.#validador.configurarValidacoes(false);
    }

    obterIndiceUltimaLinha() {
        const chaves = this.#camposLista.keys().toArray();
        const indice = Math.max(...chaves);
        return indice === -Infinity ? -1 : indice;
    }

    configurarTitulo(elementoSecao = $("")) {
        // const colunaSuperior = $(`<div class="col-12"></div>`);
        const linhaTitulo = $(`<div class="row mt-3"></div>`);
        const colunaTitulo = $(`<div class="col"></div>`);
        const tituloSecao = $(`<div class="titulo-m"></div>`);
        tituloSecao.text(this.titulo);

        // colunaSuperior.append(linhaTitulo);
        linhaTitulo.append(colunaTitulo);

        if (this.#permiteAdicionarLinhas) {
            const colunaBotao = $(`<div class="col-2 d-flex justify-content-end"></div>`);

            const botaoNovaLinha = $(`
                <button type="button" title="Nova linha" id="novaLinha${this.id}" class="btn botao ms-3">
                    <i class="bi bi-plus fs-5 me-2"></i>Nova linha
                </button>
            `);

            if (Utilitario.obterEtapa() !== null) {
                botaoNovaLinha.on("click", () => {
                    this.adicionarLinha();
                });
            }
            else {
                botaoNovaLinha.prop("disabled", true);
            }

            colunaBotao.append(botaoNovaLinha);
            linhaTitulo.append(colunaBotao);
        }

        colunaTitulo.append(tituloSecao);
        // elementoSecao.append(colunaSuperior);
        elementoSecao.append(linhaTitulo);
        // elementoSecao.append(hr);
    }
}