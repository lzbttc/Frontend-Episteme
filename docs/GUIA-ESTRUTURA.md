# Guia de Estrutura e Desenvolvimento do Frontend — EPIS

## 1. Objetivo

Este documento define os padrões de organização e desenvolvimento do frontend do sistema EPIS.

O objetivo é manter o projeto organizado, facilitar a colaboração no desenvolvimento e estabelecer um padrão para criação de páginas, componentes, estilos, dados simulados, branches e commits.

Este guia deve ser consultado sempre que houver dúvida sobre:

- onde criar um arquivo;
- onde colocar um componente;
- como organizar uma página;
- onde armazenar dados simulados;
- como utilizar as branches;
- como realizar commits;
- como utilizar o Prettier e o ESLint;
- como preparar o frontend para a futura integração com o backend.

---

## 2. Tecnologias utilizadas

O frontend utiliza inicialmente:

- React — construção da interface;
- Vite — ambiente de desenvolvimento e build;
- JavaScript — linguagem principal;
- CSS — estilização;
- ESLint — análise do código;
- Prettier — formatação do código;
- Git — controle de versão;
- GitHub — hospedagem e colaboração no código.

Novas tecnologias ou bibliotecas podem ser adicionadas conforme as necessidades do projeto.

> Novas dependências devem ser adicionadas somente quando houver necessidade real e após alinhamento da equipe responsável pelo frontend.

---

## 3. Estrutura atual do projeto

A estrutura inicial do frontend é:

```text
EPIS/
├── public/
│   └── favicon.svg
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── layouts/
│   ├── mocks/
│   ├── pages/
│   ├── routes/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
│
├── .gitignore
├── .prettierignore
├── .prettierrc.json
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js
```

O diretório `node_modules/` existe localmente, mas não faz parte do código versionado do projeto.

As pastas `components`, `layouts`, `mocks`, `pages` e `routes` possuem inicialmente arquivos `.gitkeep` para que permaneçam no repositório enquanto ainda não possuem outros arquivos.

---

# 4. Organização da pasta `src`

A pasta `src` concentra o código principal da aplicação.

Sua organização inicial é:

```text
src/
├── assets/
├── components/
├── layouts/
├── mocks/
├── pages/
├── routes/
├── styles/
├── App.jsx
└── main.jsx
```

---

## 4.1 `assets/`

Utilizada para recursos estáticos utilizados pela interface.

Exemplos:

- imagens;
- ícones;
- logotipos;
- ilustrações;
- outros recursos visuais.

A criação de subpastas dentro de `assets` deve ocorrer somente quando houver necessidade real.

### Regra

Dados da aplicação não devem ser armazenados em `assets`.

Dados fictícios utilizados durante o desenvolvimento devem ficar em `mocks`.

---

## 4.2 `components/`

Contém componentes reutilizáveis da interface.

Exemplos de componentes que poderão ser criados conforme a necessidade:

```text
components/
├── Button/
├── Input/
├── Modal/
└── Card/
```

Um componente deve ser colocado em `components` quando puder ser reutilizado em diferentes páginas ou partes do sistema.

### Regra

Antes de criar um novo componente, verificar se já existe um componente que possa ser reutilizado ou adaptado.

Evitar duplicação de componentes com a mesma finalidade.

---

## 4.3 `layouts/`

Contém estruturas gerais que podem ser compartilhadas por diferentes páginas.

Um layout pode reunir elementos como:

- cabeçalho;
- barra lateral;
- área principal de conteúdo;
- estrutura geral da página.

Os layouts devem ser criados conforme houver necessidade no sistema.

---

## 4.4 `mocks/`

Contém dados fictícios utilizados durante o desenvolvimento do frontend.

Essa pasta é importante porque o backend será integrado posteriormente.

Os mocks permitem desenvolver e testar as interfaces antes da disponibilidade da API.

Exemplos de arquivos que poderão ser criados:

```text
mocks/
├── users.js
├── events.js
└── notifications.js
```

### Regra

Evitar espalhar grandes conjuntos de dados fictícios diretamente nas páginas e componentes.

Preferir centralizar os dados simulados em `mocks`.

---

## 4.5 `pages/`

Contém as telas completas do sistema.

Cada página deve, preferencialmente, possuir sua própria pasta.

Exemplo:

```text
pages/
└── Login/
    ├── Login.jsx
    └── Login.css
```

