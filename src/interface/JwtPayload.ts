export interface JwtPayload {
    name: string;
}

// Tu aplicación espera que, al validar un token, el contenido que saques (el payload) tendrá al 
// menos esa propiedad name que puedes usar para buscar al usuario (o dictador) en la base de datos.

