document.addEventListener('DOMContentLoaded', () => {
  const startCameraButton = document.getElementById('start-camera');
  const takePhotoButton = document.getElementById('take-photo');
  const uploadPhotoInput = document.getElementById('upload-photo');
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const photo = document.getElementById('photo');
  let stream;

  startCameraButton.addEventListener('click', async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      video.style.display = 'block';
      takePhotoButton.disabled = false;
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  });

  takePhotoButton.addEventListener('click', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/png');
    photo.src = dataUrl;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    video.style.display = 'none';
  });

  uploadPhotoInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      photo.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
});
