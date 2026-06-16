# Catalogo de Filmes

Aplicação web para busca, descoberta e avaliação de filmes, consumindo a API oficial do TMDB (The Movie Database) e gerenciando dados locais de usuários e avaliações.

## Tecnologias Utilizadas

* Front-end: React / Vite.
* Requisicoes HTTP: Axios
* API de Filmes: TMDB API
* Back-end / Armazenamento: API Interna (JSON Server)

## Como Executar o Projeto Localmente

1. Clone este repositorio:
   ```bash
   git clone https://github.com/gldacruzsilva/Trabalho2
   
2. Instale as dependencias do projeto:

    ```bash
   npm install

Configuracao de Variaveis de Ambiente:
Crie um arquivo chamado .env na raiz do projeto e adicione o seu token do TMDB.

VITE_TMDB_TOKEN=seu_token_aqui

3. Após entrar no diretório do projeto, inicie o servidor de desenvolvimento:
      ```bash 
      npm run dev

4. Em um outro terminal utilize:
   ```bash
   npm json-server --watch db.json --port 3001
   
## Documentacao da API
Abaixo estao listadas as rotas utilizadas pela aplicação, divididas entre a integração com o TMDB e as rotas internas da aplicação.

### Rotas TMDB (Integração Externa)
**GET /movie/popular**
Retorna uma lista de filmes populares para exibição na página inicial.  

Parametros de URL (Query)\
language (opcional): Idioma dos resultados (Exemplo: pt-BR).  

**GET /search/movie**\
Pesquisa filmes no catalogo com base em uma query de texto digitada pelo usuario.  

Parametros de URL (Query)\
query (obrigatorio): O termo ou titulo a ser pesquisado. 
language (opcional): Idioma dos resultados (Exemplo: pt-BR).  

**GET /discover/movie**\
Pesquisa e filtra filmes por categorias ou generos especificos, ordenados por popularidade decrescente.  

Parametros de URL (Query)\
with_genres (obrigatorio): O ID do genero do filme (Exemplo: 28 para Acao).  
language (opcional): Idioma dos resultados.  
sort_by (opcional): Criterio de ordenacao. Padrao: popularity.desc.  

 ### Rotas Internas (Gerenciamento da Aplicação)
**POST /filmes**\  
Salva a avaliacao pessoal e o comentario de um usuario sobre um filme especifico.  

Corpo da Requisicao (JSON Body):  


| Campo | Tipo | Obrigatório | Descrição |
| :--- | :--- | :---: | :--- |
| usuarioId | string | Sim | Identificador único do usuário logado. |
| titulo | string | Sim | Título completo do filme avaliado. |
| poster | string | Não | Caminho relativo da imagem do pôster do filme. |
| avaliacaoPessoal | number | Sim | Nota atribuída ao filme (Exemplo: de 1 a 5). |
| comentario | string | Não | Texto com a opinião do usuário sobre a obra. |

### Exemplo de Envio

```json
{
  "usuarioId": "5AAoWY0E5no",
  "titulo": "Re:ZERO -Starting Life in Another World- Memory Snow",
  "poster": "/f0GwJaRh1nErj26n53NDJ5fRj7.jpg",
  "avaliacaoPessoal": 5,
  "comentario": "Sem comentarios."
}
```
Respostas:

201 Created: Avaliação salva com sucesso. Retorna o objeto criado contendo um identificador unico gerado automaticamente (id).

**POST /usuarios**\
Salva o cadastro ou dados de login do usuario na base de dados.

Corpo da Requisicao (JSON Body):

### Dados de Cadastro

| Campo | Tipo | Obrigatório | Descrição |
| :--- | :--- | :---: | :--- |
| nome | string | Sim | Nome de exibição escolhido pelo usuário. |
| email | string | Sim | Endereço de e-mail utilizado para acesso. |
| senha | string | Sim | Senha associada à conta. |

### Exemplo de Envio

```json
{
  "nome": "João Silva",
  "email": "joao.silva@email.com",
  "senha": "senha_segura_123"
}
```

Respostas:

201 Created: Usuario cadastrado com sucesso, retornando o objeto salvo acompanhado de seu respectivo id.

