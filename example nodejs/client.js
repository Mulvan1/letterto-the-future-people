async function addMessage() {
    const input = document.getElementById("input");
    const text = input.value;

    const username = localStorage.getItem("username");

    const response = await fetch("/addMessage", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ text, username })
    });

    const result = await response.json();
    if (result.success) {
        // Обновление сообщений на странице после успешного добавления
        getMessages();
    } else {
        alert(result.message);
    }
}

async function getMessages() {
    const response = await fetch("/getMessages");
    const messages = await response.json();

    const messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML = "";

    messages.forEach((message) => {
        const newMessage = document.createElement("p");
        newMessage.textContent = message.text;
        messagesDiv.appendChild(newMessage);
    });
}

// Загрузить сообщения при загрузке страницы
getMessages();
