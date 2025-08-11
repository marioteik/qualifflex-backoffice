# 📋 Documentação do Qualiflex Backoffice

## 🎯 Visão Geral

O **Qualiflex Backoffice** é uma aplicação web moderna desenvolvida em React que permite o gerenciamento completo de operações logísticas e de produção. Esta plataforma oferece uma interface intuitiva para administradores e gestores acompanharem e controlarem todo o fluxo de trabalho da empresa.

### ✨ Principais Funcionalidades

- 📊 **Dashboard Interativo** - Visão geral em tempo real
- 🚚 **Gestão de Remessas** - Controle completo do ciclo de vida
- 👥 **Gestão de Usuários** - Administração de perfis e permissões
- 📦 **Controle de Produtos** - Cadastro e manutenção de produtos
- 🏭 **Ordens de Produção** - Acompanhamento de produção
- 💰 **Ordens de Compra** - Gestão de compras e fornecedores
- 💬 **Sistema de Chat** - Atendimento e comunicação
- 📋 **Romaneio** - Controle de cargas e entregas
- 🔐 **Sistema de Permissões** - Controle de acesso granular

---

## 🚀 Primeiros Passos

### Acesso ao Sistema

1. **Acesse a URL**: `https://backoffice.qualiflex.com.br`
2. **Faça login** com suas credenciais
3. **Navegue** pelo menu lateral para acessar as funcionalidades

### Requisitos do Sistema

- **Navegador**: Chrome, Firefox, Safari ou Edge (versões recentes)
- **Conexão**: Internet estável
- **Resolução**: Mínimo 1024x768 (recomendado 1920x1080)

---

## 📊 Dashboard

### Visão Geral

O **Dashboard** é a tela principal do sistema, oferecendo uma visão consolidada de todos os indicadores importantes:

#### 📈 Métricas Principais

- **Total de Remessas**: Número total de remessas no sistema
- **Itens Processados**: Quantidade de itens já processados
- **Aprovações Pendentes**: Remessas aguardando aprovação
- **Costureiras Ativas**: Usuários ativos no sistema

#### 📊 Gráficos e Relatórios

- **Gráfico de Remessas por Dia**: Últimos 30 dias
- **Distribuição por Status**: Percentual de cada status
- **Tendências**: Comparação com períodos anteriores

---

## 🚚 Gestão de Remessas

### Visão Geral das Remessas

A seção de **Remessas** permite gerenciar todo o ciclo de vida das remessas, desde a criação até a entrega.

#### 📋 Status das Remessas

1. **Todas** - Visualizar todas as remessas
2. **Pendentes** - Remessas aguardando processamento
3. **Aguardando Aprovação** - Remessas que precisam de aprovação
4. **Confirmados** - Remessas aprovadas e confirmadas
5. **Em Produção** - Remessas sendo produzidas
6. **Coletados** - Remessas finalizadas e coletadas
7. **Recusados** - Remessas rejeitadas
8. **Arquivo** - Histórico de remessas antigas

#### 🔍 Funcionalidades

- **Filtros Avançados**: Por data, status, cliente, etc.
- **Busca Rápida**: Encontrar remessas específicas
- **Exportação**: Gerar relatórios em PDF/Excel
- **Detalhamento**: Visualizar informações completas de cada remessa

### 📝 Criando uma Nova Remessa

1. Acesse **Remessas** → **Nova Remessa**
2. Preencha os dados obrigatórios:
   - Cliente
   - Endereço de entrega
   - Produtos e quantidades
   - Data de entrega
3. Clique em **Salvar**

### ✏️ Editando Remessas

1. Localize a remessa desejada
2. Clique no ícone de **Editar**
3. Modifique os campos necessários
4. Salve as alterações

---

## 👥 Gestão de Usuários

### Visão Geral

A seção **Gestão de Usuários** permite administrar todos os usuários do sistema, seus perfis e permissões.

