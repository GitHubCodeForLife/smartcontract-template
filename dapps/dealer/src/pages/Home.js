import React from "react";
import { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import { BsFillHouseFill, BsDoorOpenFill } from "react-icons/bs";
const Home = ({ setAccount }) => {
  const [showModal, setShowModal] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();
  const handleConnect = async () => {
    await loadWeb3();
    await loadAccountFromMetaMask();
    setIsConnected(true);
  };

  useEffect(() => {
    if (window.ethereum || window.web3) {
      setIsSettingUp(false);
    } else {
      setShowModal(true);
    }
  }, []);

  async function loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
  }

  async function loadAccountFromMetaMask() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
  }

  const renderButtons = () => {
    if (isConnected)
      return (
        <>
          <Button
            className="custom-btn d-flex justify-content-center align-items-center"
            onClick={() => {
              navigate("/host");
            }}
          >
            <BsFillHouseFill className="mr-2" size={20} />
            Host a game
          </Button>
          <span
            className="text-white text-bold"
            style={{
              fontSize: "30px",
            }}
          >
            OR
          </span>
          <Button
            className="custom-btn d-flex justify-content-center align-items-center"
            onClick={() => {
              navigate("/player");
            }}
          >
            <BsDoorOpenFill className="mr-2" size={20} />
            Join a game
          </Button>
          <button autoFocus style={{ opacity: "0" }}></button>
        </>
      );
    return (
      <Button className="custom-btn" onClick={handleConnect}>
        Connect wallet
      </Button>
    );
  };

  return (
    <div className="h-100vh">
      <h1 className="text-center text-white">GAME TITLE</h1>
      <div
        className="mt-5 d-flex justify-content-around align-items-center flex-column flex-sm-row"
        style={{
          width: "600px",
        }}
      >
        {isSettingUp ? (
          <div>
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <span>Loading</span>
          </div>
        ) : (
          <>
            {isConnected && (
              <>
                <Button
                  className="custom-btn d-flex justify-content-center align-items-center"
                  onClick={() => {
                    navigate("/host");
                  }}
                >
                  <BsFillHouseFill className="mr-2" size={20} />
                  Host a game
                </Button>
                <span
                  className="text-white text-bold"
                  style={{
                    fontSize: "30px",
                  }}
                >
                  OR
                </span>
                <Button
                  className="custom-btn d-flex justify-content-center align-items-center"
                  onClick={() => {
                    navigate("/player");
                  }}
                >
                  <BsDoorOpenFill className="mr-2" size={20} />
                  Join a game
                </Button>
              </>
            )}
            {!isConnected && (
              <Button className="custom-btn" onClick={handleConnect}>
                Connect wallet
              </Button>
            )}
          </>
        )}
      </div>
      <Modal show={showModal} backdrop="static" keyboard={false}>
        <Modal.Header>
          <Modal.Title>Non-Ethereum browser detected</Modal.Title>
        </Modal.Header>
        <Modal.Body>You should consider trying MetaMask!</Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div>
  );
};

export default Home;
