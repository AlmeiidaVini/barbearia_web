# Barbearia Web

Aplicação web para apresentar uma barbearia, consultar serviços e realizar agendamentos.

Este é um **projeto acadêmico evolutivo** da disciplina de **Front-end Frameworks (2026.2)**. A **AV2** mantém o tema, o repositório e as funcionalidades da **AV1**, acrescentando autenticação, integração com a API DummyJSON, páginas protegidas e gerenciamento dos agendamentos locais.

## Problema e público-alvo

O projeto busca facilitar a consulta aos serviços de uma barbearia e a escolha de datas e horários para atendimento em uma interface acessível pelo navegador.

O público-alvo das páginas públicas são pessoas que desejam conhecer os serviços e organizar um agendamento. A área interna da AV2 é **demonstrativa**: utiliza contas e usuários fictícios do DummyJSON, que **não representam clientes reais da barbearia**.

## Funcionalidades

**Funcionalidades preservadas da AV1:**

- Página inicial de apresentação da barbearia.
- Página de serviços, com informações de preços e duração dos procedimentos.
- Fluxo público de agendamento, com escolha de serviços, data e horário, validação de campos e verificação de disponibilidade.
- Página sobre a barbearia.
- Página de contato com mapa MapTiler, quando configurada a chave do mapa.
- Armazenamento de agendamentos no `localStorage` do navegador.

**Funcionalidades acrescentadas na AV2:**

- Login demonstrativo pela API DummyJSON, com validação do formulário e mensagens de erro.
- Sessão mantida no `sessionStorage`, sem armazenar senha ou `refreshToken`.
- Restauração da sessão após atualizar a página e validação do token com `/auth/me`.
- Logout e controle de acesso às rotas `/painel` e `/meus-agendamentos`.
- Cabeçalho com **Entrar** para visitantes e **nome, Painel e Sair** para usuários autenticados.
- Painel com consulta remota de usuários fictícios e estados de carregamento, sucesso, vazio e erro.
- Opção **Tentar novamente** e dados locais de contingência identificados quando a consulta falha.
- Consulta, edição e cancelamento de agendamentos salvos no navegador.
- Página de erro 404 para endereços não encontrados.

> **Observação:** o agendamento público da AV1 permanece disponível sem login. A API DummyJSON não registra reservas da barbearia e não fornece um cadastro real de clientes.

## Tecnologias

- React com componentes funcionais
- JavaScript
- Vite
- React Router
- CSS
- `fetch` para as requisições HTTP da AV2
- Context API para compartilhar a autenticação
- `localStorage` e `sessionStorage`
- MapTiler SDK para exibir o mapa
- Git e GitHub para versionamento e colaboração

## Requisitos

- Node.js e npm instalados.
- Acesso à internet para testar a integração com a API DummyJSON.
- Chave do MapTiler **somente para exibir o mapa**; não é necessária uma chave para acessar o DummyJSON.

## Como executar

Na raiz do projeto, instale as dependências do frontend:

```bash
npm install --prefix frontend
```

Copie o arquivo de exemplo para `frontend/.env`:

**PowerShell (Windows):**

```powershell
Copy-Item frontend/.env.example frontend/.env
```

**Terminal Bash:**

```bash
cp frontend/.env.example frontend/.env
```

O arquivo contém as variáveis:

```env
VITE_API_BASE_URL=https://dummyjson.com
VITE_MAPTILER_KEY=
```

- `VITE_API_BASE_URL`: endereço-base da API. Por padrão, utiliza `https://dummyjson.com`.
- `VITE_MAPTILER_KEY`: chave opcional necessária para carregar o mapa na página de contato.

**Não coloque senhas nem tokens pessoais no `.env` e não envie esse arquivo ao GitHub.** O `.env.example` é somente um modelo, sem segredos.

Depois, ainda na raiz do projeto, inicie o servidor:

```bash
npm run dev
```

O Vite mostrará no terminal o endereço local para abrir no navegador. Se alterar o `.env` com o servidor ativo, pare-o com `Ctrl+C` e inicie novamente.

**Credenciais fictícias para demonstração do login:**

```text
Usuário: emilys
Senha: emilyspass
```

Essas credenciais são públicas e fornecidas para testes do DummyJSON; não são dados de acesso a um sistema real.

## Outros comandos

Execute na raiz do projeto para gerar a versão de produção:

```bash
npm run build
```

Para verificar o frontend com Oxlint:

