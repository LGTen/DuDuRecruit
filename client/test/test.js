import io from 'socket.io-client';
const socket=io('ws://localhost:3000');
socket.on('receiveMsg',function(data){
    console.log("浏览器收到数据",data);
})
socket.emit('sendMsg',{name:'Tom',date:Date.now()});