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
- логин/пароль: ADMIN_EMAIL и ADMIN_PASSWORD (или ADMIN_PASSWORD_HASH) в `.env`

## Тестовая почта и отправка на реальный email
Можно запускать проект даже без реального SMTP-провайдера:

1. В `.env` включите тестовый режим:
```env
SMTP_TEST_MODE="1"
SMTP_TEST_TO="your-real-email@example.com"
```

2. Что это дает:
- если `SMTP_HOST/SMTP_USER/SMTP_PASS` не заданы, автоматически создается тестовый SMTP-аккаунт Ethereal;
- все исходящие письма можно принудительно отправлять на `SMTP_TEST_TO` (удобно для QA на реальный ящик);
- ссылка предпросмотра тестового письма выводится в логах сервера (`[mail:test] Preview URL ...`).

3. Для боевого режима верните `SMTP_TEST_MODE="0"` и укажите реальные SMTP-параметры.

