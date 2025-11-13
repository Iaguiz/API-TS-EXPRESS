import mongoose, { Schema, Document, Model } from "mongoose";

// 1. INTERFACE
export interface IAluno extends Document {
    nome: string;
    email: string;
    curso?: string;
    matricula?: string;
}

// 2. SCHEMA (a estrutura com validações)
const AlunoSchema: Schema = new Schema({
    nome: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true // Garante unicidade, importante para o tratamento de erro 11000
    },
    curso: { 
        type: String, 
        required: false 
    },
    matricula: { 
        type: String, 
        required: false,
        unique: true 
    },
}, 
{
    timestamps: true 
});

// 3. MODELO (a classe que interage com o MongoDB)
// Esta é a classe que você DEVE importar nas rotas
export const AlunoModel: Model<IAluno> = mongoose.model<IAluno>("Aluno", AlunoSchema);