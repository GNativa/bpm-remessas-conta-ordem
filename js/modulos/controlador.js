// Controlador
/*
    Responsável por inicializar o formulário e prover funcionalidades genéricas.
 */

class Controlador {
    // TODO: Injetar dependências pelo construtor
    #validador;
    #etapa;
    #colecao;
    #formulario;
    #inicializado;
    #accessToken;

    constructor(validador, colecao, formulario) {
        // Variáveis para uso na geração e validação do formulário.
        this.#validador = validador;
        this.#colecao = colecao;
        this.#etapa = null;
        this.#formulario = formulario;
        this.#inicializado = false; // Indica se o formulário foi inicializado
        this.#accessToken = null;   // Access token da plataforma

        // Interface da API do workflow (BPM) que lida com a inicialização, salvamento de dados e erros do formulário.
        // Função "_rollback" não implementada até o momento
        this.workflowCockpit = workflowCockpit({
            init: this._init,
            onSubmit: this._saveData,
            onError: this._rollback,
        });
    }

    // _init(data: ?, info: ?): void
    /*
        Inicialização do formulário através da API do workflow.
        Também será responsável por carregar as fontes de dados
        com o uso do token do usuário.
     */
     _init(data, info) {
        this.inicializar();
        const {initialVariables} = data["loadContext"];
        console.log(initialVariables);

        info["getUserData"]()
            .then(function (user) {
                console.log(user);
                /*
                {
                    "id": "",
                    "username": "",
                    "subject": "",
                    "fullname": "",
                    "email": "",
                    "tenantName": "",
                    "tenantLocale": "pt-BR",
                    "locale": "pt-BR"
                }
                 */
            })
            .then(function () {
                return info["getPlatformData"]();
            })
            .then((dados) => {
                this.#accessToken = dados["token"]["access_token"];
                return info["getInfoFromProcessVariables"]();
                //return carregarFontes(dados);
            })
            /*
            .then(function () {
                return info["getInfoFromProcessVariables"]();
            })
             */
            .then((data) => {
                console.log(data);

                if (!info["isRequestNew"]() && Array.isArray(data)) {
                    const mapa = new Map();

                    for (let i = 0; i < data.length; i++) {
                        mapa.set(data[i].key, data[i].value || "");
                    }

                    console.log("Carregando dados: ", mapa);
                    this.#formulario.carregarDados(mapa);

                    // Disparar eventos dos campos para ativar validações
                    this.#notificarCampos();
                }
            })
            .catch(function (error) {
                const mensagem = `Houve um erro ao inicializar o formulário: ${error}. `
                      + `Por gentileza, abra a solicitação novamente para prosseguir.`;
                Mensagem.exibir("Erro na inicialização do formulário",
                    mensagem,
                    "erro");
                throw error;
            });
    }

    // _saveData(data: ?, info: ?): Promise<{}>
    /*
        Valida o formulário e salva os dados na API do Workflow.
     */
    async _saveData(data, info) {
        this.#validarFormulario();

        let dados = await this.#formulario.salvarDados();
        console.log(dados);

        return {
            formData: dados,
        };
    }

    _rollback() {
        // A implementar.
    }

    // inicializar(): void
    /*
        Inicializa o formulário, podendo ser através da API workflow do Senior X ou localmente.
     */
    inicializar() {
        if (this.#inicializado) {
            return;
        }

        this.#configurarElementosFixos();

        this.#formulario.gerar();
        this.#formulario.configurarEventos();
        this.#formulario.definirEstadoInicial();

        // this.listarCampos();
        this.#configurarPlugins();
        this.#configurarAnimacoes();
        this.#configurarEtapa();
        this.#aplicarValidacoes();
        this.#inicializado = true;
    }

