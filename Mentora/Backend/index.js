const mongoose = require('mongoose');
const app = require("./app");

const {
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    API_VERSION,
    IP_SERVER
} = require("./constants");

const MONGO_URI = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}`;
const port = process.env.PORT || 3977;
console.log("=== LA URI DETECTADA ES ==> ", MONGO_URI);
mongoose.set('debug', true);

mongoose.connect(MONGO_URI)
    .then(() => {
        app.listen(port, () => {
            console.log(`Servidor corriendo en http://${IP_SERVER}:${port}/api/${API_VERSION}`);
        });

        console.log("La conexion con la base de datos ha sido exitosa");
    })
    .catch(error => {
        console.log("Error de conexion:", error.message);
    });