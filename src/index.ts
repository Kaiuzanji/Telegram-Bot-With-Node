import TelegramBot, { Message, Metadata } from 'node-telegram-bot-api'
import { createReadStream } from 'node:fs'
import path from 'path'
import 'dotenv/config'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN as string

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true })

bot.on('message', (message: Message, metadata: Metadata) => {
  console.log('Message received: ', message.text, 'by chat ', message.chat.id)

  const isSendPhoto = message.text === '/send_photo' 
  
  if (isSendPhoto) {
    const filePath = path.resolve(path.dirname('.'), 'perfil.jpeg')
    sendDocument(message.chat.id, filePath)
  }
})

function sendDocument(chatId: number, pathFile: string) {
  const readableStream = createReadStream(pathFile);

  const chunks: Buffer[] = []  

  readableStream.on('data', (chunk: Buffer) => {
    chunks.push(chunk)
  })

  readableStream.on('end', () => {
    const fileBuffer = Buffer.concat(chunks)
    bot.sendDocument(chatId, fileBuffer, {}, { filename: 'perfil' })
  })

  readableStream.on('error', (error) => {
    console.error(error)
  })
}

console.log('Telegram bot online...')