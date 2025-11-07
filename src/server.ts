import "dotenv/config";
import app from "./app";
import { connectDB } from "./config/db";

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI as string;

(async () => {
    await connectDB(MONGODB_URI);
    app.listen(PORT, () => {
        console.log(`HTTP http://localhost:${PORT}`);
    });
})();