# Тестовое задание

тз выполнено по шаблону.

## Описание
Пару слов про типы в библиотеке googleapis. Встроенный тип операции BatchUpdate является некорректным, поэтому там используется `ts-ignore`
(подробнее: https://github.com/googleapis/google-api-nodejs-client/issues/3188)

Авторизация в google через ссылку на OAuth2, (после одной авторизации токен сохраняется)

Данные при выкачке из бд сортируются по возрастанию коэффициента `kgvpBooking`

Все настройки можно найти в файлах:

1. compose.yaml
2. dockerfile
3. package.json
4. tsconfig.json
5. src/config/env/env.ts
6. src/config/knex/knexfile.ts
7. credentials.json

## Команды:

Чтобы поднять само приложение, достаточно одной команды:
```bash
docker compose up --build
```

Но оставлю здесь список всех остальных команд с шаблона для проверок.

Запуск базы данных:
```bash
docker compose up -d --build postgres
```

Для выполнения миграций и сидов не из контейнера:
```bash
npm run knex:dev migrate latest
```

```bash
npm run knex:dev seed run
```
Также можно использовать и остальные команды (`migrate make <name>`,`migrate up`, `migrate down` и т.д.)

Для запуска приложения в режиме разработки:
```bash
npm run dev
```

Запуск проверки самого приложения:
```bash
docker compose up -d --build app
```

Для финальной проверки рекомендую:
```bash
docker compose down --rmi local --volumes
docker compose up --build
```

PS: С наилучшими пожеланиями!
