class Validacao {
    static proximoId = 1;

    constructor(ativa = () => { return false; }, feedback, camposMonitorados = [],
                camposConsistidos = [], camposObrigatorios = [], camposOcultos = [],
                camposDesabilitados = [], camposExibidos = [], camposHabilitados = [],
                sobrescreverObrigatoriedade = false, sobrescreverEditabilidade = false) {
        this.id = Validacao.proximoId;
        Validacao.proximoId++;
        this.ativa = ativa;
        this.feedback = feedback;
        this.camposMonitorados = camposMonitorados ?? [];
        this.camposConsistidos = camposConsistidos ?? [];
        this.camposObrigatorios = camposObrigatorios ?? [];
        this.camposOcultos = camposOcultos ?? [];
        this.camposDesabilitados = camposDesabilitados ?? [];
        this.camposExibidos = camposExibidos ?? [];
        this.camposHabilitados = camposHabilitados ?? [];
        this.sobrescreverObrigatoriedade = sobrescreverObrigatoriedade ?? false;
        this.sobrescreverEditabilidade = sobrescreverEditabilidade ?? false;
    }
}

class Validador {
    constructor(validacoes = []) {
        this.validacoes = validacoes;
    }

    adicionarValidacao(validacao) {
        this.validacoes.push(validacao);
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
    // em um campo monitorado e em campos que devem se tornar obrigatórios, serem exibidos, escondidos, etc.,
    // conforme a validação
    configurarValidacao(
        validacao = new Validacao(),
        campoMonitorado = new Campo(),
        campos = [new Campo()],
        configurar = (campo = new Campo()) => {}
    ) {
        if (this.filtrarCamposDaMesmaLinha(campoMonitorado, campos).length === 0) {
            return;
        }

        campoMonitorado.adicionarEvento("change", () => {
            for (const campo of this.filtrarCamposDaMesmaLinha(campoMonitorado, campos)) {
                configurar(campo);
                campo.sobrescreverEditabilidade(validacao.sobrescreverEditabilidade);
                campo.sobrescreverObrigatoriedade(validacao.sobrescreverObrigatoriedade);
            }
        });
    }

    configurarParaUmCampo(validacao = new Validacao(), campo = new Campo()) {
        this.configurarValidacao(
            validacao,
            campo,
            validacao.camposConsistidos.flat(),
            (consistido) => {
                if (consistido["consistenciaAtiva"] !== null
                    && consistido["consistenciaAtiva"]["id"] !== validacao["id"]) {
                    return;
                }

                if (validacao.ativa() && consistido["consistenciaAtiva"] === null) {
                    consistido.definirConsistenciaAtiva(validacao);
                }
                else if (!validacao.ativa()
                    && consistido["consistenciaAtiva"] !== null
                    && consistido["consistenciaAtiva"]["id"] === validacao["id"]) {
                    consistido.definirConsistenciaAtiva(null);
                }

                consistido.definirValidez(!validacao.ativa());
                consistido.definirFeedback(validacao.feedback ?? "");
                consistido.mostrarFeedback(validacao.ativa());
            }
        );

        this.configurarValidacao(
            validacao,
            campo,
            validacao.camposObrigatorios.flat(),
            (obrigatorio) => {
                obrigatorio.definirObrigatoriedade(validacao.ativa());
            }
        );

        this.configurarValidacao(
            validacao,
            campo,
            validacao.camposOcultos.flat(),
            (oculto) => {
                oculto.definirVisibilidade(!validacao.ativa());
            }
        );

        this.configurarValidacao(
            validacao,
            campo,
            validacao.camposDesabilitados.flat(),
            (desabilitado) => {
                desabilitado.definirEdicao(!validacao.ativa());
            }
        );

        this.configurarValidacao(
            validacao,
            campo,
            validacao.camposExibidos.flat(),
            (exibido) => {
                exibido.definirVisibilidade(validacao.ativa());
            }
        );

        this.configurarValidacao(
            validacao,
            campo,
            validacao.camposHabilitados.flat(),
            (habilitado) => {
                habilitado.definirEdicao(validacao.ativa());
            }
        );

        campo.notificar();
    }

    configurarValidacoes() {
        for (const validacao of this.validacoes) {
            //const monitorados = [...validacao.camposMonitorados];

            for (const campo of validacao.camposMonitorados.flat()) {
                this.configurarParaUmCampo(validacao, campo)
            }
        }
    }
}