Uma `page` representa uma tela completa da aplicação.

As páginas podem utilizar componentes presentes em `components`.

---

## 4.6 `routes/`

Contém a configuração das rotas e da navegação da aplicação.

A organização dessa pasta será definida quando a navegação do sistema for implementada.

As rotas devem apontar para as páginas correspondentes.

---

## 4.7 `styles/`

Contém estilos globais e estilos gerais da aplicação.

Estilos específicos de páginas e componentes devem, preferencialmente, permanecer próximos aos elementos aos quais pertencem.

Exemplo:

```text
components/
└── Button/
    ├── Button.jsx
    └── Button.css
```

Enquanto os estilos globais permanecem em `styles`.

---

# 5. `App.jsx`

O `App.jsx` representa o componente principal da aplicação.

Deve permanecer relativamente simples e servir como ponto de composição da interface.

Conforme o projeto crescer, responsabilidades devem ser distribuídas entre páginas, componentes e outras estruturas.

---

# 6. `main.jsx`

O `main.jsx` é o ponto de entrada da aplicação React.

Sua responsabilidade principal é inicializar o React e renderizar a aplicação.

Evitar colocar regras complexas de negócio neste arquivo.

---

# 7. Como decidir onde criar algo

Utilizar a seguinte lógica:

```text
É uma tela completa?
        ↓
     pages/

É uma estrutura geral compartilhada?
        ↓
    layouts/

É um componente reutilizável?
        ↓
  components/

É um dado fictício?
        ↓
     mocks/

É uma configuração de navegação?
        ↓
     routes/

É um recurso visual?
        ↓
    assets/

É um estilo global?
        ↓
    styles/
```

Antes de criar uma nova pasta principal, verificar se alguma estrutura existente já atende à necessidade.

---

# 8. Organização dos arquivos

Quando fizer sentido, páginas e componentes devem utilizar uma pasta própria.

Exemplo de página:

```text
pages/
└── Login/
    ├── Login.jsx
    └── Login.css
```

Exemplo de componente:

```text
components/
└── Button/
    ├── Button.jsx
    └── Button.css
```

Isso mantém arquivos relacionados próximos uns dos outros.

---

# 9. Nomenclatura

## Componentes e páginas

Utilizar PascalCase:

```text
Login.jsx
Dashboard.jsx
UserCard.jsx
```

## Pastas

Preferencialmente utilizar o mesmo nome do componente ou página:

```text
Login/
Dashboard/
UserCard/
```

## Variáveis e funções

Utilizar camelCase:

```javascript
userData
eventList
isLoading
handleSubmit
```

## Arquivos CSS

Preferencialmente utilizar o mesmo nome do componente:

```text
Button.jsx
Button.css
```

---

# 10. Prettier

O projeto utiliza o Prettier para manter um padrão de formatação entre os arquivos do frontend.

A configuração está no arquivo:

```text
.prettierrc.json
```

O projeto também possui:

```text
.prettierignore
```

para impedir que arquivos ou diretórios definidos nesse arquivo sejam processados pelo Prettier.

Para formatar o projeto:

```bash
npm run format
```

A configuração existente deve ser utilizada no desenvolvimento.

---

# 11. ESLint

O projeto utiliza ESLint para identificar problemas no código.

Para executar a verificação:

```bash
npm run lint
```

Problemas identificados devem ser corrigidos antes de uma Pull Request.

### Diferença entre ESLint e Prettier

```text
ESLint
→ identifica problemas e padrões inadequados

Prettier
→ padroniza a formatação
```

As ferramentas possuem funções diferentes e devem ser utilizadas em conjunto.

---

# 12. Controle de versão

O frontend utiliza Git e GitHub.

O fluxo principal de branches é:

```text
main
  ↓
develop
  ↓
branches de trabalho
```

As branches de trabalho devem representar tarefas específicas.

Exemplos:

```text
feature/login
feature/dashboard
fix/correcao-login
chore/configuracao
```

---

# 13. Branch `main`

A `main` representa a versão estável do frontend.

Não deve ser utilizada para desenvolver funcionalidades diretamente.

Alterações devem chegar à `main` por meio do fluxo definido pela equipe.

---

# 14. Branch `develop`

A `develop` representa a branch de desenvolvimento e integração do frontend.

As funcionalidades concluídas devem ser integradas nessa branch antes de chegarem à `main`.

