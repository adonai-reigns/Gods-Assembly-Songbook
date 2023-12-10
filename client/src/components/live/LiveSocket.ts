import { io } from 'socket.io-client';

const url = new URL(window.location.href);
const socketUrl = url.protocol + '//' + url.hostname + ':3000/live';

const LiveSocket = io(socketUrl);

export default LiveSocket;
