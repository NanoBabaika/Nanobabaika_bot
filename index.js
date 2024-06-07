require('dotenv').config();
const {Bot, GrammyError, HttpError, Keyboard, InlineKeyboard} = require('grammy');
const { hydrate } = require('@grammyjs/hydrate');
// создание бота
const bot = new Bot(process.env.BOT_API_KEY);
bot.use(hydrate());

// bot.on('msg:text', async (ctx) => {
//     await ctx.reply('Обработка данных....шучу неумею в сложные сообщения.')
// });

bot.on('message:voice', async (ctx) => {
    await ctx.reply('Не воспринимаю аудио сообщения. Перенаправьте пожалуйста человеку.')
});

bot.on('msg').filter((ctx) => {
    return ctx.from.id === 964408835
}, async (ctx) => {
    await ctx.reply('Добрый день, Александр')
})

// bot.on(':media', async (ctx) => {
//     await ctx.reply('Файл получен.Спасибо.Обращение будет передано в работу.')
// });

// Вывод доступных комманд в меню
bot.api.setMyCommands([
    {
        command:'start', 
        description: 'Запуск бота',
    },
    {
        command:'hello',
        description: 'Приветсвие',

    },
    {
        command: 'info',
        description: 'Информация'
    },
    {
        command: 'mood',
        description: 'Как настроение?'
    },
    {
        command: 'share',
        description: 'Оставить контакты , пройти опрос'
    },
    {
        command: 'menu',
        description: 'Статус заказа'
    },
]);

// статистика по пользователю отправившему сообщение
// bot.on('msg', async (ctx) => {
//     console.log(ctx.msg);
// })

// Прослушки бота
bot.hears(['id', 'ID', ], async (ctx) => {
    await ctx.reply(`Ваш ID ${ctx.from.id}`);
})

bot.hears(['пинг', 'Пинг', 'Снова пинг', 'ping'], async (ctx) => {
    await ctx.reply('ping');
})
// ответ на определенные слова при запросе
bot.hears([/пиздец/, /урод/, /блядь/, /Блядь/, /хуй/, /Хуй/, /пизда/, /пизда/], async (ctx) => {
    await ctx.reply('Пожалуйста не ругайтесь. Давайте вести себя прилично');
})

// команды для взаимодействия
bot.command( ['say_hello', 'hello', 'say_hi'], async (ctx) => {
    await ctx.reply('Привет, человек!', {
        reply_parameters: {message_id: ctx.msg.message_id}
    });
})

// Взаимодействие с муд клавиатурой
bot.hears('Хорошо' , async (ctx) => {
    await ctx.reply('Отлично, рад за Вас. Даже пущу радостную робо слезу');
})

bot.hears('Норм' , async (ctx) => {
    await ctx.reply('Вы держитесь стоически. Помните все временно');
})

bot.hears('Не окэй' , async (ctx) => {
    await ctx.reply('Улыбнись скоро все  изменится и будет окэй');
})

bot.command('start', async(ctx) => {
    await ctx.reply('Я бот созданный Нанобабайкой! :)', {
        reply_parameters: {message_id: ctx.msg.message_id}
    });
});

 

const menuKeyboard = new InlineKeyboard().text('Узнать статус заказа', 'order-status').text('Обратиться в поддержку', 'support');
const backKeyboard = new InlineKeyboard().text('<Назад в меню', 'back');
 
bot.command('menu', async(ctx) => {
    await ctx.reply('Выберите пункт в меню', {
        reply_markup: menuKeyboard,
    })
})

bot.callbackQuery('order-status', async (ctx) => {
    await ctx.callbackQuery.message.editText('Статус заказа: В ожидании обработки', {
        reply_markup: backKeyboard,
    })
    await ctx.answerCallbackQuery()
})

bot.callbackQuery('support', async (ctx) => {
    await ctx.callbackQuery.message.editText('Опишите причину обращения', {
        reply_markup: backKeyboard,
    })
    await ctx.answerCallbackQuery()
})

bot.callbackQuery('back', async (ctx) => {
    await ctx.callbackQuery.message.editText('Выберите пункт в меню', {
        reply_markup: menuKeyboard,
    })
    await ctx.answerCallbackQuery()
})

bot.command('info', async (ctx) => {
    await ctx.react('👍')
    await ctx.reply('Конечно, вот ссылка на мои репозитории GIT: <a href="https://github.com/NanoBabaika?tab=repositories">ссылка</a>', {
        parse_mode: 'HTML'
    });
}) 



bot.command('share', async (ctx) => {
    const shareKeyboard = new Keyboard().requestLocation('Поделиться Геолокацией').requestContact('Оставить контакты').requestPoll('Опрос').placeholder('Оставьте Ваши контакты').resized()

    await ctx.reply('Нажмите кнопку что бы оставить контакты или пройти опрос', {
        reply_markup:shareKeyboard
    })
})

bot.on(':contact', async (ctx) => {
    await ctx.reply('Спасибо свяжемся с Вами в ближайшее время!')
})

 

// отвечать на события клавиатуры можно обычным методом бот слушает (выше)
bot.command("mood", async (ctx) => {
    const moodKeyboard = new Keyboard().text('Хорошо').row().text('Норм').row().text('Не окэй').resized().oneTime()
    await ctx.reply('Как настроение?', {
        reply_markup: moodKeyboard
    })
})

 
 

bot.catch( (err) => {
    const ctx = err.ctx;
    console.error(`Ошибка при работе с ботом ${ctx.update.update_id}`);
    const e = err.error;

   if(e instanceof GrammyError) {
    console.error("Ошибка в запросе:", e.description);
   } else if (e instanceof HttpError) {
    console.error("Нет связи с Телеграм:", e);
   } else {
    console.error("Неизвестная ошибка", e)
   }
});

bot.start();

// https://www.youtube.com/watch?v=q-AFR0D7Vuw 52 :02