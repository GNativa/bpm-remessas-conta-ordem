class Validacao {
    static #proximoId = 1;

    constructor(ativa = (campo) => false, feedback, camposMonitorados,
                camposConsistidos, camposObrigatorios, camposOcultos,
                camposDesabilitados, camposExibidos, camposHabilitados,
               afetaVariasLinhas = false) {
        this.id = Validacao.#proximoId;
        Validacao.#proximoId++;
        this.ativa = ativa;
        this.feedback = feedback;
        this.camposMonitorados = Utilitario.criarGetterDeArray(camposMonitorados);
        this.camposConsistidos = Utilitario.criarGetterDeArray(camposConsistidos);
        this.camposObrigatorios = Utilitario.criarGetterDeArray(camposObrigatorios);
        this.camposOcultos = Utilitario.criarGetterDeArray(camposOcultos);
        this.camposDesabilitados = Utilitario.criarGetterDeArray(camposDesabilitados);
        this.camposExibidos = Utilitario.criarGetterDeArray(camposExibidos);
        this.camposHabilitados = Utilitario.criarGetterDeArray(camposHabilitados);
        this.afetaVariasLinhas = afetaVariasLinhas ?? false;
    }
}

class Validador {
    #validacoes;
    #camposJaConfigurados;
    #camposObrigatorios;
    #camposBloqueados;
    #camposOcultos;

    constructor(validacoes = []) {
        this.#validacoes = validacoes;
        this.#camposJaConfigurados = [];
        this.#camposObrigatorios = null;
        this.#camposBloqueados = null;
        this.#camposOcultos = null;
    }

    adicionarValidacao(validacao) {
        this.#validacoes.push(validacao);
    }

    definirValidacoes(validacoes) {
        this.#validacoes = validacoes;
    }

    validarCampos() {
        $(".campo")
            .trigger("change")
            .filter("[required]:visible")
            .filter(":not([disabled])")
            .filter(function () {
                return (this.type === "checkbox" && !this.checked) || (this.type !== "checkbox" && this.value === "");
            })
            // .addClass("invalido")
            .trigger("change")
            .trigger("blur.obrigatorio");
    }

    validarCamposObrigatorios() {
        $("[required]:visible").trigger("blur.obrigatorio");
    }

    formularioValido() {
        return $(".invalido:visible").length === 0 && $(".nao-preenchido:visible").length === 0;
    }

    // Filtrar campos que pertencem à mesma linha de uma lista de objetos
    // que a do campo base; retornar a lista como está caso o campo não pertença a uma lista de objetos
    filtrarCamposDaMesmaLinha(campoBase = new Campo(), campos = [new Campo()]) {
        if (campoBase.listaDeObjetos == null) {
            return campos;
        }

        return campos.filter(function(elemento) {
            return elemento.linhaLista !== null
                && elemento.listaDeObjetos === campoBase.listaDeObjetos
                && elemento.linhaLista === campoBase.linhaLista;
        });
    }

