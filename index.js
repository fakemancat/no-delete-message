/**
 * Над качеством кода не работал
 * 
 * Делал с девизом "Работает и ладно"
 */

// Imports
const { VK } = require('vk-io');
const { stripIndent } = require('common-tags');

const { debug } = require('./package');
const { userToken, chatId, interval } = require('./config');

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

if (!interval) {
    throw new ReferenceError(
        'Параметр `interval` не указан в файле конфигурации'
    );
}

// Init
const vk = new VK({
    token: userToken
});

const messages = new Map();

// Functions
function notification(message, params = {}) {
    params = {
        message,
        ...params,
        chat_id: chatId
    };

    return vk.api.messages.send(params);
}

function chunk(array, count = array.length) {
    if (array.length <= count) {
        return [array];
    }
    
    const chunks = [];
    const iterations = Math.ceil(array.length / count);
    
    for (let i = 0; i < iterations; i++) {
        chunks.push(
            array.slice(i * count, i * count + count)
        );
    }
    
    return chunks;
}

// Functional
vk.updates.on('message', async(context) => {
    let {
        text,
        senderId,
        isOutbox,
        subTypes,
        attachments,
        id: messageId,
    } = context;

    if (
        isOutbox
        || senderId < 0
        || (
            debug
            && senderId === 479078633
        )
    ) {
        return;
    }

    await context.loadMessagePayload();
    attachments = context.attachments;

    const [user] = await vk.api.users.get({ user_ids: senderId });

    if (!messages.has(messageId)) {
        if (!context.hasText) {
            text = 'Нет текста';
        }
        
        messages.set(messageId, {
            text,
            senderId,
            attachments,
            createdAt: Date.now()
        });
    }

    if (subTypes.includes('edit_message')) {
        const currentMessage = messages.get(messageId);

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
    }
});

vk.updates.startPolling();

setInterval(async() => {
    const keys = messages.keys();
    const messageIds = [];

    for (const key of keys) {
        messageIds.push(key);
    }

    if (!messageIds.length) return;

    const parts = chunk(messageIds, 100);

    for (const part of parts) {
        const { items: currentMessages } = await vk.api.messages.getById({
            message_ids: part
        });

        for (const [messageId, message] of messages) {
            const currentMessage = currentMessages.find((_message) => (
                messageId === _message.id
            ));
            
            if (!currentMessage) {

                const [user] = await vk.api.users.get({
                    user_ids: message.senderId
                });

                await notification(stripIndent`
                    [id${message.senderId}|${user.first_name}] Удалил сообщение
                    <<${message.text}>>
                `, {
                    attachment: message.attachments
                });

                messages.delete(messageId);
            }
        }
    }
}, interval);