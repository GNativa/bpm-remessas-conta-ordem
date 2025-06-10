class CampoFactory {
    constructor(
        idCampo = "",
        construir = function(idCompleto = "") {
            return new Campo(idCompleto);
        }
    ) {
        this.idCampo = idCampo;
        this.construir = construir;
    }
}