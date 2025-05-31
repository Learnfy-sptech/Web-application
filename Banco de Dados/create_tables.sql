CREATE TABLE relatorio_tb (
    id_relatorio INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(40) NOT NULL,
    colunas JSON NOT NULL,
    filtros JSON NOT NULL,
    dt_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    fk_usuario INT NOT NULL,
    FOREIGN KEY (fk_usuario) REFERENCES usuario_tb(id_usuario)
);