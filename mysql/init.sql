CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    role VARCHAR(10) NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
    livro_id INT NOT NULL,
    status ENUM('Quero ler', 'Lendo', 'Lido') NOT NULL,
    nota TINYINT NULL,
    concluida_em DATE NULL,
    CONSTRAINT fk_leituras_livro
        FOREIGN KEY (livro_id) REFERENCES livros (id) ON DELETE RESTRICT
);
