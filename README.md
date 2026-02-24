# Prayer Site (Next.js + Tailwind + Prisma SQLite)

## Быстрый запуск
1) Установить зависимости:
```bash
npm i
```

2) Создать `.env` по примеру `.env.example`

3) Инициализировать БД:
```bash
npx prisma migrate dev --name init
```

4) Запуск:
```bash
npm run dev
```

## Админка
- /admin
- логин/пароль: ADMIN_EMAIL и ADMIN_PASSWORD_HASH в `.env`
