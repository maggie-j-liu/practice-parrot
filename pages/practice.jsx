import { createRef, useEffect, useRef, useState } from "react";
import Parrot from "../components/Parrot";
import { CircularProgressbar } from "react-circular-progressbar";
import { BsBarChartFill, BsCheck2 } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import formatTime from "../lib/formatTime";
import { useSession } from "next-auth/react";

const Practice = () => {
  const { data: session } = useSession();
  const [started, setStarted] = useState(false);
  const canvasRef = useRef(null);
  const [background, setBackground] = useState(null);
  const [audio, setAudio] = useState(null);
  const [mins, setMins] = useState(0);
  const startTime = useRef(null);

  useEffect(() => {
    const beforeTabClose = () => {
      end();
    };
    window.addEventListener("beforeunload", beforeTabClose);
    return () => {
      beforeTabClose();
      window.removeEventListener("beforeunload", beforeTabClose);
    };
  }, []);
  // https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
  async function getMedia(constraints) {
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      setAudio(stream);
    } catch (error) {
      console.error(error);
      toast.error("Please allow microphone access on this page.", {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return false;
    }

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext("2d");
    const lastSampled = 0;
    const draw = () => {
      requestAnimationFrame(draw);
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      analyser.getByteFrequencyData(dataArray);
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
    return true;
  }
  const start = async () => {
    if (!session?.user) {
      toast.error("You must sign in to start a session.", {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    if (await getMedia({ audio: true, video: false })) {
      startTime.current = Date.now();
      setStarted(true);
    }
  };

  const end = async () => {
    if (audio) {
      audio.getTracks().forEach((track) => track.stop());
    }
    setAudio(null);
    setBackground(null);
    setStarted(false);
    if (startTime.current !== null) {
      const elapsed = Math.round((Date.now() - startTime.current) / 1000);
      startTime.current = null;
      toast(`Logged ${formatTime(elapsed)} of practice!`, {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
      });
      await fetch("/api/addtime", {
        method: "POST",
        body: JSON.stringify({
          time: elapsed,
        }),
      });
    }
  };

  return (
    <>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover
      />
      <div
        className=" w-full pt-32 pb-16 px-8 duration-300 min-h-screen text-center"
        style={{
          backgroundColor: !started ? "white" : `hsl(${background}, 70%, 90%)`,
        }}
      >
        <div className="max-w-5xl mx-auto">
          <h1 className={"text-5xl font-bold text-gradient w-max mx-auto"}>
            Practice Room
          </h1>
          <h2 className="text-xl">
            A place to practice with your{" "}
            <i className="underline decoration-accent-300">practice parrot</i>.
          </h2>
          <div className="mt-10 flex flex-col md:flex-row justify-center gap-x-8 gap-y-16">
            <div className="flex flex-col self-center md:self-stretch items-center justify-center bg-white rounded-lg shadow-lg max-w-lg px-12 lg:px-16 py-10">
              <h2 className="mb-3 text-2xl md:w-72 font-semibold">
                Start a practice session!
              </h2>
              {started ? (
                <div className="flex items-center justify-around align-baseline gap-2">
                  <span className="text-lg">
                    Goal: {formatTime(parseFloat(mins) * 60)}{" "}
                  </span>
                  {(Date.now() - startTime.current) / 700 >
                  parseFloat(mins * 60) ? (
                    <BsCheck2 className="inline w-6 h-6 text-green-500" />
                  ) : (
                    <BsBarChartFill className="inline w-6 h-6 text-primary-400" />
                  )}
                </div>
              ) : (
                <label>
                  <p>set a timer for</p>
                  <input
                    value={mins}
                    onChange={(e) => setMins(e.target.value)}
                    type="number"
                    className="w-24 mr-2"
                  />
                  minutes
                </label>
              )}
              <div className="my-8 w-40 mx-auto">
                <CircularProgressbar
                  value={
                    startTime.current === null
                      ? 0
                      : ((Date.now() - startTime.current) /
                          1000 /
                          (parseFloat(mins) * 60)) *
                        100
                  }
                  text={(() => {
                    let elapsed =
                      startTime.current === null
                        ? 0
                        : (Date.now() - startTime.current) / 1000;
                    let display =
                      startTime.current === null
                        ? mins
                          ? parseFloat(mins) * 60
                          : 0
                        : elapsed;
                    return formatTime(display);
                  })()}
                  styles={{
                    trail: {
                      stroke: "#e2e8f0",
                    },
                    path: {
                      stroke: "#06b6d4",
                    },
                    text: {
                      fill: "#06b6d4",
                      fontSize: "14px",
                    },
                  }}
                />
              </div>
              <button
                className="duration-150 hover:bg-primary-200 bg-primary-100 px-4 py-1 rounded disabled:cursor-not-allowed"
                onClick={() => {
                  if (started) {
                    end();
                  } else {
                    start();
                  }
                }}
                disabled={!started && mins == 0}
              >
                {started ? "End Session" : "Start Session"}
              </button>
            </div>
            <div
              className="self-center w-full max-w-xl relative duration-300"
              style={{
                color: !started ? "#cbd5e1" : `hsl(${background}, 70%, 75%)`,
              }}
            >
              <Parrot />
              <canvas
                className="absolute bottom-0 left-0 right-0 w-full"
                ref={canvasRef}
                width="640"
                height="255"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Practice;
