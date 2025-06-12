// Controlador
/*
    Responsável por inicializar o formulário e prover funcionalidades genéricas.
 */

const Controlador = (() => {
    // Variáveis para uso na geração e validação do formulário.
    // TODO: Injetar dependências pelo construtor
    // Validador dos campos
    let validador = new Validador();
    let colecao = new ColecaoCampos();
    // Etapa atual do processo BPM
    let etapa = null;
    // Indica se o formulário foi inicializado
    let inicializado = false;
    // Access token da plataforma
    let accessToken = null;

    // Interface da API do workflow (BPM) que lida com a inicialização, salvamento de dados e erros do formulário.
    // Função "_rollback" não implementada até o momento
    this.workflowCockpit = workflowCockpit({
        init: _init,
        onSubmit: _saveData,
        onError: _rollback,
    });

    // _init(data: ?, info: ?): void
    /*
        Inicialização do formulário através da API do workflow.
        Também será responsável por carregar as fontes de dados
        com o uso do token do usuário.
     */
    function _init(data, info) {
        inicializar();
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
            .then(function (dados) {
                accessToken = dados["token"]["access_token"];
                return info["getInfoFromProcessVariables"]();
                //return carregarFontes(dados);
            })
            /*
            .then(function () {
                return info["getInfoFromProcessVariables"]();
            })
             */
            .then(function (data) {
                console.log(data);

                if (!info["isRequestNew"]() && Array.isArray(data)) {
                    const mapa = new Map();

                    for (let i = 0; i < data.length; i++) {
                        mapa.set(data[i].key, data[i].value || "");
                    }

                    console.log("Carregando dados: ", mapa);
                    Formulario.carregarDados(mapa);

                    // Disparar eventos dos campos para ativar validações
                    notificarCampos();
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
    async function _saveData(data, info) {
        validarFormulario();

        let dados = await Formulario.salvarDados();
        console.log(dados);

        return {
            formData: dados,
        };
    }

    function _rollback() {
        // A implementar.
    }

    // inicializar(): void
    /*
        Inicializa o formulário, podendo ser através da API workflow do Senior X ou localmente.
     */
    function inicializar() {
        if (inicializado) {
            return;
        }

        configurarElementosFixos();

        Formulario.gerar();
        Formulario.configurarEventos();
        Formulario.definirEstadoInicial();

        const colecao = new ColecaoCampos();

        // listarCampos();
        configurarPlugins();
        configurarAnimacoes();
        configurarEtapas(colecao);
        aplicarValidacoes(Formulario.obterValidacoes());
        inicializado = true;
    }

    function notificarCampos() {
        // Disparar eventos dos campos para ativar validações
        for (const campo of colecao.obterCampos()) {
            campo.notificar();
        }
    }

    // listarCampos(): void
    /*
        Obtém os IDs dos campos na variável campos{} e os lista no console.
     */
    function listarCampos(colecao = new ColecaoCampos()) {
        const ids = [];

        for (const campo of colecao.obterCampos()) {
            ids.push(`"${campo.id}"`);
        }

        console.log(ids.join(", "));
    }

    // carregarFontes(dadosPlataforma: {}): void
    /*
        Carrega as fontes de dados definidas na classe Formulario usando o token de acesso do Senior X.
        TODO: carregar sob demanda
     */
    async function carregarFontes(dadosPlataforma) {
        const token = dadosPlataforma["token"]["access_token"];

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

    function atualizarCamposFonte(idFonte, registro) {
        if (!idFonte) {
            const msg = "O ID da fonte para atualização dos campos fonte não pode ser nulo.";
            Mensagem.exibir("Configurações inválidas", msg, "erro");
            throw new Error(msg);
        }

        const camposAssociados = colecao.obterCampos().filter((campo = new Campo()) => {
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

    // configurarPlugins(): void
    /*
        Configura plugins que necessitam de inicialização na página.
     */
    function configurarPlugins() {
        const tooltipTriggerList =
            document.querySelectorAll(`[data-bs-toggle="tooltip"]`);
        const tooltipList = [...tooltipTriggerList].map(
            tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl)
        );
    }

    function configurarAnimacoes() {
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
    function validarFormulario() {
        validador.validarCampos();

        const titulo = "Validação";
        let mensagem = "Dados validados com sucesso.";

        if (!validador.formularioValido()) {
            mensagem = "Dados inválidos. Preencha todos os campos obrigatórios e verifique as informações inseridas "
                + "no formulário para prosseguir.";
            Mensagem.exibir(titulo, mensagem, "aviso");
            throw new Error(mensagem);
        }

        Mensagem.exibir(titulo, mensagem, "sucesso");
    }

    function obterToken() {
        return accessToken;
    }

    // configurarEtapas(): void
    /*
        Configura as etapas do processo com base nos parâmetros da URL, usando como sufixo "?etapa=nomeDaEtapa&".
        Ex.: https://gnativa.github.io/bpm-clientes-fornecedores/?etapa=solicitacao&
        O "&" ao final é adicionado para considerar os parâmetros inseridos na URL pelo próprio Senior X.
     */
    function configurarEtapas(colecao = new ColecaoCampos()) {
        const url = new URL(window.location.toLocaleString());
        const parametros = url.searchParams;
        etapa = parametros.get("etapa");

        // Bloquear todos os campos caso o formulário seja acessado de modo avulso
        // Ex.: consulta da solicitação na Central de Tarefas
        if (etapa === null || !(etapa in Formulario.camposObrigatorios)) {
            for (const campo of colecao.obterCampos()) {
                campo.definirEdicao(false);
                campo.sobrescreverEditabilidade(true);
                campo.sobrescreverObrigatoriedade(true);
            }

            return;
        }

        for (const idCampo of Formulario.camposObrigatorios[etapa]) {
            const lista = colecao.obterLista(idCampo);
            lista.forEach((campo = new Campo()) => campo.definirObrigatoriedade(true));
        }

        for (const idCampo of Formulario.camposBloqueados[etapa]) {
            const lista = colecao.obterLista(idCampo);
            lista.forEach((campo = new Campo()) => {
                campo.definirEdicao(false);
                campo.sobrescreverEditabilidade(true);
            });
        }

        for (const idCampo of Formulario.camposOcultos[etapa]) {
            const lista = colecao.obterLista(idCampo);
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
    function configurarElementosFixos() {
        $("#tituloFormulario").text(Formulario.personalizacao.titulo);
        $("#botaoEnviar").on("click", function () {
            validarFormulario();
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
    function aplicarValidacoes(validacoes) {
        validador.validacoes = validacoes;
        validador.configurarValidacoes();
    }

    return {
        obterToken, atualizarCamposFonte, inicializar
    };
})();