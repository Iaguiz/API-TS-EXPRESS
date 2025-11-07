import mongoose, { Schema, Document } from "mongoose";

export interface IAluno extends Document {
    nome: string;
    email: string;
    curso?: string;
    matricula?: string;
}