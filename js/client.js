const socket = io('http://localhost:8000');

//Get DOM elements in respective Js variables
const form = document.getElementById('send-container');
const messageinput = document.getElementById('messageinp');
const messagecont = document.querySelector(".container");

//Audio that will play on recieving messages
var audio = new Audio('audio/notificationsound.mp3');

//Function which will append event info to the container
const append = (message, position)=>{
    const messagele = document.createElement('div');
    messagele.innerText = message;
    messagele.classList.add('message');
    messagele.classList.add(position);
    messagecont.append(messagele);
    if(position == 'left'){
       audio.play();
    }

}

//If the form gets submitted, send server the message
form.addEventListener('submit',(e)=> {
    e.preventDefault();
    const message = messageinput.value;
    append(`You: ${message}`,'right');
    socket.emit('send',message);
    messageinput.value = '';

})

//Ask new user for his/her name
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

//If a new user joins, receive his/her event from the server
socket.on('user-joined', name=>{
 append(`${name} joined the chat`, 'right');
})

// If server sends a message, receive it
socket.on('recieve', data=>{
    append(`${data.name} : ${data.message}`, 'left');
})

//If a user leaves the chat, append the info to the containe
socket.on('left', name=>{
    append(`${name} left the chat`,'right');
})