const convertTime = (seconds) => {
  seconds = Math.round(seconds);
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds - hours * 3600) / 60);
  let secondsLeft = seconds - hours * 3600 - minutes * 60;
  return {
    hours,
    minutes,
    seconds: secondsLeft,
  };
};

const formatTime = (seconds) => {
  let time = convertTime(seconds);
  let str = "";
  if (time.hours > 0) {
    str += time.hours + "h ";
    str += time.minutes + "m ";
  } else if (time.minutes > 0) {
    str += time.minutes + "m ";
  }
  str += time.seconds + "s";
  return str;
};

export default formatTime;
