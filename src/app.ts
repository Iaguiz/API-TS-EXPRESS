import express from "express";
import cors from "cors";
import alunoRoutes from "./modules/aluno/aluno.routes";
import cursoRoutes from "./modules/curso/curso.routes";

const app = express();

app.use(cors());
app.use(express.json());
      
// rota de saúde (teste)
app.get("/health", (_req, res) => {   
    res.status(200).json({ok: true, api: "express+ts"});
});

//rotas de aluno
app.use("/alunos", alunoRoutes);
app.use("/cursos", cursoRoutes);


export default app;