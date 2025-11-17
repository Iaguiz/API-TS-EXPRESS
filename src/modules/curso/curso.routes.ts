import { Router, Request, Response} from "express";
import { Curso } from "./curso.model";
import { Aluno } from "../aluno/aluno.model";

const router = Router();

// POST /cursos - criar curso
router.post("/", async (req: Request, res: Response) => {
    try{
        const { nome, codigo } = req.body || {};

        if(!nome||!codigo) return res.status(400).json({ erro: "Nome e codigo são obrigatórios "});
        
        const curso = await Curso.create({ nome, codigo});
        return res.status(201).json(curso);

    } catch (e: any) {
        if(e?.code === 11000) return res.status(409).json({ erro: "código já existe"});
        return res.status(500).json({ erro: "Erro ao criar curso" });
    }
});

// GET /cursos - Listar
router.get("/", async (_req, res) => {
    try{
        const cursos = await Curso.find().sort({ createdAt: -1 });
        return res.json(cursos);
    } catch {
        return res.status(500).json({ erro: "Erro ao listar cursos" });
    }
});

// GET /cursos/:id - detalhar
router.get("/:id", async (req, res) => {
    try {
        const curso = await Curso.findById(req.params.id);
        if (!curso) return res.status(404).json({ erro: "Curso não encontrado" });
        return res.json(curso);
    } catch {
        return res.status(400).json({ erro: "id inválido" });
    }
});

// PUT /cursos/:id - atualizar curso (nome e código)
router.put("/:id", async (req: Request, res: Response) => {
    try {
        const { nome, codigo } = req.body || {};
        if(!nome || !codigo){
            return res.status(400).json({ erro: "Nome e código são obrigatórios" });
        }

        const curso = await Curso.findByIdAndUpdate(
            req.params.id,
            { nome, codigo },
            { new: true, runValidators: true }
        );

        if(!curso) return res.status(404).json({ erro: "Curso não encontrado" });

        return res.json(curso);
    } catch (e: any) {
        if(e?.code === 11000) return res.status(409).json({ erro: "Código já existe "});
        return res.status(400).json({ erro: "ID inválido"});
    }
});

// GET /cursos/:id/alunos - listar alunos desse curso
router.get("/:id/alunos", async (req, res) => {
    try {
        const alunos = await Aluno.find({ curso: req.params.id }).sort({ nome: 1 });
        return res.json(alunos);
    } catch {
        return res.status(400).json({ erro: "id inválido" });
    }
});

// DELETE /cursos/:id - remover curso
router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const curso = await Curso.findByIdAndDelete(req.params.id);
        if (!curso) return res.status(404).json({ erro: "Curso não encontrado" });
        return res.status(200).json({ mensagem: "Curso removido com sucesso" });
    } catch {
        return res.status(400).json({ erro: "ID inválido" });
    }
});

export default router;
