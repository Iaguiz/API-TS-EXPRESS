import { Router, Request, Response } from "express";
import { Aluno } from "./aluno.model";

const router = Router();

// POST /alunos - criar novo aluno
router.post("/", async (req: Request, res: Response) => {
    try {
        const {nome, email, curso, matricula} = req.body;

        // Validação básica
        if (!nome || !email){
            return res.status(400).json({ erro: "nome e email são obrigatórios"});
        }

        const novoAluno = await Aluno.create({ nome, email, curso, matricula });

        return res.status(201).json(novoAluno);
    } catch (e: any){
        if(e?.code === 11000){

            // Código de erro do Mongo para valores duplicados (unique)
            return res.status(409).json({ erro: "Email ou matrícula já cadastrados"});

        }

        return res.status(500).json({ erro: "Erro ao criar aluno "});
    }
});

router.get("/", async (_req: Request, res: Response) => {
    try{
        const alunos = await Aluno.find().sort({ createdAt: -1 }); // mais recente primeiro
        return res.status(200).json(alunos);
    } catch {
        return res.status(500).json({ erro: "Erro ao listar alunos" });
    }
});

router.get("/:id", async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const aluno = await Aluno.findById(id);

        if (!aluno) return res.status(404).json({ erro: "Aluno não encontrado"});
        return res.status(200).json(aluno);
    } catch {
        return res.status(400).json({ erro: "ID inválido" });
    }
});

export default router;