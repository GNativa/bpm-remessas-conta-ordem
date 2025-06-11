class CampoFactory {
    constructor(
        idCampo = "",
        funcaoConstrutora = function(idCompleto = "") {
            return new Campo(idCompleto);
        }
    ) {
        this.idCampo = idCampo;
        this.funcaoConstrutora = funcaoConstrutora;
    }

    construir(id) {
        return this.funcaoConstrutora(id);
    }
}