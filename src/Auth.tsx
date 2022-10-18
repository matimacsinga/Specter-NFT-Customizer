import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Auth.css'
declare var window: any

let userAddress: String = ''

var quantumLogo = require('./Recurso_3.png')

function Auth(){

    let navigate = useNavigate()

    //handles a metamask extension error

    window.onload = function() {
        var reloading = sessionStorage.getItem("reloading");
        if (reloading) {
            sessionStorage.removeItem("reloading");
            connectWalletHandler();
        }
    }
    
    function reloadP() {
        sessionStorage.setItem("reloading", "true");
        document.location.reload();
    }

    //starts user metamask login via extension

    const connectWalletHandler = () => {


        if(window.ethereum) {

            window.ethereum.request({method: 'eth_requestAccounts'})
                .then(result => {

                    userAddress = result[0]
                    navigate('/selector')
                    
                })    
        } 
    }

    return (
        <div id="full_div">
            <div id="div_auth">
                <img id="logo" src={quantumLogo} alt='logo'></img>
                <p id="welcome_text_1">Welcome to the Quantum Pass PFP Customizer!</p>
                <p id="welcome_text_2">Connect your MetaMask wallet to proceed</p>
                <button id="button_auth" onClick={reloadP}>Connect Wallet</button>
            </div>
        </div>
    )    
}

export default Auth;
export {userAddress};