    #notificarCampos() {
        // Disparar eventos dos campos para ativar validações
        for (const campo of this.#colecao.obterCampos()) {
            campo.notificar();
        }
    }

    // listarCampos(): void
    /*
        Obtém os IDs dos campos na variável campos{} e os lista no console.
     */
    #listarCampos() {
        const ids = [];

        for (const campo of this.#colecao.obterCampos()) {
            ids.push(`"${campo.id}"`);
        }

        console.log(ids.join(", "));
    }

    // carregarFontes(dadosPlataforma: {}): void
    /*
        Carrega as fontes de dados definidas na classe Formulario usando o token de acesso do Senior X.
        TODO: carregar sob demanda
     */
    async #carregarFontes(dadosPlataforma) {
        const token = dadosPlataforma["token"]["access_token"];
        const fontes = this.#formulario.obterFontes();

        for (const nomeFonte in Formulario.fontes) {
            const fonte = Formulario.fontes[nomeFonte];

            fonte.definirDados(await Consultor.carregarFonte(fonte, token));
            console.log(fonte.dados);

            /* TODO: Trocar isso para variar conforme o tipo do campo ou algo assim
            for (const campo of fonte.camposCorrespondentes) {
                Formulario.campos[campo].adicionarOpcoes(fonte.obterOpcoes());
            }
             */
        }
    }

    /*
    atualizarCamposFonte(idFonte, registro) {
        if (!idFonte) {
            const msg = "O ID da fonte para atualização dos campos fonte não pode ser nulo.";
            Mensagem.exibir("Configurações inválidas", msg, "erro");
            throw new Error(msg);
        }

        const campos = this.#colecao.obterCampos();

        const camposAssociados = campos.filter((campo = new Campo()) => {
            return campo.fonte?.id === idFonte;
        });

        if (registro) {
            camposAssociados.forEach((campo) => {
                campo.notificar();
                campo.val(registro[campo.campoFonte]);
            });
        }
        else {
            camposAssociados.forEach((campo) => campo.val(""));
        }
    }
     */

    // configurarPlugins(): void
    /*
        Configura plugins que necessitam de inicialização na página.
     */
    #configurarPlugins() {
        const tooltipTriggerList =
            document.querySelectorAll(`[data-bs-toggle="tooltip"]`);
        const tooltipList = [...tooltipTriggerList].map(
            tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl)
        );
    }

    #configurarAnimacoes() {
        /*
        for (const campo of Formulario.campos) {
            if (campo.campoMestre) {

            }
        }
         */
    }

    // validarFormulario(): void
    /*
        Valida o formulário e exibe uma mensagem conforme o resultado da validação.
        Caso o formulário seja inválido, um erro é lançado para impedir que a plataforma prossiga
        com o envio dos dados.
     */
    #validarFormulario() {
        this.#validador.validarCampos();

        const titulo = "Validação";
        let mensagem = "Dados validados com sucesso.";

        if (!this.#validador.formularioValido()) {
            mensagem = "Dados inválidos. Preencha todos os campos obrigatórios e verifique as informações inseridas "
                + "no formulário para prosseguir.";
            Mensagem.exibir(titulo, mensagem, "aviso");
            throw new Error(mensagem);
        }

        Mensagem.exibir(titulo, mensagem, "sucesso");
    }

    // configurarEtapa(): void
    /*
        Configura as etapas do processo com base nos parâmetros da URL, usando como sufixo "?etapa=nomeDaEtapa&".
        Ex.: https://gnativa.github.io/bpm-clientes-fornecedores/?etapa=solicitacao&
        O "&" ao final é adicionado para considerar os parâmetros inseridos na URL pelo próprio Senior X.
     */
    #configurarEtapa() {
        const url = new URL(window.location.toLocaleString());
        const parametros = url.searchParams;
        const etapa = parametros.get("etapa");
        this.#etapa = etapa;

        const camposObrigatorios = this.#formulario.obterCamposObrigatorios();

        // Bloquear todos os campos caso o formulário seja acessado de modo avulso
        // Ex.: consulta da solicitação na Central de Tarefas
        if (etapa === null || !(this.#formulario.obterCamposObrigatorios().hasOwnProperty(etapa))) {
            const listasCampos = this.#colecao.obterListas().toArray();

            const validacao = new Validacao(() => {
                return true;
            }, null, listasCampos, null, null, null,
                listasCampos, null, null, true, true);

            this.#validador.adicionarValidacao(validacao);
            this.#validador.configurarValidacoes();

            return;
        }

        const camposBloqueados = this.#formulario.obterCamposBloqueados();
        const camposOcultos = this.#formulario.obterCamposOcultos();

        for (const idCampo of camposObrigatorios[etapa]) {
            const lista = this.#colecao.obterLista(idCampo);

            lista.forEach((campo = new Campo()) => campo.definirObrigatoriedade(true));
        }

        for (const idCampo of camposBloqueados[etapa]) {
            const lista = this.#colecao.obterLista(idCampo);

            lista.forEach((campo = new Campo()) => {
                campo.definirEdicao(false);
                campo.sobrescreverEditabilidade(true);
            });
        }

        for (const idCampo of camposOcultos[etapa]) {
            const lista = this.#colecao.obterLista(idCampo);

            lista.forEach((campo = new Campo()) => {
                campo.definirVisibilidade(false);
                campo.sobrescreverVisibilidade(true);
            });
        }
    }

    // configurarElementosFixos(): void
    /*
        Configura opções diversas de elementos fixos, como o botão de enviar utilizado para testes de validação
        do formulário.
     */
    #configurarElementosFixos() {
        const personalizacao = this.#formulario.obterPersonalizacao();

        $("#tituloFormulario").text(personalizacao.titulo);
        $("#botaoEnviar").on("click", () => {
            this.#validarFormulario();
        });

        // Configurar esquema de cores com base nas preferências do usuário
        // Temporariamente desabilitado, pois o Senior X fica sempre em modo claro
        /*
        const mql = window.matchMedia("(prefers-color-scheme: dark)");
        const eventoMediaQueryList = (e) => {
            if (e.matches) {
                $("body").attr("data-bs-theme", "dark");
                console.log("DARK");
            }
            else {
                $("body").attr("data-bs-theme", "light");
                console.log("LIGHT");
            }
        };

        eventoMediaQueryList(mql);
        mql.addEventListener("change", eventoMediaQueryList);
         */
    }

    // aplicarValidacoes(validacoes: array<Validacao>): void
    /*
        Define a lista de validações do validador e as configura.
     */
    #aplicarValidacoes() {
        if (this.#etapa === null) {
            return;
        }

        const validacoes = this.#formulario.obterValidacoes();
        this.#validador.definirValidacoes(validacoes);
        this.#validador.configurarValidacoes();
    }
}