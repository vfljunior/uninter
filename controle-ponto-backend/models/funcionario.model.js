const db = require('../config/database');

class Funcionario {
  static async criar({ nome, email, cargo, departamento, jornada_diaria }) {
    const { rows } = await db.query(
      `INSERT INTO funcionarios 
       (nome, email, cargo, departamento, jornada_diaria) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nome, email, cargo, departamento, jornada_diaria]
    );
    return rows[0];
  }

  static async listar() {
    const { rows } = await db.query('SELECT * FROM funcionarios WHERE ativo = true');
    return rows;
  }

  static async buscarPorId(id) {
    const { rows } = await db.query('SELECT * FROM funcionarios WHERE id = $1', [id]);
    return rows[0];
  }

  static async atualizar(id, dados) {
    const campos = [];
    const valores = [];
    let contador = 1;

    for (const [key, value] of Object.entries(dados)) {
      if (value !== undefined) {
        campos.push(`${key} = $${contador}`);
        valores.push(value);
        contador++;
      }
    }

    if (campos.length === 0) return this.buscarPorId(id);

    valores.push(id);
    const query = `UPDATE funcionarios SET ${campos.join(', ')} WHERE id = $${contador} RETURNING *`;
    const { rows } = await db.query(query, valores);
    return rows[0];
  }

  static async desativar(id) {
    const { rows } = await db.query(
      'UPDATE funcionarios SET ativo = false WHERE id = $1 RETURNING *',
      [id]
    );
    return rows[0];
  }
}

module.exports = Funcionario;