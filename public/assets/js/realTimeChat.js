const socket= io();
// const socket= io('http://localhost:8080');
const messageContainer= document.getElementById('message-container')
const messageForm= document.getElementById('send-container');
const messageInput= document.getElementById('message-input');

const userTag= prompt('What is your userTag')
appendMessage('You joined')
socket.emit('new-user', userTag)

socket.on('chat-message', data => {
    console.log(data)
    appendMessage(`${data.userTag}: ${data.message}`)
})

socket.on('user-connected', userTag => {
    appendMessage(`${userTag} connected`)
})

socket.on('user-disconnected', userTag => {
    appendMessage(`${userTag} disconnected`)
})

messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message= messageInput.value
    appendMessage(`You: ${message}`)
    socket.emit('send-chat-message', message)
    messageInput.value = ''
})

function appendMessage(message) {
    const messageElement= document.createElement('div')
    messageElement.innerText = message
    messageContainer.append(messageElement)
}