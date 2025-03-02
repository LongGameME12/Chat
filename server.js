const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

console.log("WebSocket сервер запущен на порту 8080");

let chatHistory = []; // История сообщений

server.on("connection", (socket) => {
    console.log("Пользователь подключился");

    // Отправляем всю историю сообщений новому клиенту
    if (chatHistory.length > 0) {
        chatHistory.forEach((message) => {
            socket.send(message); // Отправляем каждое сообщение
        });
    }

    socket.on("message", (message) => {
        const text = message.toString(); // Преобразуем Buffer в строку
        console.log(`Получено: ${text}`);

        // Добавляем сообщение в историю чата
        chatHistory.push(text);

        // Отправляем сообщение ВСЕМ подключенным пользователям
        server.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(text); // Отправляем только сообщение
            }
        });
    });

    socket.on("close", () => {
        console.log("Пользователь отключился");
    });
});
