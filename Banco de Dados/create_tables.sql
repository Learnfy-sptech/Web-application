CREATE TABLE relatorio_tb (
    id_relatorio INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(40) NOT NULL,
    colunas JSON NOT NULL,
    filtros JSON NOT NULL,
    dt_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    fk_usuario INT NOT NULL,
    FOREIGN KEY (fk_usuario) REFERENCES usuario_tb(id_usuario)
);

CREATE TABLE usuario_tb (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    tipo_conta VARCHAR(45),
    nome VARCHAR(80),
    email VARCHAR(45),
    cpf CHAR(11),
    telefone VARCHAR(13),
    senha VARCHAR(30)
);

-- Mock para testar a funcionalidade de relatórios
INSERT INTO usuario_tb VALUES (
    'Administrador',
    'Lucas Aiello',
    'lucas.aiello@gmail.com',
    '53544713896',
    '(16)997634968',
    'LCA20*fja12'
)