A `develop` deve permanecer protegida.

---

# 15. Branches de trabalho

Cada tarefa deve ser desenvolvida em uma branch própria.

Exemplos:

```text
feature/login
feature/dashboard
feature/perfil
```

Para correções:

```text
fix/correcao-login
fix/ajuste-menu
```

Para tarefas de configuração:

```text
chore/configuracao
```

A branch deve ser criada a partir da versão mais atual da `develop`.

---

# 16. Criando uma branch

Antes de criar uma nova branch:

```bash
git checkout develop
git pull origin develop
```

Depois:

```bash
git checkout -b feature/nome-da-tarefa
```

Exemplo:

```bash
git checkout -b feature/login
```

---

# 17. Trabalho em equipe

O desenvolvimento deve ocorrer em branches de trabalho.

Exemplo:

```text
develop
│
├── feature/login
│
└── feature/dashboard
```

Dessa forma, diferentes tarefas podem ser desenvolvidas simultaneamente sem alterar diretamente a `develop`.

Quando uma tarefa estiver pronta, deve ser aberta uma Pull Request para `develop`.

---

# 18. Commits

Os commits devem representar alterações lógicas e possuir mensagens claras.

Utilizar o formato:

```text
tipo: descrição
```

## `feat`

Nova funcionalidade:

```text
feat: adiciona tela de login
```

## `fix`

Correção:

```text
fix: corrige validação do formulário
```

## `style`

Alteração visual ou exclusivamente de formatação:

```text
style: ajusta espaçamento do formulário
```

## `refactor`

Reorganização do código sem alteração de comportamento:

```text
refactor: separa componente de formulário
```

## `chore`

Configuração ou manutenção:

```text
chore: configura prettier
```

## `docs`

Alteração de documentação:

```text
docs: adiciona guia de estrutura do frontend
```

---

# 19. Boas práticas para commits

Um commit deve representar uma alteração lógica.

Exemplo:

```text
feat: adiciona formulário de login
```

é preferível a:

```text
alterações
```

Evitar mensagens genéricas como:

```text
teste
mudanças
coisas
final
atualização
```

Não é necessário criar um commit para cada salvamento de arquivo.

---

# 20. Pull Requests

Quando uma tarefa estiver concluída, deve ser criada uma Pull Request da branch de trabalho para `develop`.

Exemplo:

```text
feature/login
      ↓
Pull Request
      ↓
develop
```

A Pull Request deve informar brevemente:

- o que foi desenvolvido;
- principais alterações;
- como a funcionalidade foi testada;
- possíveis pontos de atenção.

---

# 21. Proteção das branches principais

As branches `main` e `develop` devem permanecer protegidas.

O desenvolvimento normal deve ocorrer nas branches de trabalho.

Evitar alterações diretas em:

```text
main
develop
```

---

# 22. Antes de abrir uma Pull Request

Verificar o funcionamento da aplicação:

```bash
npm run dev
```

Verificar problemas com ESLint:

```bash
npm run lint
```

Formatar o projeto:

```bash
npm run format
```

Depois verificar as alterações:

```bash
git status
```

Somente as alterações relacionadas à tarefa devem fazer parte da Pull Request.

---

# 23. Mocks e integração futura com o backend

Enquanto o backend não estiver disponível, o frontend pode utilizar dados fictícios armazenados em `mocks/`.

Quando a integração com a API começar, uma estrutura específica para comunicação com o backend poderá ser adicionada.

Essa estrutura não faz parte da organização inicial atual e deve ser criada somente quando houver necessidade.

---

# 24. Evolução da estrutura

A estrutura atual pode ser ampliada conforme surgirem novas necessidades.

Novos diretórios, componentes e ferramentas podem ser adicionados quando houver justificativa para isso.

Mudanças que alterem significativamente a organização do projeto devem ser alinhadas antes de serem incorporadas.

---

# 25. Regra principal

Cada arquivo deve possuir uma responsabilidade clara e cada pasta deve possuir uma função definida.

Antes de criar algo novo:

1. verificar se já existe uma estrutura adequada;
2. verificar se é possível reutilizar um componente existente;
3. seguir as convenções deste guia;
4. alinhar mudanças estruturais relevantes antes de incorporá-las.

O objetivo é manter o frontend do EPIS organizado, consistente e preparado para crescer.