    // Executar uma função de configuração para uma determinada validação com base
    // em um campo monitorado e em campos que devem se tornar obrigatórios, serem exibidos, ocultos, etc.,
    // conforme a validação
    #configurarValidacao(
        validacao ,
        campoMonitorado,
        obterCampos,
        configurar
    ) {
        const campos = obterCampos().flat();

        if (campos.length === 0) {
            return;
        }

        if (!validacao.afetaVariasLinhas && this.filtrarCamposDaMesmaLinha(campoMonitorado, campos).length === 0) {
            return;
        }

        campoMonitorado.adicionarEvento("change", () => {
            let listaCampos;

            if (validacao.afetaVariasLinhas) {
                listaCampos = obterCampos();
            }
            else {
                listaCampos = this.filtrarCamposDaMesmaLinha(campoMonitorado, obterCampos());
            }

            for (const campo of listaCampos) {
                configurar(campo);
                // campo.sobrescreverEdicao(validacao.sobrescreverEdicao);
                // campo.sobrescreverObrigatoriedade(validacao.sobrescreverObrigatoriedade);
            }
        });
    }

    removerCampoValidado(campo = new Campo) {
        this.#camposJaConfigurados = this.#camposJaConfigurados.filter((campoConfigurado) => {
            return campoConfigurado.id !== campo.id;
        });
    }

    removerCamposValidados(campos = [new Campo()]) {
        for (const campo of campos) {
            this.removerCampoValidado(campo);
        }
    }

    configurarParaUmCampo(validacao = new Validacao(), campo = new Campo()) {
        this.#configurarValidacao(
            validacao,
            campo,
            validacao.camposConsistidos,
            (consistido) => {
                if (consistido["consistenciaAtiva"] !== null
                    && consistido["consistenciaAtiva"]["id"] !== validacao["id"]) {
                    return;
                }

                const ativa = validacao.ativa(campo);

                if (ativa && consistido["consistenciaAtiva"] === null) {
                    consistido.definirConsistenciaAtiva(validacao);
                }
                else if (!ativa
                    && consistido["consistenciaAtiva"] !== null
                    && consistido["consistenciaAtiva"]["id"] === validacao["id"]) {
                    consistido.definirConsistenciaAtiva(null);
                }

                consistido.definirValidez(!ativa);
                consistido.definirFeedback(validacao.feedback ?? "");
                consistido.mostrarFeedback(ativa);
            }
        );

        this.#configurarValidacao(
            validacao,
            campo,
            validacao.camposObrigatorios,
            (obrigatorio) => {
                obrigatorio.definirObrigatoriedade(validacao.ativa(campo));
            }
        );

        this.#configurarValidacao(
            validacao,
            campo,
            validacao.camposOcultos,
            (oculto) => {
                oculto.definirVisibilidade(!validacao.ativa(campo));
            }
        );

        this.#configurarValidacao(
            validacao,
            campo,
            validacao.camposDesabilitados,
            (desabilitado) => {
                desabilitado.definirEdicao(!validacao.ativa(campo));
            }
        );

        this.#configurarValidacao(
            validacao,
            campo,
            validacao.camposExibidos,
            (exibido) => {
                exibido.definirVisibilidade(validacao.ativa(campo));
            }
        );

        this.#configurarValidacao(
            validacao,
            campo,
            validacao.camposHabilitados,
            (habilitado) => {
                habilitado.definirEdicao(validacao.ativa(campo));
            }
        );

        campo.notificar();
    }

    configurarValidacoes(verificarConfigurados) {
        for (const validacao of this.#validacoes) {
            let camposMonitorados = validacao.camposMonitorados();
            camposMonitorados = camposMonitorados.flat();

            if (verificarConfigurados) {
                camposMonitorados = camposMonitorados.filter((campo) => {
                    return campo.obterValidacoes().indexOf(validacao) === -1;
                });
            }

            for (const campo of camposMonitorados) {
                this.configurarParaUmCampo(validacao, campo);
                campo.adicionarValidacao(validacao);
            }
        }
    }

    definirCamposObrigatorios(campos) {
        this.#camposObrigatorios = campos;
    }

    definirCamposBloqueados(campos) {
        this.#camposBloqueados = campos;
    }

    definirCamposOcultos(campos) {
        this.#camposOcultos = campos;
    }

    obterCamposObrigatorios() {
        return Object.freeze(this.#camposObrigatorios);
    }

    obterCamposBloqueados() {
        return Object.freeze(this.#camposBloqueados);
    }

    obterCamposOcultos() {
        return Object.freeze(this.#camposOcultos);
    }

    #obterCampo(colecao, idCampo, linha) {
        return colecao.obter(idCampo).find((campo) => {
            return campo.linhaLista === null || campo.linhaLista === linha;
        });
    }

    configurarValidacoesFixas(etapa, colecao, linha) {
        // Bloquear todos os campos caso o formulário seja acessado de modo avulso
        // Ex.: consulta da solicitação na Central de Tarefas
        if (etapa === null || !(this.obterCamposObrigatorios().hasOwnProperty(etapa))) {
            const campos = colecao.obterTodosCampos().filter((campo) => {
                return this.#camposJaConfigurados.indexOf(campo) === -1
                    && (campo.linhaLista === null || campo.linhaLista === linha);
            });

            for (const campo of campos) {
                campo.definirObrigatoriedade(false);
                campo.sobrescreverObrigatoriedade(true);
                campo.definirEdicao(false);
                campo.sobrescreverEdicao(true);

                this.#camposJaConfigurados.push(campo);
            }

            return;
        }

        for (const etapa in this.#camposObrigatorios) {
            for (const idCampo of this.#camposObrigatorios[etapa]) {
                const campo = this.#obterCampo(colecao, idCampo, linha);

                campo.definirObrigatoriedade(true);
            }
        }

        for (const etapa in this.#camposBloqueados) {
            for (const idCampo of this.#camposBloqueados[etapa]) {
                const campo = this.#obterCampo(colecao, idCampo, linha);

                campo.definirEdicao(false);
                campo.sobrescreverEdicao(true);
            }
        }

        for (const etapa in this.#camposOcultos) {
            for (const idCampo of this.#camposOcultos[etapa]) {
                const campo = this.#obterCampo(colecao, idCampo, linha);

                campo.definirVisibilidade(false);
                campo.sobrescreverVisibilidade(true);
            }
        }
    }
}