const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class Usuario {
  static async criar({ nome, email, senha }) {
    const hashedPassword = await bcrypt.hash(senha, 10);
    const { rows } = await db.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *',
      [nome, email, hashedPassword]
    );
    return rows[0];
  }

  static async buscarPorEmail(email) {
    const { rows } = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    return rows[0];
  }

  static async verificarCredenciais(email, senha) {
    const usuario = await this.buscarPorEmail(email);
    if (!usuario) return null;
    
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) return null;
    
    return usuario;
  }

  static gerarToken(usuario) {
    return jwt.sign(
      { id: usuario.id, email: usuario.email, isAdmin: usuario.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  }
}

module.exports = Usuario;