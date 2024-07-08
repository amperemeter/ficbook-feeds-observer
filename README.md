# Ficbook Feeds Observer

Парсер для сайта [ficbook.net](https://ficbook.net), отслеживающий появление новых фанфиков в выбранных фандомах,
пэйрингах или жанрах.

## Представлено два вида парсеров

1. С использованием базы данных в облачном хранилище.
2. С использованием локально хранящегося файла.

## Шаги установки парсера (с использованием базы данных)

Чтобы использовать парсер, установите вначале Node.js (гугл в помощь).

### Создание проекта

1. Создайте на компьютере папку с любым названием.
2. Находясь в корне проекта, введите в терминале (cmd в Windows) команду:

    ```
    npm init
    ```

3. Установите парсер, введя команду:

    ```
    npm install ficbook-feeds-observer
    ```

### Создание базы данных

1. Зарегистрируйтесь на сайте [cloud.mongodb.com](https://cloud.mongodb.com/) и создайте кластер (например `Parser`). На данный
   момент, чтобы зайти на сайт, требуется VPN.
2. Создайте в кластере базу данных (например `fanficsdb`), а внутри нее коллекцию (например `fanfics`).
3. Создайте юзера со всеми правами.
4. Создайте в коллекции объекты с названием нужного вам фэндома, пэйринга или жанра, ссылкой на него и количеством
   фанфиков в значении 0.

   - Выглядеть должно так:
     `{ "_id": {"$oid": "5fbd52194c8f4b6314d6b5e1"}, "name": "Гарри Поттер", "url": "https://ficbook.net/fanfiction/books/harri_potter", "count": 0 }`
   - ID создается автоматически.
   - В ссылке на пэйринг закодируйте кириллицу в кодировке UTF-8. Пример ссылки:
     `https://ficbook.net/pairings/%D0%9D%D1%83%D0%B0%D0%B4%D0%B0---%D0%9D%D1%83%D0%B0%D0%BB%D0%B0`

### Подключение базы данных

1. Создайте в корне проекта папку `data`, а внутри нее файл `uri.js`.
2. Пропишите в файле `uri.js` строку, заменив `username`, `password`, `clustername` на ваши значения:

    ```
    module.exports = "mongodb+srv://<username>:<password>@<clustername>
    .xmsaf.mongodb.net/?retryWrites=true&w=majority&appName=<Clustername>";
    ```

## Использование парсера

1. Создайте в корне проекта файл `index.js` и пропишите в нем строки, заменив `fanficsdb`, `fanfics` на ваши значения:

    ```
    const observe = require("ficbook-feeds-observer");
    const data = require('./data/uri');
    observe(data, "fanficsdb", "fanfics");
    ```

2. Запустите парсер стандартной командой `node index` или `node .` в терминале. Первый запуск парсера запишет количество фанфиков в базу данных.
   Последующие запуски отобразят количество новых фанфиков при их наличии.

## Хранение данных локально

При желании вы можете хранить данные не в базе данных, а локально в файле `fanfics.json`. Для этого
воспользуйтесь [следующей инструкцией](local/README.md).

## ВАЖНО!

При запуске парсера желательно хотя бы некоторое время проследить за ходом выполнения парсинга. Если вам кажется, что во
время парсинга что-то пошло не так, нажмите `CTRL+C` для завершения процесса.
