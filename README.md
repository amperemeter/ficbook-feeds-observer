# Ficbook Feeds Parser
Парсер для сайта [ficbook.net](https://ficbook.net), отслеживающий появление новых фанфиков в выбранных фандомах и пэйрингах. 

### Представлено два вида парсеров
1) С использованием базы данных в облачном хранилище.
2) С использованием хранящегося локально файла.

### Шаги установки парсера

#### Создание проекта
1. Создайте на компьютере папку с любым названием.
2. Создайте внутри папки файл `index.js`.
3. Вы должны находитьсяНаходясь в корне проекта, инициализируйте проект nodejs. 
Для этого введите в терминале (cmd в Windows) команду:
```js 
[npm init]
```
4. Установите парсер, введя команду: 
```js
[npm install ficbook-feeds-parser]
```

#### Создание базы данных
1. Зарегистрируйтесь на сайте [cloud.mongodb.com](https://cloud.mongodb.com/) и создайте новый кластер (на данный момент, чтобы зайти на сайт, требуется VPN). 
2. Создайте в кластере базу данных с названием `fanficsdb`, а внутри нее коллекцию с названием `fanfics`. 
3. Создайте юзера со всеми правами. 
4. Создайте в `fanfics` объекты c названием нужного вам фэндома или пэринга, ссылкой на него и количеством фанфиков в значении 0.
- Выглядеть должно так:
```js
{ "_id": {"$oid": "5fbd52194c8f4b6314d6b5e1"}, "name": "Гарри Поттер", "url": "https://ficbook.net/fanfiction/books/harri_potter", "count": 0 }
```
- ID создается автоматически.
- В ссылке на пэйринг закодируйте кириллицу в кодировке UTF-8 . Пример ссылки: 
```js
https://ficbook.net/pairings/%D0%9D%D1%83%D0%B0%D0%B4%D0%B0---%D0%9D%D1%83%D0%B0%D0%BB%D0%B0
```

#### Подключение базы данных
1. Создайте в корне проекта папку `data`. 
2. Создайте внутри папки `data` файл `uri.js`. 
3. Добавьте в файле `uri.js` строку `module.exports = "mongodb+srv://<username>:<password>@<clustername>.xmsaf.mongodb.net/?retryWrites=true&w=majority&appName=<Clustername>";`
4. В этой же строке поменяйте значения `[username]`, `[password]`, `[clustername]` на ваши значения. 
5. Добавьте в файле `index.js` строки:
```js
const parser = require("ficbook-feeds-parser/mongo");
const data = require('./data/uri');
parser(data);
```
  
#### Использование парсера
Запустить парсер в терминале стандартной командой `[node index]` или `[node .]`. Первый запуск парсера добавит количество фанфиков в базу данных. 
Последующие запуски отобразят количество новых фанфиков при их наличии.

## Хранение данных локально
При желании вы можете хранить данные не в базе данных, а локально в файле `fanfics.json`. Для этого воспользуйтесь [следующей инструкцией](./README-LOCAL.md).

## ВАЖНО!
При запуске парсера желательно хотя бы некоторое время проследить за ходом выполнения парсинга. Если вам кажется, что во время парсинга что-то пошло не так, нажмите `[CTRL+C]` для завершения процесса.
