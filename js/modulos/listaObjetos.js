class ListaObjetos extends Secao {
    constructor(id, titulo, campos, colecao, factories, permiteAdicionarLinhas = true, permiteRemoverLinhas = true) {
        super(id, titulo, campos, colecao);
        this.factories = factories ?? [];
        this.camposLista = new Map();
        this.permiteAdicionarLinhas = permiteAdicionarLinhas;
        this.permiteRemoverLinhas = permiteRemoverLinhas;
    }

    criarLinha() {
        const indice = this.obterIndiceUltimaLinha() + 1;

        const linhaItem = $(`<div ${Constantes.campos.atributos.linhaListaObjetos}${this.id}="${indice}" class="row g-3"></div>`);
        const colunaBotaoRemover = $(`<div class="col-12 d-flex justify-content-end"></div>`);
        const botaoRemover = $(`
            <button type="button" title="Remover linha" id="removerLinhaSecao${this.id}${indice}" class="btn botao ms-3">
                <i class="bi bi-x fs-5"></i>
            </button>
        `);

        botaoRemover.on("click", () => {
            this.removerLinha(indice);
        });

        if (!this.permiteRemoverLinhas) {
            botaoRemover.prop("disabled", true);
        }

        const hr = $("<hr>");

        if (indice === 0) {
            botaoRemover.prop("disabled", true);
            hr.addClass("border-2");
        }
        else {
            hr.addClass("border-1");
            //linhaItem.addClass("mt-1");
        }

        colunaBotaoRemover.append(botaoRemover);
        linhaItem.append(colunaBotaoRemover);
        this.divSecao.append(linhaItem);

        const camposDaLinha = [];

        for (const factory of this.factories) {
            const novoId = `${factory.idCampo}${indice}`;

            if (document.getElementById(novoId) !== null) {
                throw Error(`Já existe um campo com o id "${novoId}".`);
            }

            const campo = factory.construir(novoId);
            campo.atribuirListaObjetos(this);
            campo.atribuirIdAgrupado(factory.idCampo);
            campo.atribuirLinhaLista(indice);

            // TODO: Efetuar configuração das validações na nova linha (camposMonitorados)

            linhaItem.append(campo.coluna);
            camposDaLinha.push(campo);
        }

        this.divSecao.append(linhaItem);
        linhaItem.before(hr);
        this.camposLista.set(indice, camposDaLinha);
    }

    salvarCampos() {
        const campos = this.camposLista.get(this.obterIndiceUltimaLinha());
        this.colecao.salvarCampos(campos);
    }

    removerLinha(indice = 0) {
        $(`
            [${Constantes.campos.atributos.linhaListaObjetos}${this.id}="${indice}"],
            hr:has(+ [${Constantes.campos.atributos.linhaListaObjetos}${this.id}="${indice}"])
        `).remove();

        this.colecao.removerCampos(this.camposLista.get(indice));
        this.camposLista.delete(indice);
    }

    obterIndiceUltimaLinha() {
        const chaves = this.camposLista.keys().toArray();
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
        // elementoSecao.append(hr);
    }
}