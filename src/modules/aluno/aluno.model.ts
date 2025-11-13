import mongoose, { Schema, Document, Model } from "mongoose";

// 1. INTERFACE
export interface IAluno extends Document {
    nome: string;
    email: string;
    curso?: string;
    matricula?: string;
}

const AlunoSchema = new Schema<IAluno>({
  nome: { type: String },
  email: { type: String },
  curso: { type: String },
  matricula: { type: String },
});
export const Aluno = mongoose.model<IAluno>("Aluno", AlunoSchema);
