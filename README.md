# 🚗 InfoSistemas Frota - Dashboard de Veículos (Frontend)

Este projeto é uma aplicação web desenvolvida em Angular focada no gerenciamento de veículos. O objetivo principal deste repositório não é apenas exibir dados, mas demonstrar a aplicação de boas práticas modernas de desenvolvimento frontend, arquitetura escalável e componentização limpa.

## 🚀 Tecnologias e Versões
- **Angular 17+** (Adoção nativa de Standalone Components)
- **Signals** (Gerenciamento de estado reativo e granular)
- **RxJS** (Manipulação assíncrona de fluxos de dados)
- **Reactive Forms** (Validação e sincronização robusta de formulários)
- **CSS3 / HTML5** (Layout construído do zero, responsivo, sem dependência de UI kits pesados)
- **Jasmine / Karma** (Configurado para testes unitários)

## 🏗️ Decisões de Arquitetura (Trade-offs e Padrões)

Para elevar a maturidade do código, a seguinte arquitetura foi implementada:

### 1. Padrão Smart & Dumb Components
A interface principal não foi construída em um bloco monolítico. Ela foi dividida para separar a lógica da apresentação:
* **`VehicleListComponent` (Smart):** Atua como o maestro da tela. Ele não possui CSS atrelado à tabela; sua função é injetar o `VehicleService`, gerenciar o estado da requisição e repassar os dados lidos para os filhos.
* **`VehicleTableComponent` (Dumb/Presentational):** Um componente totalmente "cego" e puro. Ele recebe os veículos via `input()` e emite eventos de interação via `output()`. Isso facilita drasticamente a criação de testes unitários isolados e permite que a mesma tabela seja reutilizada em outras partes do sistema.

### 2. State Management Centralizado (Signals)
Em vez de utilizar o `async pipe` desenfreadamente no template, a gerência de estado foi movida inteiramente para o serviço (`VehicleService`) utilizando **Signals**. 
O serviço mantém variáveis reativas como `isLoading`, `error` e `vehicles`. Quando qualquer um desses Signals é atualizado (`.set()` ou `.update()`), a UI reflete a mudança de forma otimizada.

### 3. Mock de API com Simulação de CRUD Completo
O requisito do projeto envolvia a leitura de um arquivo estático (`vehicles.json`). Para mostrar uma estrutura pronta para produção, a camada de serviço foi construída utilizando o `HttpClient` do Angular, disparando uma requisição HTTP real para a pasta `assets`.
* Foi adicionada uma latência intencional (`delay(800)`) usando RxJS para testar a resiliência da interface de Loading.
* Os métodos de **Criação, Edição e Exclusão** operam diretamente na memória (Signal), simulando a latência de processamento de um banco de dados real.
* **Vantagem/Trade-off:** Se o projeto precisar se conectar a uma API REST/GraphQL de verdade futuramente, nenhuma linha de código precisará ser alterada nos componentes da interface; basta trocar a URL alvo no `VehicleService`.

### 4. Formulários Reativos, Prevenção de Erros e Reuso de UI
Para a inserção e atualização de veículos, optou-se pelo uso de **Reactive Forms**. O formulário foi construído com validações rígidas, focando na integridade dos dados e na Experiência do Utilizador (UX):
* **Tratamento Ativo de Input:** Foram implementados manipuladores de eventos que interceptam a digitação do utilizador, limpando instantaneamente letras ou caracteres especiais em campos estritamente numéricos (como *Renavam* e *Ano*).
* **Validações Dinâmicas:** O campo de Ano calcula o limite máximo dinamicamente baseado no ano atual (`new Date().getFullYear() + 1`), com um limite mínimo fixado em 1950.
* **Reuso de Componente:** O mesmo componente visual de Modal é reaproveitado de forma inteligente tanto para a ação de "Criar" quanto para a de "Editar", alternando seu comportamento dinamicamente através de Signals (`isEditingMode`).

### 5. Novo Control Flow do Angular
Os templates HTML foram escritos utilizando o novo e mais performático control flow do Angular (`@if`, `@for`, `@empty`), eliminando o overhead de diretivas estruturais antigas como `*ngIf` e trazendo cenários muito elegantes para o tratamento nativo de listas vazias.

---

## ⚙️ Como executar o projeto localmente

Pré-requisitos: Certifique-se de ter o [Node.js](https://nodejs.org/) e o [Angular CLI](https://angular.dev/) instalados na sua máquina.

1. Clone este repositório:
   git clone <url-do-seu-repositorio>

2. Acesse a pasta do projeto:
   cd veiculos-front

3. Instale as dependências:
   npm install

4. Execute o servidor de desenvolvimento:
   npm start

5. Aceda à aplicação navegando para http://localhost:4200/

---

## 🧪 Rodando os Testes Unitários

Para garantir a qualidade, execute a suíte de testes unitários através do comando:

npm run test
