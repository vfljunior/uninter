const express = require('express');
const router = express.Router();
const funcionariosController = require('../controllers/funcionarios.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.get('/', funcionariosController.listarFuncionarios);
router.post('/', funcionariosController.criarFuncionario);
router.put('/:id', funcionariosController.atualizarFuncionario);
router.delete('/:id', funcionariosController.desativarFuncionario);

module.exports = router;