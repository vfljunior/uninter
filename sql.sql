-- Tabela de Usuários/Administradores
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Funcionários
CREATE TABLE funcionarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    cargo VARCHAR(50),
    departamento VARCHAR(50),
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Registros de Ponto
CREATE TABLE registros_ponto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    funcionario_id INT NOT NULL,
    data DATE NOT NULL,
    entrada TIME,
    almoco TIME,
    retorno TIME,
    saida TIME,
    horas_trabalhadas TIME,
    horas_extras TIME,
    observacoes TEXT,
    FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id),
    UNIQUE KEY (funcionario_id, data)
);

-- Tabela de Configurações (Jornada de trabalho, etc.)
CREATE TABLE configuracoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chave VARCHAR(50) NOT NULL UNIQUE,
    valor TEXT,
    descricao TEXT
);