```bash
npm --prefix frontend run lint
```

Para pré-visualizar o build, após compilá-lo:

```bash
npm run preview
```

## Rotas da aplicação

As rotas são definidas em `frontend/src/app/App.jsx`:

| Rota | Arquivo | Acesso e responsabilidade |
| --- | --- | --- |
| `/` | `frontend/src/pages/HomePage.jsx` | Pública — página inicial e apresentação da barbearia |
| `/servicos` | `frontend/src/pages/ServicosPage.jsx` | Pública — lista e detalhes dos serviços |
| `/agendamento` | `frontend/src/pages/AgendamentoPage.jsx` | Pública — escolha de serviços, data e horário |
| `/sobre` | `frontend/src/pages/SobrePage.jsx` | Pública — informações institucionais |
| `/contato` | `frontend/src/pages/ContatoPage.jsx` | Pública — contato e mapa |
| `/login` | `frontend/src/pages/LoginPage.jsx` | Pública — autenticação demonstrativa com DummyJSON |
| `/painel` | `frontend/src/pages/PainelPage.jsx` | **Protegida** — boas-vindas e listagem de usuários fictícios |
| `/meus-agendamentos` | `frontend/src/pages/MeusAgendamentosPage.jsx` | **Protegida** — consultar, editar e cancelar reservas locais |
| `*` | `frontend/src/pages/NotFoundPage.jsx` | Pública — página não encontrada (404) |

O componente `ProtectedRoute.jsx` aguarda a verificação da sessão antes de liberar o acesso. Visitantes não autenticados são direcionados para `/login`; após entrar, podem voltar à página originalmente solicitada.

## Organização do código

- `frontend/src/app/App.jsx`: configura a navegação e as rotas públicas e protegidas.
- `frontend/src/pages/`: contém as páginas da AV1 e da AV2.
- `frontend/src/components/`: contém componentes reutilizáveis, como cabeçalho, rodapé, formulários, estados de carregamento/erro e mapa.
- `frontend/src/data/`: contém os dados iniciais locais e os usuários fictícios para contingência.
- `frontend/src/styles/`: contém os estilos das páginas e componentes.
- `frontend/src/config/api.js`: centraliza a URL-base do DummyJSON.
- `frontend/src/services/http.js`: concentra as chamadas `fetch` e o tratamento de respostas HTTP.
- `frontend/src/services/authService.js`: realiza login e verifica o usuário autenticado.
- `frontend/src/services/usersService.js`: consulta a lista de usuários fictícios da API.
- `frontend/src/services/sessionStorageService.js`: salva, recupera e limpa a sessão.
- `frontend/src/services/bookingsService.js`: gerencia as reservas no `localStorage`.
- `frontend/src/context/`: compartilha estado, token, login e logout com a aplicação.
- `frontend/src/utils/bookingUtils.js`: reúne as regras auxiliares de agendamento e disponibilidade.
- `backend/`: espaço reservado; **não há API ou banco de dados próprio nesta entrega**.

As requisições à API usam `fetch` por meio dos arquivos de `services/`; não é utilizado Axios. A pasta `dist/` contém o resultado do build e não deve ser versionada.

## Contrato da API DummyJSON (AV2)

