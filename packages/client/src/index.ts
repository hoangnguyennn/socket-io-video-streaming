import { io } from 'socket.io-client';
import Peer, { MediaConnection } from 'peerjs';

import './style.css';

const socket = io('http://localhost:3000/');
const peer = new Peer();

const videoWrap = document.querySelector('#video-wrap');

type State = {
  id: string;
  peers: {
    [id: string]: MediaConnection;
  };
};

const state: State = {
  id: '',
  peers: {},
};

const connectCamera = async () => {
  return navigator.mediaDevices.getUserMedia({ video: true });
};

const addVideo = (video: HTMLVideoElement, stream: MediaStream) => {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', video.play);
  videoWrap.appendChild(video);
};

const connectToUser = (id: string, stream: MediaStream) => {
  const call = peer.call(id, stream);

  const video = document.createElement('video');
  call.on('stream', addVideo.bind(null, video));
  call.on('close', () => video.remove());

  state.peers[call.peer] = call;
};

const start = async () => {
  try {
    const stream = await connectCamera();
    const myVideo = document.createElement('video');
    myVideo.muted = true;
    addVideo(myVideo, stream);

    socket.emit('open-camera');
    socket.on('open-camera', (id: string) => {
      connectToUser(id, stream);
    });

    peer.on('call', (call: MediaConnection) => {
      call.answer(stream);

      const video = document.createElement('video');
      call.on('stream', addVideo.bind(null, video));
      call.on('close', () => video.remove());

      state.peers[call.peer] = call;
    });

    socket.on('user-disconnect', (id) => {
      if (state.peers[id]) {
        state.peers[id].close();
        delete state.peers[id];
      }
    });
  } catch (err) {
    console.log(err);
  }
};

peer.on('open', (id: string) => {
  state.id = id;
  socket.emit('join', id, window.location.pathname);

  start();
});
