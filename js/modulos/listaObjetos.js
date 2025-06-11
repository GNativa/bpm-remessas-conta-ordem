class ListaObjetos extends Secao {
    constructor(id, titulo, campos, factories = [], permiteAdicionarLinhas = true, permiteRemoverLinhas = true) {
        super(id, titulo, campos);
        this.factories = factories;
        this.camposLista = [];
        this.permiteAdicionarLinhas = permiteAdicionarLinhas;
        this.permiteRemoverLinhas = permiteRemoverLinhas;
    }

    adicionarLinha() {
        const indiceUltimaLinha = this.obterIndiceUltimaLinha();

        const linhaItem = $(`<div data-linha-lista='${indiceUltimaLinha}' class="row g-3"></div>`);
        const colunaBotaoRemover = $(`<div class="col-12 d-flex justify-content-end"></div>`);
        const botaoRemover = $(`
            <button type="button" title="Remover linha" id="removerLinhaSecao${this.id}${indiceUltimaLinha}" class="btn botao ms-3">
                <i class="bi bi-x fs-5"></i>
            </button>`);

        botaoRemover.on("click", () => {
            this.removerLinha(indiceUltimaLinha);
        });

        if (!this.permiteRemoverLinhas) {
            botaoRemover.prop("disabled", true);
        }

        if (indiceUltimaLinha === 0) {
            botaoRemover.prop("disabled", true);
        }
        else if (indiceUltimaLinha > 0) {
            linhaItem.addClass("mt-1");
        }

        colunaBotaoRemover.append(botaoRemover);
        linhaItem.append(colunaBotaoRemover);
        this.divSecao.append(linhaItem);

        const camposDaLinha = [];

        for (const factory of this.factories) {
            const novoId = `${factory.idCampo}${indiceUltimaLinha}`;

            if (document.getElementById(novoId) !== null) {
                throw Error(`Já existe um campo com o id "${novoId}".`);
            }

            const campo = factory.construir(novoId);
            campo.definirListaDeObjetos(this);

            linhaItem.append(campo.coluna);
            camposDaLinha.push(campo);
        }

        this.divSecao.append(linhaItem);
        this.camposLista.push(camposDaLinha);
    }

    gerar() {
        super.gerar();
        // this.divSecao.addClass("row");
    }

    removerLinha(indice) {
        $(`[data-linha-lista=${indice}]`).remove();
        this.camposLista.splice(indice, 1);
    }

    obterIndiceUltimaLinha() {
        return this.camposLista.length;
    }

    configurarTitulo(elementoSecao) {
        // const colunaSuperior = $(`<div class="col-12"></div>`);

        const linhaTitulo = $(`<div class="row mt-3"></div>`);

        const colunaTitulo = $(`<div class="col"></div>`);

        const tituloSecao = $(`<div class="titulo-m"></div>`);
        tituloSecao.text(this.titulo);

        const hr = $("<hr>");

        // colunaSuperior.append(linhaTitulo);
        linhaTitulo.append(colunaTitulo);

        if (this.permiteAdicionarLinhas) {
            const colunaBotao = $(`<div class="col-2 d-flex justify-content-end"></div>`);

            const botaoNovaLinha = $(`
                <button type="button" title="Nova linha" id="novaLinha${this.id}" class="btn botao ms-3">
                    <i class="bi bi-plus fs-5 me-2"></i>Nova linha
                </button>
            `);

            botaoNovaLinha.on("click", () => {
                this.adicionarLinha();
            });

            colunaBotao.append(botaoNovaLinha);
            linhaTitulo.append(colunaBotao);
        }

        colunaTitulo.append(tituloSecao);
        // elementoSecao.append(colunaSuperior);
        elementoSecao.append(linhaTitulo);
        elementoSecao.append(hr);
    }
}