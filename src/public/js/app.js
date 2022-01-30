const socket = io();

const myFace = document.getElementById('myFace');
const muteBtn = document.getElementById('mute');
const cameraBtn = document.getElementById('camera');
const camerasSelect = document.getElementById('cameras');

const call = document.getElementById('call');

call.hidden = true;

let myStream;
let muted = false;
let cameraOff = false;
let roomName;

async function getCaemeras() {
try {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const cameras = devices.filter((device) => device.kind === 'videoinput');
  const currentCamera = myStream.getVideoTracks()[0];
  cameras.forEach(camera => {
    const option = document.createElement('option');
    option.value = camera.deviceId;
    option.innerText = camera.label;
    if (currentCamera.label === camera.label) {
      PushSubscriptionOptions.selected = true;
    }
    camerasSelect.appendChild(option);
  })
} catch (e) {
  console.log(E)
}

}
async function getMedia(deviceId) {
  const initialConstraints = {
    audio: true,
    video: {
      facingMode: "user",
    }
  }
  const cameraConstraints = {
    audio: true,
    video: { deviceId: {
      exact: deviceId,
    }}
  }
  try {
    myStream = await navigator.mediaDevices.getUserMedia(deviceId ? cameraConstraints : initialConstraints);
    myFace.srcObject = myStream;
    if (!deviceId) {
      await getCaemeras();
    }
  } catch (e) {
    console.log(e);
  }
}

function handleMuteClick()  {
  myStream.getAudioTracks()
  .forEach(track => (track.enabled = !track.enabled));
  if (!muted) {
    muteBtn.innerText = 'Unmute';
    muted = true;
  } else {
    muteBtn.innerText = 'Mute';
    muted = false;
  }
}
function handleCameraClick()  {
  myStream.getVideoTracks()
  .forEach(track => track.enabled = !track.enabled);
  if (cameraOff) {
    cameraBtn.innerText = 'Turn Camera off';
    cameraOff = false;
  } else {
    cameraBtn.innerText = 'Turn Camera On';
    cameraOff = true
  }
}

async function handleCameraChange() {
  await getMedia(camerasSelect.value);
}

muteBtn.addEventListener('click', handleMuteClick);
cameraBtn.addEventListener('click', handleCameraClick);
camerasSelect.addEventListener('input', handleCameraChange);

const welcome = document.getElementById('welcome');
const welcomeForm = welcome.querySelector('form');

function startMedia() {
  welcome.hidden = true;
  call.hidden = false;
  getMedia();
}

function  handleWelcomeSubmit(event)  {
  event.preventDefault();
  const input = welcomeForm.querySelector('input');
  socket.emit('join_room', input.value, startMedia);
  roomName = input.value;
  input.value = '';
}

welcomeForm.addEventListener('submit', handleWelcomeSubmit);

// socket code
socket.on('welcome', ()=>{
  console.log('someone joined');
})