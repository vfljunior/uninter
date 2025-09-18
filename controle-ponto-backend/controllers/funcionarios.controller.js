const Funcionario = require('../models/funcionario.model');

exports.listarFuncionarios = async (req, res) => {
  try {
    const funcionarios = await Funcionario.listar();
    res.json(funcionarios);
  } catch (error) {
    res.status(500).json({ 
      mensagem: 'Erro ao listar funcionários',
      erro: error.message 
    });
  }
};

exports.criarFuncionario = async (req, res) => {
  try {
    const { nome, email, cargo, departamento, jornada_diaria } = req.body;
    const novoFuncionario = await Funcionario.criar({ 
      nome, email, cargo, departamento, jornada_diaria 
    });
    res.status(201).json(novoFuncionario);
  } catch (error) {
    res.status(500).json({ 
      mensagem: 'Erro ao criar funcionário',
      erro: error.message 
    });
  }
};

exports.atualizarFuncionario = async (req, res) => {
  try {
    const { id } = req.params;
    const funcionario = await Funcionario.atualizar(id, req.body);
    
    if (!funcionario) {
      return res.status(404).json({ 
        mensagem: 'Funcionário não encontrado' 
      });
    }
    
    res.json(funcionario);
  } catch (error) {
    res.status(500).json({ 
      mensagem: 'Erro ao atualizar funcionário',
      erro: error.message 
    });
  }
};

exports.desativarFuncionario = async (req, res) => {
  try {
    const { id } = req.params;
    const funcionario = await Funcionario.desativar(id);
    
    if (!funcionario) {
      return res.status(404).json({ 
        mensagem: 'Funcionário não encontrado' 
      });
    }
    
    res.json({ mensagem: 'Funcionário desativado com sucesso' });
  } catch (error) {
    res.status(500).json({ 
      mensagem: 'Erro ao desativar funcionário',
      erro: error.message 
    });
  }
};



/**
 * 
 * 
 * 
 * const express = require('express');
const router = express.Router();
const funcionariosController = require('../controllers/funcionarios.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.get('/', funcionariosController.listarFuncionarios);
router.post('/', funcionariosController.criarFuncionario);
router.put('/:id', funcionariosController.atualizarFuncionario);
router.delete('/:id', funcionariosController.desativarFuncionario);

module.exports = router;
 */