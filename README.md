# GRAVITYMIND

Plataforma de estudo de Física com aulas, questões, Flash Cards, quadro de resolução,
calculadora, anotações, progresso e Tutor.

- [Aplicação online](https://gravitymind.frostmello09.workers.dev)
- [Quadro Kanban público](https://trello.com/b/BZjw4a2F/tcc)
- [Arquitetura e responsabilidades do código](docs/arquitetura.md)
- [Banco de dados](docs/banco-de-dados.md)
- [Segurança](SECURITY.md)

## Executar

Requer Node.js 22 ou superior. Instale as dependências com `npm ci` e configure as
variáveis descritas em `.env.example` no arquivo local `.env.local`. Chaves secretas
nunca devem receber o prefixo `VITE_` nem ser versionadas.

```sh
npm run dev -- --host 127.0.0.1 --port 4173
```

O ambiente local fica em http://127.0.0.1:4173. Produção utiliza Cloudflare Workers
e Supabase/PostgreSQL; os scripts D1 são legados. O Tutor usa Groq somente no servidor.
O checkout precisa de configuração própria e não deve ser apresentado como pagamento
homologado apenas porque a tela Plus está disponível.

## Verificar

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run security:secrets
npm run security:client
```

`npm run test:e2e` executa os testes de navegador existentes. Testes externos ignorados
não contam como validação da IA ou do banco em produção. A descrição das camadas e
dos cenários de regressão está em `docs/arquitetura.md`.
