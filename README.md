<h1 align="center">no-delete-message</h1>
<p align="center">
Этот скрипт позволяет Вам видеть все удалённые сообщения Ваших собеседников во ВКонтакте
<br><br>
<img src="https://img.shields.io/github/stars/fakemancat/no-delete-message?style=for-the-badge" alt="stars"></img>
<img src="https://img.shields.io/github/forks/fakemancat/no-delete-message?style=for-the-badge" alt="forks"></img>
<img src="https://img.shields.io/github/issues/fakemancat/no-delete-message?style=for-the-badge" alt="forks"></img>
</p>

---
### Установка
```bash
git clone https://github.com/fakemancat/no-delete-message; cd no-delete-message; npm install
```

### Настройка
После установки у Вас появится папка ```no-delete-message```, перейдите в неё (в дальшейшем работа будет только в ней)

Файл ```config.json```:

```json
{
    "userToken": "",
    "chatId": 0,
    "interval": 15000
}
```

|Свойство|Тип|Описание|По умолчанию|
|-|-|-|-|
|userToken|string|Ключ доступа пользователя от KateMobile|*пустая строка*|
|chatId|number|Айди беседы, куда будут высылаться уведомления|0|
|interval|number|Частота проверки сообщений|15000|

```interval``` должен быть в виде миллисекунд, где 1 секунда = 1000 миллисекунд.

### Запуск
Для запуска скрипта требуется ввести:

```bash
npm start
```

### Функционал
Скрипт работает на только собщения от пользователей. Если Ваш собеседник удалит или отредактирует сообщение, бот напишет об этом в указанную беседу от вашего имени
**Удаление сообщения**
```
*Имя пользователя* Удалил сообщение
<<текст сообщения>>
```
**Редактирование сообщения**
```
*Имя пользователя* Изменил сообщение
<<*текст сообщения*>>
=>
```

```
*Новое сообщение*
```
#
И если у сообщения были какие-то вложения (голосовые сообщения включительно), то бот прикрепит их к этому уведомлению, учитывая новое сообщение после редактирования.

---
Контакты:
* [ВКонтакте](https://vk.com/fakeman.cat_fmc)
* Telegram - @fakemancat