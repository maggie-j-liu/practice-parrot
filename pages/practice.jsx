import { useRef, useState } from "react";

const Practice = () => {
  const [started, setStarted] = useState(false);
  const canvasRef = useRef(null);
  const [background, setBackground] = useState(null);
  const [audio, setAudio] = useState(null);
  // https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
  async function getMedia(constraints) {
    let stream = await navigator.mediaDevices.getUserMedia(constraints);
    setAudio(stream);
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext("2d");
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    const lastSampled = Date.now();
    const draw = () => {
      const drawVisual = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      canvasCtx.fillStyle = "hsl(0, 0%, 0%)";
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / dataArray.length) * 2.5;
      let barHeight;
      let x = 0;
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
        barHeight = dataArray[i];
        canvasCtx.fillStyle = `hsl(${(dataArray[i] * 360) / 255}, 70%, 75%)`;
        canvasCtx.strokeStyle = "transparent";
        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
      if (Date.now() - lastSampled > 1000) {
        lastSampled = Date.now();
        setBackground(sum / dataArray.length);
      }
    };
    draw();
  }
  const start = () => {
    getMedia({ audio: true, video: false });
  };
  const end = () => {
    if (audio) {
      audio.getTracks().forEach((track) => track.stop());
      setAudio(null);
    }
  };
  return (
    <div
      className="pt-32 pb-16 px-8 duration-300 min-h-screen"
      style={{
        backgroundColor:
          background === null ? "white" : `hsl(${background}, 70%, 75%)`,
      }}
    >
      <h1 className="text-gradient text-4xl font-bold">Practice Room</h1>
      <p>{started ? "Started" : "Not Started"}</p>
      <button
        className="bg-primary-100 px-4 py-1 rounded"
        onClick={() => {
          if (started) {
            end();
          } else {
            start();
          }
          setStarted(!started);
        }}
      >
        {started ? "End" : "Start"}
      </button>
      <canvas ref={canvasRef} width="640" height="255" />
    </div>
  );
};
export default Practice;
