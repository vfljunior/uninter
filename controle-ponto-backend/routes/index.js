const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const funcionariosRoutes = require('./funcionarios.routes');
const pontoRoutes = require('./ponto.routes');
const relatoriosRoutes = require('./relatorios.routes');

router.use('/auth', authRoutes);
router.use('/funcionarios', funcionariosRoutes);
router.use('/ponto', pontoRoutes);
router.use('/relatorios', relatoriosRoutes);

module.exports = router;