import mongoose from "mongoose";

export async function connectDB(uri: string) {
    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 8000,
        } as any);

        console.log("MongoDB conectado");
    } catch (err: any) {
        console.error("Erro ao conectar no MongoDB:", err?.message || err);
        process.exit(1);
    }
}