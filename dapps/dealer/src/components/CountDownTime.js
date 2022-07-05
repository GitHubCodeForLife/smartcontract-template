import React, { useEffect, useState } from "react";

function CountDownTime({ time }) {
  const [countDownTime, setCountDownTime] = useState(time);
  useEffect(() => {
    setCountDownTime(time);
  }, [time]);
  useEffect(() => {
    const interval = setInterval(() => {
      if (countDownTime > 0) {
        setCountDownTime(countDownTime - 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [countDownTime]);
  return (
    <div
      className="mb-4 text-center"
      style={{
        opacity: countDownTime === 0 ? "0" : "1",
        fontSize: "30px",
      }}
    >
      Betting ends in {countDownTime} seconds.
    </div>
  );
}

export default CountDownTime;
