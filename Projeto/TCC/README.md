Maxibuy

Marketplace e-commerce multi-loja desenvolvido como Trabalho de Conclusão de Curso (TCC) — Curso de Desenvolvimento de Sistemas, SENAI.

Sobre o projeto

O Maxibuy é uma plataforma de comércio eletrônico multi-loja na qual comerciantes cadastram e gerenciam produtos, clientes navegam pelo catálogo e realizam compras, e administradores supervisionam toda a operação. O sistema foi construído com arquitetura Full Stack, separando front-end, API e banco de dados.

Perfis de usuário
Cliente — navega pelo catálogo, usa o carrinho, realiza compras, acompanha pedidos e utiliza o suporte.
Comerciante — cadastra e gerencia seus produtos e acompanha vendas.
Administrador — supervisiona produtos, pedidos, usuários, suporte e indicadores globais.
Tecnologias utilizadas
Tecnologia	Finalidade
React 19	Interface e componentes do front-end
TypeScript	Tipagem estática
Vite 8	Desenvolvimento e build do front-end
Tailwind CSS v4	Estilização
Node.js	Execução do back-end
Express 5	API REST e rotas
Mongoose 9	Modelagem e acesso ao MongoDB
MongoDB Atlas	Persistência dos dados
JWT	Autenticação
bcrypt	Hash de senhas
Joi	Validação de dados
Axios	Comunicação front-end/API
Funcionalidades
Cadastro, login e logout com controle de acesso por perfil (cliente, comerciante, administrador)
Catálogo de produtos com busca, filtros, ordenação e paginação
Carrinho de compras e checkout, com validação de preço e estoque no back-end
Cadastro e edição de produtos por comerciantes, com aprovação/rejeição pelo administrador
Gestão de pedidos por perfil (cliente, comerciante, administrador)
Dashboards com indicadores de vendas (receita, ticket médio, itens vendidos, vendas por dia, produtos mais vendidos, entre outros)
Sistema de suporte com mensagens e controle de status (aberto, respondido, resolvido)
Modelo de dados

O banco de dados é o MongoDB Atlas, modelado com Mongoose. Principais coleções:

User — name, email, avatar, password, role
Product — title, category, price, images, description, stock, status, comercianteId
Order — user, items, totalPrice, shippingAddress, paymentMethod, status
SupportMessage — name, email, subject, message, status, user
Arquitetura da API

Fluxo de dados: Front-end → Axios → Express → Routes → Controllers → Mongoose → MongoDB

Estrutura do back-end
Controllers: UserController, ProductController, OrderController, SupportController
Middlewares: authMiddleware (validação de JWT), roleMiddleware (permissão por perfil), validationMiddleware (schemas Joi), rate limiter (rotas de login/cadastro)
Principais rotas

Usuários

POST   /usuario/register
POST   /usuario/login
POST   /usuario/logout
GET    /usuario/me
GET    /usuario
GET    /usuario/:id

Produtos

GET    /produto
GET    /produto/categorias
GET    /produto/lojas
GET    /produto/pendentes
GET    /produto/meus-produtos
GET    /produto/:id
PATCH  /produto/:id/status
PATCH  /produto/:id/estoque

Pedidos

GET    /pedido
GET    /pedido/comerciante
GET    /pedido/comerciante/dashboard
GET    /pedido/admin/dashboard
GET    /pedido/usuario/:userId
GET    /pedido/:id

Suporte

GET    /suporte
GET    /suporte/:id
Estrutura do front-end

Organizado em pages, components, services, contexts, types e utils.

Componentes reutilizáveis: Navbar, Sidebar, ProtectedRoute, ErrorBoundary, ProductCard, PriceTag, BadgeStatus, EmptyState, StoreCard, Icons
Páginas: Home, ProductDetails, Login, Register, Cart, Checkout, OrderHistory, Profile, Support, AddProduct, EditProduct, MyProducts, AdminDashboard, AdminOverview, AdminOrders, AdminSupport, MerchantDashboard, MerchantOrders
Services: api.ts (configuração do Axios), userService, productService, orderService, supportService
Contexts: AuthContext (usuário autenticado), CartContext (carrinho persistido), ProductContext (dados de produtos)
Segurança
Autenticação via JWT
Senhas com hash via bcrypt
Validação de entrada com Joi em todas as rotas relevantes
Controle de acesso por perfil (role-based access control)
CORS restrito e rate limiting nas rotas de autenticação
Validação de preço e estoque no servidor (nunca confiada ao client)
Transação MongoDB no processo de criação de pedido e atualização de estoque
Testes

Testes automatizados com o test runner nativo do Node.js (node:test), cobrindo principalmente os schemas de validação Joi: registro válido, e-mail inválido, senha curta, nome curto, login com corpo vazio, preço negativo/válido no cadastro de produto e validação de status do produto.

Melhorias futuras
Integrar gateway de pagamento real
Implantar em ambiente de produção
Armazenamento próprio para imagens
Ampliar testes automatizados (integração e funcionalidades)
Melhorar acessibilidade
Aperfeiçoar dashboards
Notificações
Acompanhamento de entrega
Avaliações de produtos e lojas
Auditoria de ações administrativas
Evolução do controle de estoque
Contexto acadêmico

Projeto desenvolvido como Trabalho de Conclusão de Curso do curso de Desenvolvimento de Sistemas — SENAI, Curitiba/PR.