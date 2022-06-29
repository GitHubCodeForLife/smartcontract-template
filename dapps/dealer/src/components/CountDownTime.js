import React, { useEffect, useState } from "react";

function CountDownTime({ time }) {
  const [countDownTime, setCountDownTime] = useState(time);
  useEffect(() => {
    const interval = setInterval(() => {
      if (countDownTime > 0) {
        setCountDownTime(countDownTime - 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [countDownTime]);
  return <div>{countDownTime}</div>;
}

export default CountDownTime;
