const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const hostKey=11122008;
const originstudents=require("./students.json");
const students=[[],[],[],[],[]]
const stories=require("./stories.json");
let host;
let answeringPlayer;
const io = socketIo(server,{
    cors: {
        origin: "*", // Cho phép tất cả các origin
        methods: ["GET", "POST"]
    }
});

const questions = [
    { question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], answer: 3 },
    { question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], answer: 2 },
    { question: "What is the largest ocean on Earth?", options: ["Atlantic", "Pacific", "Indian", "Arctic"], answer: 2 }
];

let players = [];
let rdPlayers=[];
let currentQuestionIndex = 0;
let answersReceived = 0;
function getRandomIndexes(max, count) {
    const indexes = new Set();
    while (indexes.size < count) {
        const randomIndex = Math.floor(Math.random() * max);
        indexes.add(randomIndex);
    }
    return Array.from(indexes);
}
// Kết nối client
io.on('connection', (socket) => {
    //console.log(`Player connected: ${socket.id}`);
    players.push(socket);

    // Gửi câu hỏi hiện tại cho người chơi mới
    
    socket.on('name', (name) => {
        if(!originstudents.flat().includes(name)||socket.name||students.flat().includes(name))return
            socket.name=name;
            students[originstudents.findIndex(innerArray => innerArray.includes(name))].push(name)
            const arr=getRandomIndexes(stories.length, 5);
            socket.stories=arr;
            socket.emit('stories',arr)
    });
    socket.on('selectStory', (i) => {
        if(!socket.stories||!socket.stories.includes(i)||socket.selectedStory)return;
socket.selectedStory=stories[i];
    });
    socket.on('start_quiz', (key) => {
        if(hostKey!=key)return;
        host = socket;
        players=players.filter(player => player !== socket);
        console.log(`Host assigned: ${host}`);
         
        socket.emit('host_assigned', `You are the host. Your code is: ${socket.id}`);
        
            currentQuestionIndex = 0;
 answersReceived = 0;
 rdPlayers=JSON.parse(JSON.stringify(students));
 const group=currentQuestionIndex%5;
            const randomIndex = Math.floor(Math.random() * rdPlayers[group].length);
            answeringPlayer=players.find(player => player.name === rdPlayers[group][randomIndex]);
            console.log(students.slice());
            console.log(`Question sent to  player ${rdPlayers[group][randomIndex]}  ${randomIndex} ${group}`);
            rdPlayers[group].splice(randomIndex,1)
            //answeringPlayer = rdPlayers[group][randomIndex];
            io.emit('quizStart', { message: "Quiz started!" });
            if(answeringPlayer)answeringPlayer.emit('question', questions[currentQuestionIndex]);
            
        
    });
    // Lắng nghe khi người chơi gửi câu trả lời
    socket.on('submitAnswer', (data) => {
        
        console.log(`Player ${socket.id} answered: ${data.answer}`);
        
        // Đánh dấu người chơi đã trả lời
        
        if (socket!=answeringPlayer) return;
            //console.log("1");
        

        // Khi tất cả người chơi đã trả lời
        
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                // Reset trạng thái cho câu hỏi mới
                answersReceived = 0;
                //players.forEach(p => p.answered = false);

                // Gửi câu hỏi mới cho tất cả người chơi
                const group=currentQuestionIndex%5;
                const randomIndex = Math.floor(Math.random() * rdPlayers[group].length);
            
                if(!rdPlayers[group][randomIndex])rdPlayers[group][randomIndex]=students[group][randomIndex]
                answeringPlayer=players.find(player => player.name === rdPlayers[group][randomIndex]);
            rdPlayers[group].splice(randomIndex,1);
                console.log(`Question sent to  player ${randomIndex}`);
        if(answeringPlayer)answeringPlayer.emit('question', questions[currentQuestionIndex]);
            } else {
                // Kết thúc quiz
                io.emit('quizEnd', { message: "Quiz completed!" });
            }
        
    });

    // Khi người chơi ngắt kết nối
    socket.on('disconnect', () => {
        //console.log(`Player disconnected: ${socket.id}`);
        players = players.filter(p => p.id !== socket.id);
        if(!socket.name)return;
        const index=students.findIndex(innerArray => innerArray.includes(socket.name))
        students[index].splice(students[index].indexOf(socket.name),1)
        
    });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