#### 👤 Tipos de Usuário

- **Administradores**: Acesso total ao sistema
- **Gerentes**: Acesso a funcionalidades específicas
- **Operadores**: Acesso limitado a determinadas áreas
- **Costureiras**: Acesso apenas às suas tarefas

#### 🔧 Funcionalidades

- **Cadastro de Usuários**: Adicionar novos usuários
- **Edição de Perfis**: Modificar dados e permissões
- **Ativação/Desativação**: Controlar acesso ao sistema
- **Reset de Senha**: Auxiliar usuários com problemas de acesso

### ➕ Criando um Novo Usuário

1. Acesse **Gestão de Usuários**
2. Clique em **Novo Usuário**
3. Preencha os dados:
   - Nome completo
   - E-mail
   - Telefone
   - Perfil de acesso
   - Senha inicial
4. Clique em **Salvar**

---

## 🔐 Sistema de Permissões

### Visão Geral

O **Sistema de Permissões** permite definir níveis de acesso específicos para cada usuário ou grupo.

#### 🎭 Papéis (Roles)

- **Super Admin**: Acesso total
- **Admin**: Acesso administrativo
- **Manager**: Acesso gerencial
- **Operator**: Acesso operacional
- **Viewer**: Apenas visualização

#### 🔑 Permissões Disponíveis

- **Dashboard**: Visualizar dashboard
- **Shipments**: Gerenciar remessas
- **Users**: Gerenciar usuários
- **Products**: Gerenciar produtos
- **Orders**: Gerenciar ordens
- **Reports**: Gerar relatórios
- **Settings**: Configurações do sistema

### ⚙️ Configurando Permissões

1. Acesse **Permissionamento** → **Papéis**
2. Selecione o papel desejado
3. Marque/desmarque as permissões necessárias
4. Salve as alterações

---

## 📦 Gestão de Produtos

### Visão Geral

A seção **Produtos** permite cadastrar e gerenciar todos os produtos disponíveis no sistema.

#### 📋 Funcionalidades

- **Cadastro de Produtos**: Adicionar novos produtos
- **Categorização**: Organizar por categorias
- **Preços**: Definir valores e variações
- **Estoque**: Controlar disponibilidade
- **Imagens**: Adicionar fotos dos produtos

### ➕ Cadastrando um Produto

1. Acesse **Produtos**
2. Clique em **Novo Produto**
3. Preencha os dados:
   - Nome do produto
   - Descrição
   - Categoria
   - Preço
   - Dimensões
   - Peso
4. Adicione imagens (opcional)
5. Clique em **Salvar**

---

## 🏭 Ordens de Produção

### Visão Geral

As **Ordens de Produção** permitem acompanhar e gerenciar todo o processo de fabricação.

#### 📊 Status das Ordens

- **Pendente**: Aguardando início
- **Em Produção**: Sendo fabricada
- **Finalizada**: Produção concluída
- **Cancelada**: Ordem cancelada

#### 🔍 Funcionalidades

- **Criação de Ordens**: Gerar novas ordens
- **Acompanhamento**: Visualizar progresso
- **Alterações**: Modificar detalhes
- **Relatórios**: Gerar relatórios de produção

---

## 💰 Ordens de Compra

### Visão Geral

As **Ordens de Compra** permitem gerenciar a aquisição de materiais e insumos.

#### 📋 Funcionalidades

- **Criação de Ordens**: Solicitar compras
- **Aprovação**: Processo de aprovação
- **Fornecedores**: Gestão de fornecedores
- **Controle de Custos**: Acompanhamento de gastos

---

## 💬 Sistema de Chat

### Visão Geral

O **Sistema de Chat** permite comunicação interna e atendimento ao cliente.

#### 💬 Funcionalidades

- **Chat Interno**: Comunicação entre usuários
- **Atendimento**: Suporte ao cliente
- **Histórico**: Conversas anteriores
- **Notificações**: Alertas de novas mensagens

