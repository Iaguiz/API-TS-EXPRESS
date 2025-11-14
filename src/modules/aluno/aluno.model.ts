import mongoose, { Schema, Document } from "mongoose";

export interface IAluno extends Document {
  nome: string;
  email: string;
  curso?: mongoose.Types.ObjectId; // Referência ao Curso
  matricula?: string;
}

// Schema Mongoose
const AlunoSchema = new Schema<IAluno>(
  {
    nome: {
      type: String,
      required: true,
      trim: true, //Remove espaços em branco no início e no final do valor
      minlength: 2,
      maxlength: 120
    },
    email: { 
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true
    },
    curso: {
      type: Schema.Types.ObjectId, ref: "Curso" // Referência
    },
    matricula: {
      type: String,
      trim: true,
      unique: true,
      sparse: true // Permite que alguns alunos não tenham matrícula
    },
  },
  {
    timestamps: true // Cria createdAt e updatedAt Automáticos
  }
);

AlunoSchema.index({ curso: 1 });

// Exporta o model
export const Aluno = mongoose.model<IAluno>("Aluno", AlunoSchema);
