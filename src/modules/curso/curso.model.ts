import mongoose, { Schema,Document } from "mongoose";

export interface ICurso extends Document {
    nome: string;
    codigo: string; // ex.: ADS, SI, LOG
}

const CursoSchema = new Schema<ICurso>(
    {
        nome: { type: String, required: true, trim: true, minlength: 2, maxlength: 120},
        codigo: { type: String, required: true, trim: true, uppercase: true, unique: true}
    },
    { timestamps: true }
);

export const Curso = mongoose.model<ICurso>("Curso", CursoSchema);