### 💬 Iniciando uma Conversa

1. Acesse **Atendimentos**
2. Clique em **Nova Conversa**
3. Selecione o destinatário
4. Digite sua mensagem
5. Envie

---

## 📋 Romaneio

### Visão Geral

O **Romaneio** permite controlar cargas e entregas de forma organizada.

#### 📊 Funcionalidades

- **Criação de Romaneios**: Organizar entregas
- **Roteirização**: Definir rotas otimizadas
- **Acompanhamento**: Visualizar progresso
- **Relatórios**: Gerar relatórios de entrega

---

## 🔧 Configurações e Preferências

### Perfil do Usuário

1. Clique no seu **nome/avatar** no canto superior direito
2. Selecione **Meu Perfil**
3. Edite suas informações pessoais
4. Altere sua senha se necessário

### Configurações do Sistema

- **Notificações**: Configurar alertas
- **Tema**: Escolher entre modo claro/escuro
- **Idioma**: Selecionar idioma da interface
- **Fuso Horário**: Definir timezone

---

## 🔍 Dicas de Navegação

### Atalhos Úteis

- **Ctrl + K**: Busca rápida
- **F5**: Atualizar página
- **Ctrl + R**: Recarregar dados
- **Esc**: Fechar modais/dropdowns

### Filtros e Busca

- Use os **filtros avançados** para encontrar informações específicas
- Utilize a **busca global** para localizar rapidamente
- Salve **filtros favoritos** para uso frequente

---

## 📱 Responsividade

### Dispositivos Suportados

- **Desktop**: Interface completa
- **Tablet**: Layout adaptado
- **Mobile**: Versão otimizada

### Navegação Mobile

- Menu lateral colapsável
- Botões maiores para toque
- Interface simplificada

---

## 🆘 Suporte e Ajuda

### Problemas Comuns

#### 🔐 Esqueci minha senha
1. Acesse a tela de login
2. Clique em **Esqueci minha senha**
3. Digite seu e-mail
4. Siga as instruções recebidas

#### 📊 Dados não carregam
1. Verifique sua conexão com a internet
2. Tente atualizar a página (F5)
3. Limpe o cache do navegador
4. Entre em contato com o suporte

#### 💬 Chat não funciona
1. Verifique se está logado
2. Recarregue a página
3. Verifique as notificações do navegador

### Contato do Suporte

- **E-mail**: suporte@qualiflex.com.br
- **Telefone**: (11) 99999-9999
- **WhatsApp**: (11) 99999-9999
- **Horário**: Segunda a Sexta, 8h às 18h

---

## 🔄 Atualizações do Sistema

### Notificações de Atualização

- O sistema exibe notificações quando há atualizações disponíveis
- Recomenda-se salvar seu trabalho antes de atualizar
- As atualizações são automáticas e não afetam seus dados

### Novidades

- Novas funcionalidades são anunciadas no dashboard
- Tutoriais são disponibilizados para novas features
- Feedback é sempre bem-vindo

---

## 📄 Termos de Uso

### Política de Privacidade

- Seus dados são protegidos conforme LGPD
- Informações pessoais não são compartilhadas
- Acesso é restrito a usuários autorizados

### Uso Responsável

- Não compartilhe suas credenciais
- Faça logout ao sair do sistema
- Reporte problemas de segurança

---

## 📞 Contatos Importantes

### Equipe de Desenvolvimento
- **Desenvolvedor**: dev@qualiflex.com.br
- **Gerente de Projeto**: projeto@qualiflex.com.br

### Emergências
- **Suporte Técnico**: (11) 99999-9999
- **WhatsApp**: (11) 99999-9999

---

*Última atualização: Dezembro 2024*

*Versão do documento: 1.0*

---

**Qualiflex Backoffice** - Transformando a gestão logística em eficiência e simplicidade.

