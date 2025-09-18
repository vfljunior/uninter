exports.up = (pgm) => {
    pgm.createTable('usuarios', {
      id: { type: 'serial', primaryKey: true },
      nome: { type: 'varchar(100)', notNull: true },
      email: { type: 'varchar(100)', notNull: true, unique: true },
      senha: { type: 'varchar(255)', notNull: true },
      is_admin: { type: 'boolean', default: true },
      criado_em: { type: 'timestamp', default: pgm.func('current_timestamp') },
    });
  
    pgm.createTable('funcionarios', {
      id: { type: 'serial', primaryKey: true },
      nome: { type: 'varchar(100)', notNull: true },
      email: { type: 'varchar(100)', notNull: true, unique: true },
      cargo: { type: 'varchar(50)' },
      departamento: { type: 'varchar(50)' },
      jornada_diaria: { type: 'interval', default: '08:00:00' },
      ativo: { type: 'boolean', default: true },
      criado_em: { type: 'timestamp', default: pgm.func('current_timestamp') },
    });
  
    pgm.createTable('registros_ponto', {
      id: { type: 'serial', primaryKey: true },
      funcionario_id: { type: 'integer', notNull: true, references: 'funcionarios(id)' },
      data: { type: 'date', notNull: true },
      entrada: { type: 'time' },
      almoco: { type: 'time' },
      retorno: { type: 'time' },
      saida: { type: 'time' },
      horas_trabalhadas: { type: 'interval' },
      horas_extras: { type: 'interval' },
      observacoes: { type: 'text' },
      criado_em: { type: 'timestamp', default: pgm.func('current_timestamp') },
    });
  
    pgm.addConstraint('registros_ponto', 'registros_ponto_funcionario_data_unique', {
      unique: ['funcionario_id', 'data'],
    });
  
    pgm.createTable('configuracoes', {
      id: { type: 'serial', primaryKey: true },
      chave: { type: 'varchar(50)', notNull: true, unique: true },
      valor: { type: 'text' },
      descricao: { type: 'text' },
    });
  };
  
  exports.down = (pgm) => {
    pgm.dropTable('registros_ponto');
    pgm.dropTable('funcionarios');
    pgm.dropTable('usuarios');
    pgm.dropTable('configuracoes');
  };