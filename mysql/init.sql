CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    role VARCHAR(10) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255) NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS autores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    nacionalidade VARCHAR(100) NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS livros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    autor_id INT NOT NULL,
    categoria_id INT NOT NULL,
    paginas INT NOT NULL,
    ano INT NOT NULL,
    capa_url VARCHAR(500) NULL,
    CONSTRAINT fk_livros_autor
        FOREIGN KEY (autor_id) REFERENCES autores (id) ON DELETE RESTRICT,
    CONSTRAINT fk_livros_categoria
        FOREIGN KEY (categoria_id) REFERENCES categorias (id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS leituras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    livro_id INT NOT NULL,
    status ENUM('Quero ler', 'Lendo', 'Lido') NOT NULL,
    nota TINYINT NULL,
    concluida_em DATE NULL,
    INDEX idx_leituras_usuario_id (usuario_id),
    CONSTRAINT fk_leituras_usuario
        FOREIGN KEY (usuario_id) REFERENCES users (id) ON DELETE RESTRICT,
    CONSTRAINT fk_leituras_livro
        FOREIGN KEY (livro_id) REFERENCES livros (id) ON DELETE RESTRICT,
    CONSTRAINT chk_leituras_nota
        CHECK (nota IS NULL OR nota BETWEEN 1 AND 5)
);

