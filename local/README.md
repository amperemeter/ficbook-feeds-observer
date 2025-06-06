# Ficbook Feeds Observer

Парсер для сайта <a href="https://ficbook.net" target="_blank">ficbook.net</a>, отслеживающий появление новых фанфиков в выбранных фандомах,
пэйрингах или жанрах.

## Представлено два вида парсеров

1. С использованием базы данных в облачном хранилище.
2. С использованием локально хранящегося файла с данными.

## Шаги установки парсера (с использованием файла с данными)

Чтобы использовать парсер, установите вначале Node.js (гугл в помощь).

### Создание проекта

Выполните шаги (до создания базы данных) из [следующей инструкции](../README.md).

### Создание данных

1. Создайте в корне проекта папку `data`, а внутри нее файл `fanfics.json`.
2. Создайте в файле `fanfics.json` объекты с названием нужного вам фэндома, пэйринга или жанра, ссылкой на него и
   количеством фанфиков в значении 0.

   - Объект должен выглядеть
     так: `{ "name": "Наруто", "url": "https://ficbook.net/fanfiction/anime_and_manga/naruto", "count": 0 }`.
   - В ссылке на пэйринг необходимо закодировать кириллицу в кодировке UTF-8. Пример ссылки:
     `https://ficbook.net/pairings/%D0%9D%D1%83%D0%B0%D0%B4%D0%B0---%D0%9D%D1%83%D0%B0%D0%BB%D0%B0`).
   - [Пример](example.json) того, как должно быть.

## Использование парсера

1. Создайте в корне проекта файл `index.js` и пропишите в нем строки:

    ```
    const observe = require("ficbook-feeds-observer/local");
    const data = require('./data/fanfics');
    observe(data);
    ```

2. Запустите парсер стандартной командой `node index` или `node .` в терминале. Первый запуск парсера запишет количество фанфиков в `fanfics.json`. Последующие запуски отобразят количество новых фанфиков при их наличии.

## Хранение данных в Mongodb

При желании вы можете хранить данные не локально в файле `fanfics.json`, а в базе данных в облачном хранилище.
Для этого воспользуйтесь [следующей инструкцией](../README.md). Это более надежный способ хранения данных.

## ВАЖНО!

При запуске парсера желательно хотя бы некоторое время проследить за ходом выполнения парсинга. Если вам кажется, что во
время парсинга что-то пошло не так, нажмите `CTRL+C` для завершения процесса.
На случай непредвиденных ошибок перед запуском парсинга лучше создать копию файла `fanfics.json`.
