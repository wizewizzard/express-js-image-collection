import express from "express";
import path from "path";

const __dirname = path.resolve();
const PORT = process.env.PORT || 9999;
const app = express();

app.get('/', (req, resp) => {
    resp.sendFile(path.resolve("static", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server started on ${PORT} port`)
});