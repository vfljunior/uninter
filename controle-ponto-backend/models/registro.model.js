const db = require('../config/database');

class RegistroPonto {
  static async registrar({ funcionario_id, tipo, horario }) {
    const data = new Date().toISOString().split('T')[0];
    
    // Verifica se já existe registro para o dia
    let registro = await this.buscarPorFuncionarioEData(funcionario_id, data);
    
    if (!registro) {
      const { rows } = await db.query(
        'INSERT INTO registros_ponto (funcionario_id, data) VALUES ($1, $2) RETURNING *',
        [funcionario_id, data]
      );
      registro = rows[0];
    }
    
    // Atualiza o campo correspondente
    const { rows } = await db.query(
      `UPDATE registros_ponto SET ${tipo} = $1 WHERE id = $2 RETURNING *`,
      [horario, registro.id]
    );
    
    // Se todos os registros estiverem completos, calcula horas
    const registroAtualizado = rows[0];
    if (registroAtualizado.entrada && registroAtualizado.almoco && 
        registroAtualizado.retorno && registroAtualizado.saida) {
      return this.calcularHoras(registroAtualizado.id);
    }
    
    return registroAtualizado;
  }

  static async calcularHoras(registro_id) {
    // Obtém o registro e a jornada do funcionário
    const { rows: [registro] } = await db.query(
      `SELECT r.*, f.jornada_diaria 
       FROM registros_ponto r
       JOIN funcionarios f ON r.funcionario_id = f.id
       WHERE r.id = $1`,
      [registro_id]
    );
    
    // Calcula horas trabalhadas e extras
    const horasTrabalhadas = await db.query(
      `SELECT (r.saida - r.retorno) + (r.almoco - r.entrada) as total
       FROM registros_ponto r WHERE id = $1`,
      [registro_id]
    );
    
    const horasExtras = await db.query(
      `SELECT (r.saida - r.retorno) + (r.almoco - r.entrada) - f.jornada_diaria as extras
       FROM registros_ponto r
       JOIN funcionarios f ON r.funcionario_id = f.id
       WHERE r.id = $1`,
      [registro_id]
    );
    
    // Atualiza o registro com os cálculos
    const { rows } = await db.query(
      `UPDATE registros_ponto 
       SET horas_trabalhadas = $1, horas_extras = $2 
       WHERE id = $3 RETURNING *`,
      [horasTrabalhadas.rows[0].total, horasExtras.rows[0].extras, registro_id]
    );
    
    return rows[0];
  }

  static async buscarPorFuncionarioEData(funcionario_id, data) {
    const { rows } = await db.query(
      'SELECT * FROM registros_ponto WHERE funcionario_id = $1 AND data = $2',
      [funcionario_id, data]
    );
    return rows[0];
  }

  static async historico(funcionario_id, mes, ano) {
    const { rows } = await db.query(
      `SELECT * FROM registros_ponto 
       WHERE funcionario_id = $1 
       AND EXTRACT(MONTH FROM data) = $2 
       AND EXTRACT(YEAR FROM data) = $3
       ORDER BY data`,
      [funcionario_id, mes, ano]
    );
    return rows;
  }
}

module.exports = RegistroPonto;