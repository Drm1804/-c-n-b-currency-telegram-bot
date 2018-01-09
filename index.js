const TelegramBot = require('node-telegram-bot-api');
const http = require('./http');
const settings = require('./settings');
const token = settings.token;

const bot = new TelegramBot(token, {
    polling: true
});

function sendStart(msg){
    bot.sendMessage(msg.chat.id, "Нажми /start чтобы узнать текущие курсы валют", {
        "reply_markup": {
            "keyboard": [
                ['/start'],
            ]
        }
    });
}

function start(start){
    bot.onText(/\/start/, (msg) => {
        const cur1 = 'EUR';
        const cur2 = 'USD';
        const cur3 = 'KZT';
        const cur4 = 'BYR';

        bot.sendMessage(msg.chat.id, "Текущие курсы валют", {
            "reply_markup": {
                "keyboard": [
                    [cur1],
                    [cur2],
                    [cur3],
                    [cur4],
                ]
            }
        });

        bot.once('message', (msg) => {
            http.get().then((resp) => {
                if(!resp.valcurs && !resp.valcurs.valute){
                    bot.sendMessage(msg.chat.id, "произошла ошибка попробуйте позже");
                    sendStart(msg);
                }

                let wasFind = false;
                resp.valcurs.valute.forEach((cur) => {
                    if(cur.charcode == msg.text){
                        bot.sendMessage(msg.chat.id, `${cur.nominal} ${cur.charcode} равен ${cur.value} RUB`);
                        sendStart(msg);
                        wasFind = true;
                    }
                });
                
                if(!wasFind){
                    bot.sendMessage(msg.chat.id, "Я тебя не понял, нажми /start и давай попробуем сначала");
                }
            });

        });
    });
}

start(start);