A equipe escolheu a **Opção A — API pronta aprovada**, utilizando [DummyJSON](https://dummyjson.com). A URL-base é configurada em `frontend/src/config/api.js`.

| Método | Endpoint | Uso no projeto | Arquivo |
| --- | --- | --- | --- |
| `POST` | `/auth/login` | Autenticar um usuário demonstrativo | `authService.js` |
| `GET` | `/auth/me` | Validar o token e recuperar os dados do usuário atual | `authService.js` |
| `GET` | `/users?limit=3&select=firstName,lastName,username,email,image` | Buscar três usuários fictícios para o painel | `usersService.js` |

**1. Login — `POST /auth/login`**

Cabeçalho: `Content-Type: application/json`.

Corpo enviado pela aplicação:

```json
{
  "username": "emilys",
  "password": "emilyspass",
  "expiresInMins": 60
}
```

Em caso de sucesso, a API retorna os dados do usuário e um `accessToken` (entre outros campos). A aplicação utiliza apenas o token de acesso e os dados básicos do usuário; a senha não é persistida. Credenciais incorretas podem retornar `400` ou `401`, e a aplicação exibe uma mensagem compreensível.

**2. Usuário autenticado — `GET /auth/me`**

Cabeçalho enviado:

```http
Authorization: Bearer <accessToken>
```

Em caso de sucesso, retorna os dados do usuário autenticado (como `id`, `username`, `firstName` e `email`). Respostas `401` ou `403` durante a restauração da sessão fazem o contexto limpar a autenticação local; uma falha de conexão, por si só, não apaga a sessão salva.

**3. Lista de usuários — `GET /users`**

A aplicação consulta os campos necessários para o painel, com limite de três usuários. Exemplo resumido da estrutura da resposta:

```json
{
  "users": [
    {
      "id": 1,
      "firstName": "Exemplo",
      "lastName": "Demonstrativo",
      "username": "usuario.demo",
      "email": "exemplo@example.com",
      "image": ""
    }
  ],
  "total": 1,
  "skip": 0,
  "limit": 3
}
```

O objeto acima é **ilustrativo da estrutura dos dados**, não uma resposta real copiada da API. A consulta utilizada é de leitura; os usuários exibidos são fictícios e não são clientes da barbearia.

**Tratamento das respostas:** o painel diferencia carregamento, lista vazia, falha de rede e falta de permissão (`403`). Caso a API retorne `401` ao painel, a aplicação encerra a sessão e direciona o usuário ao login. O botão **Tentar novamente** permite repetir a consulta quando ocorre falha recuperável.

Documentação: [Autenticação](https://dummyjson.com/docs/auth) e [Usuários](https://dummyjson.com/docs/users).

## Dados e persistência

| Dados | Origem | Onde ficam | Observação |
| --- | --- | --- | --- |
| Serviços e informações iniciais | Arquivos locais em `frontend/src/data/` | Código do projeto | Não dependem da API |
| Agendamentos | Formulário do projeto | `localStorage`, chave `agendamentos` | Persistem no mesmo navegador até a exclusão dos dados |
| Sessão de login | DummyJSON | `sessionStorage`, chave `barbearia_web_session` | Guarda somente `accessToken` e dados básicos do usuário |
| Pessoas exibidas no painel | DummyJSON `GET /users` | Estado do React | Dados remotos fictícios, não são clientes reais |
| Pessoas de contingência | `frontend/src/data/usersFallback.js` | Arquivo local | Exemplos simulados identificados na interface |

Os agendamentos continuam no navegador, mesmo após a AV2. A página `/meus-agendamentos` permite visualizar, editar e cancelar reservas existentes. O cancelamento marca a reserva como cancelada e libera seu horário; reservas antigas sem status continuam sendo interpretadas como ativas.

**As reservas não são compartilhadas entre computadores ou navegadores.** Elas podem ser perdidas se os dados do site forem apagados. O login via DummyJSON não sincroniza os agendamentos.

## Contingência e tratamento de erros

O projeto inclui dados locais de contingência para que o painel continue apresentando uma demonstração caso a API fique indisponível:

- Enquanto a requisição está em andamento, a interface apresenta uma mensagem de carregamento.
- Se a API responder com usuários, a lista é identificada como **Dados remotos — DummyJSON**.
- Se não houver usuários, a interface informa que a lista está vazia.
- Em falha de rede ou indisponibilidade da API, o painel identifica **Dados de contingência (simulados)**, informa a falha e disponibiliza **Tentar novamente**.
- Em `403`, apresenta mensagem de permissão; em `401`, encaminha para novo login.

**Como demonstrar a contingência:** com o projeto aberto, faça login normalmente. Depois, no DevTools do Chrome, bloqueie apenas as requisições a `dummyjson.com` e use **Tentar novamente** no painel. Desative o bloqueio e tente de novo para recuperar os dados remotos. Isso evita impedir também o carregamento do servidor local do Vite.

A contingência **não substitui** a integração real com a API: sua finalidade é permitir uma demonstração compreensível quando o serviço externo ou a conexão falhar.

## Limitações do projeto

- O projeto é acadêmico e não possui banco de dados ou back-end próprio na AV2.
- Os usuários do DummyJSON são fictícios; a API não representa a clientela da barbearia.
- A autenticação controla o acesso às páginas no React, mas **não é uma autorização de servidor para dados da barbearia**.
- O token fica no navegador durante a sessão e pode ficar exposto caso a aplicação sofra uma vulnerabilidade de script (XSS); não devem ser armazenados dados sensíveis adicionais.
- Os agendamentos são locais, sem sincronização ou persistência em servidor.
- A API é externa e pode estar indisponível; a contingência utiliza dados de exemplo.
- O mapa depende da configuração de uma chave própria do MapTiler.
- A equipe deve conferir a coerência entre os horários divulgados nas páginas e os horários aceitos pelas regras de agendamento antes da entrega.

## Evolução da AV1 para a AV2

| Aspecto | Situação na AV1 | Evolução na AV2 | Evidência no projeto |
| --- | --- | --- | --- |
| Dados | Serviços e informações locais | Consulta adicional a usuários fictícios da API | `services/usersService.js`, `pages/PainelPage.jsx` |
| Autenticação | Não havia login | Login com DummyJSON e validação de token | `pages/LoginPage.jsx`, `services/authService.js` |
| Sessão | Não havia sessão autenticada | `sessionStorage`, restauração após F5 e logout | `context/AuthContext.jsx`, `services/sessionStorageService.js` |
| Navegação | Rotas públicas com React Router | Área interna protegida e página 404 | `app/App.jsx`, `components/ProtectedRoute.jsx`, `pages/NotFoundPage.jsx` |
| Estados de interface | Validação e mensagens locais | Carregamento, sucesso, vazio, erro e tentar novamente | `components/LoadingState.jsx`, `components/EmptyState.jsx`, `components/ErrorState.jsx` |
| Falha da API | Não havia consumo remoto | Dados simulados de contingência identificados | `data/usersFallback.js`, `pages/PainelPage.jsx` |
| Reservas | Criação e persistência local | Consulta, edição, cancelamento e liberação de horários | `services/bookingsService.js`, `pages/MeusAgendamentosPage.jsx`, `utils/bookingUtils.js` |
| Organização | Páginas, componentes, dados e estilos | Serviços, contexto, configuração de API e utilitários | `frontend/src/services/`, `context/`, `config/`, `utils/` |

## Testes e validação

Antes de registrar a versão final da AV2, a equipe deve executar:

```bash
npm --prefix frontend run lint
npm run build
```

Verificações manuais recomendadas:

- [x] Entrar com as credenciais demonstrativas e conferir a identificação do usuário.
- [x] Testar credenciais inválidas e mensagens de erro do login.
- [x] Abrir `/painel` ou `/meus-agendamentos` deslogado, conferir o redirecionamento e voltar à rota após entrar.
- [x] Pressionar F5 logado e confirmar a restauração da sessão; depois testar logout.
- [x] Simular token inválido (`401`) e conferir que a sessão é encerrada.
- [ ] Testar usuários remotos, carregamento, estado vazio, erro, contingência e **Tentar novamente**.
- [ ] Criar agendamento na página pública, consultá-lo, editá-lo e cancelá-lo na área protegida.
- [ ] Confirmar que um horário cancelado volta a ficar disponível.
- [x] Verificar que as páginas da AV1 continuam funcionando e testar em tela pequena.
- [ ] Conferir os horários publicados versus os horários aceitos pelo formulário.

> Marcar os itens somente após a equipe realizar os testes finais na versão integrada. Lint e build já foram executados durante o desenvolvimento, mas devem ser repetidos após os últimos merges.

# Integrantes do grupo

- Pedro Vinícius de Almeida Santana
- Vanderson Gabriel Vasconcelos Barbosa
- Emanuele Vitoria Lima de Souza

## Contribuição de cada integrante

A implementação foi dividida entre os integrantes da mesma equipe da AV1. Cada um deve revisar o texto abaixo, registrar sua contribuição **com suas próprias palavras** e manter seus commits no histórico do repositório.

### Pedro Vinícius de Almeida Santana

**Área:** sessão, contexto de autenticação, navegação, logout e rotas protegidas. Também fiquei responsável pela organização do README e pela limpeza de arquivos gerados/duplicados na etapa final.

**Minha contribuição na AV2:**

- Criei `frontend/src/services/sessionStorageService.js` para salvar, recuperar e remover a sessão no `sessionStorage`. O serviço guarda somente o `accessToken` e os dados básicos do usuário; não armazena senha nem `refreshToken`.
- Acrescentei `getCurrentUser(token)` em `frontend/src/services/authService.js` para consultar `GET /auth/me` e verificar a sessão usando o token.
- Desenvolvi `frontend/src/context/AuthContext.jsx` e `authContextValue.js` para compartilhar usuário, token, estado da autenticação e funções de login/logout. A sessão é restaurada após F5; respostas `401/403` durante essa validação encerram a sessão, enquanto falhas de rede não apagam automaticamente os dados locais.
- Criei `frontend/src/components/ProtectedRoute.jsx` e integrei a proteção das rotas `/painel` e `/meus-agendamentos` ao `App.jsx`, com retorno à rota solicitada depois do login.
- Atualizei `frontend/src/components/Header.jsx` e criei `frontend/src/styles/HeaderAuth.css` para mostrar **Entrar** quando não há sessão e **nome do usuário, Painel e Sair** quando o usuário está autenticado.
- Preparei a estrutura inicial de `PainelPage.jsx`, criei `NotFoundPage.jsx` e conectei a tela de login da Manu ao contexto de autenticação, preservando as páginas públicas da AV1.
- Na organização final, preparei o README da AV2 e a limpeza do repositório: remoção de `frontend/public/index.html` e retirada dos arquivos gerados em `dist/` do índice do Git. Essas alterações de organização devem ser revisadas e registradas em um commit próprio antes do PR final.

**Validações que realizei:** testei o login demonstrativo, o retorno do usuário em `/auth/me`, a rejeição de token inválido (`401`), a restauração após F5, a preservação da sessão quando a API foi bloqueada no DevTools, o logout, o redirecionamento de rotas protegidas, a navegação em tela pequena e a página 404. Durante o desenvolvimento, executei lint com **0 erros e 0 avisos** e build do Vite concluído sem erros. Os testes finais do grupo devem ser repetidos após todos os merges.

**Registro no GitHub:** minha implementação de sessão, navegação e logout foi enviada pelo [Pull Request #23](https://github.com/gabrielvasc06/barbearia_web/pull/23), revisado e integrado à `main`. A organização final do README e dos arquivos gerados é uma etapa posterior, ainda sujeita a revisão da equipe.

### Vanderson Gabriel Vasconcelos Barbosa

**Área:** consulta de usuários remotos e estados de interface; refatoração e gerenciamento dos agendamentos locais.

**Relato individual e principais testes:** _[Gabriel: preencher sua contribuição e citar seus próprios commits.]_

### Emanuele Vitoria Lima de Souza

**Área:** tela de login, validações, mensagens de erro e integração do login com o contexto de autenticação.

**Relato individual e principais testes:** _[Manu: preencher sua contribuição e citar seus próprios commits.]_

## Uso de inteligência artificial

O uso de ferramentas de IA deve ser informado **com transparência**, indicando para que foram utilizadas, o que foi adaptado e como o resultado foi validado. Cada integrante deve escrever seu próprio relato; não devem ser atribuídas práticas ou ferramentas a outra pessoa sem confirmação.

- **Pedro Vinícius:** utilizei o **ChatGPT** como tutor durante a AV2 para entender conceitos como `sessionStorage`, Context API, `useEffect`, rotas protegidas e tratamento de respostas HTTP. A ferramenta também forneceu exemplos de código para copiar e adaptar, orientações para integrar a tela de login da Manu, diagnóstico de erros no Console e ajuda com comandos Git, resolução de conflito e organização da documentação. Eu inseri e ajustei os arquivos no VS Code, executei os testes no navegador e no DevTools, rodei lint/build e fiz pessoalmente os commits, o push e a abertura do Pull Request. Revisei os resultados com base na execução real do projeto; não considerei uma sugestão de IA como prova de funcionamento sem testar.
- **Vanderson Gabriel:** _[Preencher pelo próprio integrante.]_
- **Emanuele Vitoria:** _[Preencher pela própria integrante.]_

## Entrega e versionamento

- Repositório único da AV1 e AV2: [github.com/gabrielvasc06/barbearia_web](https://github.com/gabrielvasc06/barbearia_web).
- Histórico de desenvolvimento: commits e Pull Requests de cada integrante.
- **Tag `entrega-av1`:** _[Equipe: confirmar existência e referência correta.]_
- **Commit final da AV2:** _[Preencher após concluir a integração.]_
- **Tag `entrega-av2`:** _[Criar e registrar depois dos testes finais, apontando para o commit entregue.]_
- **Registro da entrega no Teams:** _[Preencher conforme as orientações do professor.]_

A apresentação deve demonstrar a evolução AV1 → AV2. Todos os integrantes precisam explicar suas próprias implementações, as chamadas da API, o funcionamento da sessão e o comportamento de contingência.
