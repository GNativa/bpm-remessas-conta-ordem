class ListaObjetos extends Secao {
    constructor(id, titulo, campos, factories = [], permiteCriarLinhas = true) {
        super(id, titulo, campos);
        this.factories = factories;
        this.camposLista = [];
        this.permiteCriarLinhas = permiteCriarLinhas;
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
            campo.campo.attr("id", novoId);

            linhaItem.append(campo.coluna);
            this.divSecao.append(linhaItem);
            camposDaLinha.push(campo);
        }

        this.camposLista.push(camposDaLinha);
    }

    removerLinha(indice) {
        $(`[data-linha-lista=${indice}]`).remove();
        this.camposLista.splice(indice, 1);
    }

    obterIndiceUltimaLinha() {
        return this.camposLista.length;
    }

    configurarTitulo(elementoSecao) {
        const linhaTitulo = $(`<div class="row mt-3"></div>`);

        const colunaTitulo = $(`<div class="col"></div>`);

        const tituloSecao = $(`<div class="titulo-m"></div>`);
        tituloSecao.text(this.titulo);

        const hr = $("<hr>");

        linhaTitulo.append(colunaTitulo);

        if (this.permiteCriarLinhas) {
            const colunaBotao = $(`<div class="col-1 d-flex justify-content-end"></div>`);

            const botaoNovaLinha = $(`
            <button type="button" id="novaLinha${this.id}" class="btn botao ms-3">
                <i class="bi bi-plus"></i>
            </button>
        `);

            botaoNovaLinha.on("click", () => {
                this.adicionarLinha();
            });

            colunaBotao.append(botaoNovaLinha);
            linhaTitulo.append(colunaBotao);
        }

        colunaTitulo.append(tituloSecao);
        elementoSecao.append(linhaTitulo);
        elementoSecao.append(hr);
    }
}