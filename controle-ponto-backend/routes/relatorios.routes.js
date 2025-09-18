const express = require('express');
const router = express.Router();
const relatoriosController = require('../controllers/relatorios.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.get('/horas-extras', relatoriosController.horasExtras);
router.get('/banco-horas/:funcionario_id', relatoriosController.bancoHoras);

module.exports = router;