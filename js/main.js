$(document).ready(() => {
    const validador = new Validador();
    const colecao = new ColecaoCampos();

    const controlador = new Controlador(validador, colecao, new Formulario(colecao, validador));

    controlador.inicializar();

    /*
    try {
        controlador.inicializar();
    }
    catch (e) {
        Mensagem.exibir(
            "Erro na inicialização",
            `Houve um erro ao inicializar o formulário: ${e}`,
            "ERRO"
        );
    }
     */
});