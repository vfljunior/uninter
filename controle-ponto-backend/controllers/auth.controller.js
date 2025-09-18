const Usuario = require('../models/usuario.model');

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await Usuario.verificarCredenciais(email, senha);
    
    if (!usuario) {
      return res.status(401).json({ 
        mensagem: 'Credenciais inválidas' 
      });
    }
    
    const token = Usuario.gerarToken(usuario);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ 
      mensagem: 'Erro ao realizar login',
      erro: error.message 
    });
  }
};

exports.registrarAdmin = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const usuarioExistente = await Usuario.buscarPorEmail(email);
    
    if (usuarioExistente) {
      return res.status(400).json({ 
        mensagem: 'E-mail já cadastrado' 
      });
    }
    
    const novoUsuario = await Usuario.criar({ nome, email, senha });
    const token = Usuario.gerarToken(novoUsuario);
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ 
      mensagem: 'Erro ao registrar administrador',
      erro: error.message 
    });
  }
};