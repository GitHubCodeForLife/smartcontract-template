import React, { Component, useEffect } from "react";
import web3 from "../utils/web3";

function Balance({ account }) {
  const [balance, setBalance] = React.useState(0);

  useEffect(() => {
    const balanceInterval = setInterval(() => {
      getBalance();
    }, 1000);
    return () => clearInterval(balanceInterval);
    // subcribeAddNewBlock();
  }, []);
  async function getBalance() {
    const wei = await web3.eth.getBalance(account);
    const b = parseFloat(web3.utils.fromWei(wei));
    setBalance(b);
  }

  return (
    <div id="content" className="mt-3">
      {account}
      <br />
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Balance;
