import React from "react";
const PlayerCounter = ({ tPlayer, xPlayer, result, doneRolling }) => {
  return (
    <div className="d-flex justify-content-center mt-5">
      <div
        className={
          result === "Tai" && doneRolling ? "frame won mr-2" : "frame mr-2"
        }
      >
        <span className="frame-counter">{tPlayer} Choose</span>

        <span className="mb-auto mt-auto frame-label">TAI</span>
      </div>
      <div className={result === "Xiu" && doneRolling ? "frame won" : "frame"}>
        <span className="frame-counter">{xPlayer} Choose</span>

        <span className="mb-auto mt-auto frame-label">XIU</span>
      </div>
    </div>
  );
};

export default PlayerCounter;
