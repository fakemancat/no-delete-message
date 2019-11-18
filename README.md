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
    "maxAge": 1800000,
    "groupToken": "",
    "chatIds": [],
    "userId": 0
}
```

|Свойство|Тип|Описание|По умолчанию|Обязательный|
|-|-|-|-|-|
|userToken|string|Ключ доступа пользователя от KateMobile|*пустая строка*|Да|
|chatId|number|Айди беседы, куда будут высылаться уведомления|0|Да|
|maxAge|number|Время через которое любое сообщение после его отправки больше не будет проверяться на удаление (От утечки ОЗУ)|1800000|Нет|
|groupToken|string|Ключ доступа группы|*пустая строка*|Нет|
|chatIds|Array|Массив бесед в которых нужно проверять сообщения|[]|Нет|
|userId|number|Ваш айди во ВКонтакте|0|Да|

* ```maxAge``` должен быть в виде миллисекунд, где 1 секунда = 1000 миллисекунд.

* Если Вы хотите, чтобы уведомления шли не от Вашего имени, а от группы, то дополнительно заполните ```groupToken```

* Если Вы хотите, чтобы сообщения проверялись только в определённых беседах, то заполните массив ```chatIds```. Если хотите, чтобы беседы вообще не проверялись, то заполните массив одним нулём ```[0]```. Чат айди бесед, должен быть от вашей страницы.

***Важно***: группа должна быть в беседе указанной в ```chatId```, иначе она не сможет отправлять сообщения. Если Вы используете группу в качестве отправителя, то параметр ```chatId``` должен быть от её имени.

### Запуск
Для запуска скрипта требуется ввести:

```bash
npm start
```

### Функционал
Скрипт работает на только собщения от пользователей. Если Ваш собеседник удалит или отредактирует сообщение, бот напишет об этом в указанную беседу от вашего имени или (если вы заполнили ```groupToken```) от имени группы

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

**Статистика**

Если написать в беседу слово ```stats```, то бот ответит таким сообщением:
```
Статистика:
- Удалённых сообщений: {число}
- Изменённых сообщений: {число}
- Сообщений сохранено сейчас: {число}
```

Вместо ```{число}``` будет определённый счётчик.
#
И если у сообщения были какие-то вложения (голосовые сообщения включительно), то бот прикрепит их к этому уведомлению, учитывая новое сообщение после редактирования.

---
Контакты:
* [ВКонтакте](https://vk.com/fakeman.cat_fmc)
* Telegram - @fakemancat