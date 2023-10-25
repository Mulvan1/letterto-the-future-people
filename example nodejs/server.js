const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const port = 3000; // Порт, на котором будет работать сервер

// Подключение к базе данных MongoDB
mongoose.connect("mongodb://localhost/messages_db", { useNewUrlParser: true, useUnifiedTopology: true });
const Message = mongoose.model("Message", { text: String, timestamp: Date });

// Middleware для обработки JSON-запросов
app.use(bodyParser.json());

// Статический файл, чтобы отдавать HTML
app.use(express.static("public"));

app.post("/addMessage", async (req, res) => {
    const text = req.body.text;
    const username = req.body.username;

    // Проверка, можно ли добавить сообщение (не более одного в месяц) для конкретного пользователя
    const lastMessage = await Message.findOne({ username }).sort({ timestamp: -1 });

    if (!lastMessage || (Date.now() - lastMessage.timestamp) > 30 * 24 * 60 * 60 * 1000) {
        const newMessage = new Message({ text, timestamp: new Date(), username });
        await newMessage.save();
        res.json({ success: true });
    } else {
        res.json({ success: false, message: "Ждите 1 месяц и потом сможете написать сообщение." });
    }
});

app.get("/getMessages", async (req, res) => {
    const messages = await Message.find().sort({ timestamp: -1 });
    res.json(messages);
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});

