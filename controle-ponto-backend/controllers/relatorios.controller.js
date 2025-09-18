const db = require('../config/database');

exports.horasExtras = async (req, res) => {
  try {
    const { mes, ano } = req.query;
    
    const { rows } = await db.query(
      `SELECT f.nome, f.departamento, 
              SUM(EXTRACT(EPOCH FROM r.horas_extras)/3600) as total_horas_extras
       FROM registros_ponto r
       JOIN funcionarios f ON r.funcionario_id = f.id
       WHERE EXTRACT(MONTH FROM r.data) = $1 
       AND EXTRACT(YEAR FROM r.data) = $2
       GROUP BY f.id
       ORDER BY total_horas_extras DESC`,
      [mes, ano]
    );
    
    res.json(rows);
  } catch (error) {
    res.status(500).json({ 
      mensagem: 'Erro ao gerar relatório de horas extras',
      erro: error.message 
    });
  }
};

exports.bancoHoras = async (req, res) => {
  try {
    const { funcionario_id } = req.params;
    
    const { rows } = await db.query(
      `SELECT 
         SUM(EXTRACT(EPOCH FROM horas_extras)/3600 as saldo_horas,
         SUM(CASE WHEN horas_extras > '00:00:00' THEN EXTRACT(EPOCH FROM horas_extras)/3600 ELSE 0 END) as horas_positivas,
         SUM(CASE WHEN horas_extras < '00:00:00' THEN EXTRACT(EPOCH FROM horas_extras)/3600 ELSE 0 END) as horas_negativas
       FROM registros_ponto
       WHERE funcionario_id = $1`,
      [funcionario_id]
    );
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ 
      mensagem: 'Erro ao gerar relatório de banco de horas',
      erro: error.message 
    });
  }
};