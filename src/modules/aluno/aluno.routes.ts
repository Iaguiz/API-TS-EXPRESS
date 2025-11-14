import { Router, Request, Response } from "express";
import { Aluno } from "./aluno.model";
import { Curso } from "../curso/curso.model";

const router = Router();

// POST /alunos - criar novo aluno
router.post("/", async (req: Request, res: Response) => {
    try {
        const {nome, email, curso, matricula} = req.body;

        // Validação básica
        if (!nome || !email){
            return res.status(400).json({ erro: "nome e email são obrigatórios"});
        }

        if(curso){
            const existeCurso = await Curso.findById(curso);
            if (!existeCurso){
                return res.status(404).json({ erro: "Curso não encontrado" });
            }
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

router.put("/:id", async (req: Request, res: Response) => {
    try{
        const { id } = req.params;
        const {nome, email, curso, matricula } = req.body || {};

        //Validação simples: para PUT exigimos nome e email
        if(!nome || !email){
            return res.status(400).json({ erro: "nome e email são obrigatórios"});
        }

        //Valida curso antes de atualizar
        if(curso){
            const existeCurso = await Curso.findById(curso);
            if(!existeCurso) return res.status(404).json({ erro: "Curso não encontrado" });
        }

        const atualizado = await Aluno.findByIdAndUpdate(
            id,
            { nome, email, curso, matricula },
            { new: true, runValidators: true } // retorna já atualizado e respeita validações do schema
        );

        if(!atualizado) return res.status(404).json({ erro: "Aluno não encontrado"});
        return res.status(200).json(atualizado);

    } catch (e: any) {

        // id malformado ou conflito de unique
        if(e?.code === 11000){
            return res.status(409).json({ erro: "Email ou matrícula já cadastrados" });
        }
        return res.status(400).json({ erro: "ID inválido" });
    }
});

router.patch("/:id", async (req: Request, res: Response) => {
    try{
        const { id } = req.params;
        const atualizacoes: Partial<{ nome: string; email: string; curso?: string; matricula?: string}> = {};
    
        // Copia apenas campos presentes no body
        const { nome, email, curso, matricula } = req.body || {};
        if(nome !== undefined) atualizacoes.nome = nome;
        if(email !== undefined) atualizacoes.email = email;
        
        if(curso !== undefined) {
            const existeCurso = await Curso.findById(curso);
            if(!existeCurso) return res.status(404).json({ erro: "Curso não encontrado "});
            atualizacoes.curso = curso; // Só define se o curso existir
        }
        
        if(matricula !== undefined) atualizacoes.matricula = matricula;

        // Se nenhum campo válido foi enviado
        if(Object.keys(atualizacoes).length === 0){
            return res.status(400).json({ erro: "Nenhum campo para atualizar" });
        }

        const atualizado = await Aluno.findByIdAndUpdate(id, atualizacoes, {
            new: true,
            runValidators: true // Aplica validações do schema nos campos enviados
        });

        if(!atualizado) return res.status(404).json({ erro: "Aluno não encontrado" });
        return res.status(200).json(atualizado);
        
    } catch (e: any){
        if (e?.code === 11000) {
            return res.status(409).json({ erro: "Email ou matrícula já cadastrados" });
        }
        return res.status(400).json({ erro: "ID inválido" });
    }
});

router.delete("/:id", async (req: Request, res: Response) => {
    try{
        const { id } = req.params;

        const removido = await Aluno.findByIdAndDelete(id);
        if(!removido) return res.status(404).json({ erro: "Aluno não encontrado"});
        return res.status(200).json({ mensagem: "Aluno removido com sucesso" });

    } catch {
        return res.status(400).json({ erro: "ID inválido" });
    }
});

export default router;