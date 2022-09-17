//import Link from "next/link";
import { BrowserRouter, Route, Link,useLocation } from "react-router-dom";
//import { useRouter } from "next/router";
import React, { useEffect, useState, useCallback,useContext } from "react";
import {
    MdMenu,
    MdClose
}
from "react-icons/md";
import {
  FaTwitter,
  FaDiscord,
  FaMedium,
  FaGithub,
} 
from "react-icons/fa";
import { gsap } from "gsap/dist/gsap";
import { Power4 } from "gsap/dist/gsap";
import $ from "jquery";
import { useThemeSwitcher } from "react-css-theme-switcher";
 import { Faucet } from "./";
 
import st from "../views/styles/footer.module.css";

const Footer = (props) => {
  
    return (
      <footer>
        <div className="footer">
        <div className="box">
          <div className="footerContent">
            <div className={st.footerLeft}>
              <a href="" target="_blank" style={{fontWeight:'',fontSize:'14px'}}><h4 className="footerText">Starter Template</h4></a> 
              
              {
              /*  if the local provider has a signer, let's show the faucet:  */
              props.faucetAvailable ? (
                <Faucet targetNetwork={props.targetNetwork} readContracts={props.readContracts} writeContracts={props.writeContracts} address={props.address} localProvider={props.localProvider} price={props.price} ensProvider={props.mainnetProvider} />
              ) : (
                ""
              )
            }
            </div>
            <div className={`${st.footerRight} footerLink`}>
              
            </div>
          </div>
        </div>
      </div></footer>)

}

export default Footer;