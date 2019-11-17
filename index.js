/**
 * Над качеством кода не работал
 * 
 * Делал с девизом "Работает и ладно"
 */

// Imports
const { VK } = require('vk-io');
const { stripIndent } = require('common-tags');

const { debug } = require('./package');
const {
    chatId,
    maxAge,
    userToken,
    groupToken
} = require('./config');

if (!userToken) {
    throw new ReferenceError(
        'Параметр `userToken` не указан в файле конфигурации'
    );
}

if (!chatId) {
    throw new ReferenceError(
        'Параметр `chatId` не указан в файле конфигурации'
    );
}

// Init
const vk = new VK({
    token: userToken
});

const group = groupToken
    ? new VK({
        token: groupToken
    })
    : null
;

const sender = group || vk;

const messages = new Map();

// Functions
function notification(message, params = {}) {
    params = {
        message,
        ...params,
        chat_id: chatId
    };

    return sender.api.messages.send(params);
}

// Functional
let editedMessages = 0;
let deletedMessages = 0;

vk.updates.on('message', async(context) => {
    let {
        text,
        senderId,
        isOutbox,
        attachments,
        id: messageId,
    } = context;

    if (
        isOutbox
        || senderId < 0
    ) {
        return;
    }

    await context.loadMessagePayload();
    attachments = context.attachments;

    if (!messages.has(messageId)) {
        let _context = {
            text,
            senderId,
            attachments,
            createdAt: Date.now(),
        };

        if (!context.hasText) {
            _context.text = 'Нет текста';
        }

        if (context.hasAttachments('audio_message') && sender === group) {
            _context.audioMessage = context.getAttachments('audio_message')[0].url;
        }

        messages.set(messageId, _context);
    }

    if (context.is('edit_message')) {
        const currentMessage = messages.get(messageId);

        const [user] = await vk.api.users.get({ user_ids: senderId });

        await notification(stripIndent`
            [id${senderId}|${user.first_name}] Изменил сообщение
            <<${currentMessage.text}>>
            =>
        `, {
            attachment: currentMessage.attachments
        });

        await notification(text, {
            attachment: attachments
        });
        
        messages.set(messageId, {
            text,
            senderId,
            attachments,
            createdAt: currentMessage.createdAt
        });

        editedMessages++;
    }
});

vk.updates.on(['set_message_flags'], async(context) => {
    if (context.flags !== 131200) return;

    const message = messages.get(context.id);
    if (!message) return;

    const [user] = await vk.api.users.get({
        user_ids: message.senderId
    });

    if (message.audioMessage && sender === group) {
        const attachment = await sender.upload.audioMessage({
            source: message.audioMessage,
            peer_id: user.id
        });

        message.attachments.push(attachment);
    }

    await notification(stripIndent`
        [id${message.senderId}|${user.first_name}] Удалил сообщение
        <<${message.text}>>
    `, {
        attachment: message.attachments
    });

    messages.delete(context.id);

    deletedMessages++;
});

vk.updates.startPolling();

// Intervals
setInterval(async() => {
    for (const [messageId, message] of messages) {
        if (Date.now() - message.createdAt > maxAge) {
            messages.delete(messageId);
        }
    }
}, 15000);

if (debug) {
    setInterval(async() => {
        await notification(stripIndent`
            Статистика:
            - Удалённых сообщений: ${deletedMessages}
            - Изменённых сообщений: ${editedMessages}
            - Сообщений сохранено сейчас: ${messages.size}
        `);
    }, 21600000);
}