const express = require('express');
const router = express.Router();
const pontoController = require('../controllers/ponto.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.post('/registrar', pontoController.registrarPonto);
router.get('/historico', pontoController.obterHistorico);

module.exports = router;