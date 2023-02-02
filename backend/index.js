import express from "express";
import path from "path";

const __dirname = path.resolve();
const PORT = process.env.PORT || 9999;
const app = express();

app.use(express.static(path.resolve(__dirname, 'static')));
app.use(express.static(path.resolve(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve("static", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server started on ${PORT} port`)
});