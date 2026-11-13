
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Autores
CREATE TABLE IF NOT EXISTS autores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    nacionalidade VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categorias
CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Livros
CREATE TABLE IF NOT EXISTS livros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    autor_id INT NOT NULL,
    categoria_id INT NOT NULL,
    paginas INT UNSIGNED NOT NULL,
    ano SMALLINT UNSIGNED NOT NULL,
    capa_url TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_livros_autores
        FOREIGN KEY (autor_id)
        REFERENCES autores(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_livros_categorias
        FOREIGN KEY (categoria_id)
        REFERENCES categorias(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- Leituras
CREATE TABLE IF NOT EXISTS leituras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    livro_id INT NOT NULL,
    status ENUM('Quero ler', 'Lendo', 'Lido') NOT NULL,
    nota TINYINT UNSIGNED NULL,
    concluida_em DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_leituras_livros
        FOREIGN KEY (livro_id)
        REFERENCES livros(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT chk_leituras_nota
        CHECK (nota IS NULL OR nota BETWEEN 1 AND 5)
);
