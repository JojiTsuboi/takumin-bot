'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const PORT = process.env.PORT || 3000;

const config = {
  channelSecret: 'feeab3225cfde57499056c20c2ed55df',
  channelAccessToken: 'DoC6+AJyUzbTAETFnsb0GJjhjTf6U9W94JOZT+qHHvFBwnjQJe2BPLdCNJx8pImGGuuvIcji9/MgNJFkC7mRS1tv17ryvFxXlw+9NYylpDfT14o0B35psfZ5E7MnL+WRlr5KeMHxnjERLCdPv1tXuwdB04t89/1O/w1cDnyilFU='
};

const app = express();

app.get('/', (req, res) => res.send('Hello LINE BOT!(GET)')); //ブラウザ確認用(無くても問題ない)
app.post('/webhook', line.middleware(config), (req, res) => {
  console.log(req.body.events);

  //ここのif分はdeveloper consoleの"接続確認"用なので削除して問題ないです。
  if (req.body.events[0].replyToken === '00000000000000000000000000000000' && req.body.events[1].replyToken === 'ffffffffffffffffffffffffffffffff') {
    res.send('Hello LINE BOT!(POST)');
    console.log('疎通確認用');
    return;
  }

  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

const client = new line.Client(config);

async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  // let replyText = '';
  // if (event.message.text === 'こんにちは') {
  //   replyText = 'こんばんわの時間ですよ';
  // } else {
  //   replyText = 'うざ';
  // }



  if (event.message.text === '阿蘇') {
    await client.pushMessage(event.source.userId, {
      type: 'image',
      originalContentUrl:
        'https://cdn-ak.f.st-hatena.com/images/fotolife/b/benbeckman/20200815/20200815145318.jpg',
      previewImageUrl:
        'https://cdn-ak.f.st-hatena.com/images/fotolife/b/benbeckman/20200815/20200815145318.jpg',
    }); //画像

    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: '阿蘇万歳！！',
    }) //テキスト
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text + 'ね'
  })


}

// app.listen(PORT);
// console.log(`Server running at ${PORT}`);
(process.env.NOW_REGION) ? module.exports = app : app.listen(PORT);
console.log(`Server running at ${PORT}`);