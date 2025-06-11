/*
    - Seção: agrupamento de campos que pode possuir um título ou não, servindo como quebra de linha quando
    gerada sem um título.
 */

class Secao {
    constructor(id, titulo, campos) {
        this.id = id;
        this.titulo = titulo;
        this.possuiTitulo = titulo !== undefined && titulo !== null;
        this.gerada = false;
        this.elemento = $();
        this.divSecao = $("<div></div>");
        this.campos = campos ?? [];
    }

    configurarTitulo(elementoSecao) {
        const linhaTitulo = $(`<div class="row linha-titulo"></div>`);
        const colunaTitulo = $(`<div class="col coluna-titulo"></div>`);
        const tituloSecao = $(`<div class="titulo-g"></div>`);
        tituloSecao.text(this.titulo);

        const hr = $(`<hr class="hr-titulo border-3">`);
        linhaTitulo.append(colunaTitulo);
        colunaTitulo.append(tituloSecao);
        elementoSecao.append(linhaTitulo);
        elementoSecao.append(hr);
    }

    adicionarLinha() {
        const linhaCampos = $(`<div class="row g-3"></div>`);

        for (const campo of this.campos) {
            if (document.getElementById(campo.id) !== null) {
                throw Error(`Já existe um campo com o id "${id}".`);
            }

            linhaCampos.append(campo.coluna);
            this.divSecao.append(linhaCampos);
        }
    }

    gerar() {
        const gerada = this.gerada;
        const secao = this.divSecao;

        if (gerada) {
            return null;
        }

        const id = this.id;
        const possuiTitulo = this.possuiTitulo;

        secao.attr("id", id);
        secao.addClass("mb-4");

        if (possuiTitulo) {
            this.configurarTitulo(secao);
        }

        this.adicionarLinha();
        const elemento = $(secao);
        $("#containerFormulario").append(elemento);

        this.elemento = elemento;
        this.gerada = true;
        return this;
    }

    definirVisibilidade(visivel) {
        this.visivel = visivel;

        if (this.visivel) {
            this.elemento.show();
        }
        else {
            this.elemento.hide();
        }

        return this;
    }

    adicionarCampo(campo) {
        this.campos.push(campo);
    }
}