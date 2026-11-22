CREATE TABLE IF NOT EXISTS minha_estante (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    open_library_id VARCHAR(100) NOT NULL,
    titulo VARCHAR(500) NOT NULL,
    autores JSON NOT NULL,
    assuntos JSON NOT NULL,
    ano_publicacao INT NULL,
    paginas INT NULL,
    capa_url VARCHAR(500) NULL,
    isbn VARCHAR(20) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_minha_estante_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_usuario_open_library
        UNIQUE (usuario_id, open_library_id)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;