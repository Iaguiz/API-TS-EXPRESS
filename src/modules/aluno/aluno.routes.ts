import { Router, Request, Response } from "express";
// Linha 2 Corrigida:
import { AlunoModel } from "./aluno.model";

const router = Router();

// Rota POST /alunos - Criar novo aluno
router.post("/", async (req: Request, res: Response) => {
    try {
        // 1. Extrai dados do corpo da requisição (JSON)
        const { nome, email, curso, matricula } = req.body;

        // 2. Validação básica (nome e email são obrigatórios)
        if (!nome || !email) {
            return res.status(400).json({ error: "Nome e email são obrigatórios" });
        }

        // 3. Cria o aluno no banco de dados
        // Linha 18 Corrigida:
        const novoAluno = await AlunoModel.create({ nome, email, curso, matricula });
        // 4. Retorna a resposta de sucesso (Código 201 Created)
        return res.status(201).json(novoAluno);

    } catch (e: any) {
        // 5. Tratamento de erro para valores duplicados (MongoDB unique)
        if (e.code === 11000) {
            // 11000 é o código de erro do Mongo para valores duplicados (unique index)
            return res.status(409).json({ error: "Email ou matrícula já cadastrados" });
        }

        // 6. Tratamento de erro genérico
        console.error("Erro ao criar aluno:", e);
        return res.status(500).json({ error: "Erro interno ao criar aluno" });
    }
});

export default router;