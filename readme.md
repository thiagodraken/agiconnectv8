# Agiconnect V8

Sistema multi-tenant com painel Super Admin, Admin do Cliente e Operadores.

## Tecnologias

- Backend: NestJS + TypeORM + PostgreSQL + WebSocket + Docker
- Frontend: React + Vite + TailwindCSS
- Integração com WhatsApp Cloud API (Meta)
- WebSocket (chat em tempo real)
- Painel independente para cada tipo de usuário

## Como rodar

### 1. Pré-requisitos

- Node.js
- Docker + Docker Compose
- Conta Meta Developer (WhatsApp API)

### 2. Comandos

```bash
docker-compose down -v
docker-compose up --build

Acesse:

    Frontend: http://localhost:5173

    Backend API: http://localhost:3000

    pgAdmin: http://localhost:5050


---

Depois de tudo pronto:

```bash
git add .
git commit -m "Projeto Agiconnect V8 - estrutura completa com backend, frontend e Docker"
git push -u origin main