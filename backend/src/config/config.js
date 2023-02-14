import path from "path";

export default {
    defaultPort: 8081,
    db: {
        database: process.env.DB_NAME || 'image_host',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        options: {
            dialect: process.env.DB_DIALECT || 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432
        }
    },
    uploadsDir: 'uploads',
    image: {
        validImageExtensions: [".jpg", ".jpeg", ".png"],
        thumbnailSize: 300,
        defaultSize: 2000,
    }
}