const RegistroPonto = require('../models/registro.model');

exports.registrarPonto = async (req, res) => {
  try {
    const { tipo } = req.body;
    const funcionario_id = req.user.id;
    const horario = new Date().toTimeString().split(' ')[0].substring(0, 5);
    
    const registro = await RegistroPonto.registrar({ funcionario_id, tipo, horario });
    res.json({ 
      mensagem: `Ponto registrado com sucesso: ${tipo} às ${horario}`,
      registro 
    });
  } catch (error) {
    res.status(500).json({ 
      mensagem: 'Erro ao registrar ponto',
      erro: error.message 
    });
  }
};

exports.obterHistorico = async (req, res) => {
  try {
    const funcionario_id = req.user.id;
    const { mes, ano } = req.query;
    
    const historico = await RegistroPonto.historico(
      funcionario_id, 
      parseInt(mes), 
      parseInt(ano)
    );
    
    res.json(historico);
  } catch (error) {
    res.status(500).json({ 
      mensagem: 'Erro ao obter histórico',
      erro: error.message 
    });
  }
};