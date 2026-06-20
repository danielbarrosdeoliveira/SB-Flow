# Sistema para Gestão para Salões de Beleza Feminino (SB-Flow)

## Motivo

Minha esposa tem um salão de cuidados pessoais para mulheres:

- Extensão de Cílios: 

Técnica fio a fio com materiais premium para garantir volume, curvatura e um olhar marcante, mantendo a saúde dos seus fios naturais com acabamento impecável.

- Lash Lifting: 

Tratamento que eleva e curva seus cílios naturais desde a raiz, proporcionando um efeito de rímel duradouro e um olhar mais aberto sem a necessidade de extensões.

- Sobrancelha: 

Design estratégico baseado no visagismo facial para valorizar seu olhar, incluindo mapeamento, remoção precisa de fios e finalização personalizada.

- Hidra Gloss: 

Procedimento de hidratação profunda para lábios, devolvendo o viço e o brilho natural, com efeito revitalizante e preenchimento de linhas finas.

- Epilação Corporal e Íntima: 

Remoção técnica de pelos com ceras de alta qualidade e métodos que minimizam o desconforto, deixando a pele lisa, macia e livre de irritações por muito mais tempo.

- Limpeza de Pele: 

Protocolo completo de higienização, extração de impurezas e hidratação profunda para remover células mortas e revitalizar o brilho natural da sua face.

Mas ela contratou uma pessoa para fazer outros procedimentos para complementar seu Studio que faz:

- Extensão de Unhas com Fibra de Vidro e Gel
- Manicure
- Pedicure
- Esmaltação

E devido a essa nova pessoa, elas compartilham suas agendas em um grupo no Whatsapp, e recentemente, elas tiveram problema com uma cliente, por não terem atualizado a agenda, o que acabou gerando um desconforto.

## Objetivo

Ter um sistema de gestão de agenda, onde uma consiga ver a agenda da outra, mas sem ter acesso a valores, mas para auxiliar a tomar decisões de agendar uma cliente ou não.

- Elas precisam poder bloquear a agenda.

## Possíveis Soluções:

1. Sistema web reponsivo que funcione em qualquer aparelho, onde teria um dashboard para acesso de ambas, e a cliente com acesso para realizar o agendamento por conta própria (isso seria problema com as clientes que tem dificuldade com tecnologia);

2. Bot no Whatsapp que tenha acesso a uma agenda compartilhada, e consiga fazer os agendamentos da clientes, com opção de lembra-las

3. Dashboard + Acesso Cliente + Bot

## O que o sistema precisa ter:

- Cadastro de Funcionários
- Cadastro de Serviços
- Cadastro de Clientes (apenas com número de Telefone e Nome, sem-email, sem senha), o histórico seria tudo pelo telefone
- Agenda Compartilhada para visualizar os atendimentos
- Dashboardo individual para os funcionários, movimentação financeira, agendas, clientes
- Dashboard do Salão, onde minha esposa tenha acesso a toda a movimentação financeira, de agendas, clientes.
- Relatórios para extração
- Bot para realizar agendamento para as clientes pelo Whatsapp
  -- Aqui talvez entra o EvolutionAPI (https://docs.evolutionfoundation.com.br/evolution-api)
  -- Vou precisar de ajuda para pensar a respeito disso aqui
  -- Talvez ter uma interface web para

## Tecnologias que pensei

Sistema será por enquanto monorepo raiz, onde dentro do projeto tenho api e web.

### Frontend

- Vite com SSR, pois teremos uma lading page para o sistema que fala sobre o salão
- Vue.js 3
- ShadcnVue
- Pinia
- Zod

### Backend

- Fastify
- PostgreSQL (Neon.tech)
- DrizzleORM
