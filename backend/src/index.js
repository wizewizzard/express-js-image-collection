import express from "express";
import path from "path";
import config from "./config/config.js";
import initRoutes from "./routes.js";

const __dirname = path.resolve();
const PORT = process.env.PORT || config.defaultPort;
const app = express();

app.use(express.static(path.resolve(__dirname, 'static')));
app.use(express.static(path.resolve(__dirname, 'uploads')));

initRoutes(app);

app.listen(PORT, () => {
    console.log(`Server started on ${PORT} port`)
});

// sequelize.sync()
// .then(() => {
//     app.listen(PORT, () => {
//         console.log(`Server started on ${PORT} port`)
//     });
// });



