$(document).ready(() => {
    const validador = new Validador();
    const colecao = new ColecaoCampos();

    const controlador = new Controlador(validador, colecao, new Formulario(colecao, validador));
    controlador.inicializar();
});