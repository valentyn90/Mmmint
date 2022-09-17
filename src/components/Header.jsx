//import Link from "next/link";
import { BrowserRouter, Route, NavLink,Link,useLocation } from "react-router-dom";
//import { useRouter } from "next/router";
import React, { useEffect, useState, useCallback,useContext } from "react";
import {
    MdMenu,
    MdClose
}
from "react-icons/md";
import { gsap } from "gsap/dist/gsap";
import { Power4 } from "gsap/dist/gsap";
import $ from "jquery";
import { useThemeSwitcher } from "react-css-theme-switcher";

import WalletConnectProvider from "@walletconnect/web3-provider";

import Web3Modal from "web3modal";
const { ethers } = require("ethers");
import WalletLink from "walletlink";

import logo_wt from "../assets/logos/logo.svg";
import logo from "../assets/logos/logo.svg";

import Account from "./Account";

const Header = (props) => {
  
    const { currentTheme } = useThemeSwitcher();

    const {web3Modal,loadWeb3Modal,address,localProvider,userSigner,mainnetProvider,price,logoutOfWeb3Modal,blockExplorer} = props;

    const router = useLocation();
    
    const [injectedProvider, setInjectedProvider] = useState();
    
    let subdomain = window.location.hostname.split('.')[0];
    if (subdomain == 'app' || subdomain == 'dev') {
      subdomain = 'avax';
    }
    const [lang, setLang] = useState(subdomain);

    /* Mobile Header */
    const openMobHeader = () => {
        $(".header").addClass("active-mob-header");
    };
    const closeMobHeader = () => {
        $(".header").removeClass("active-mob-header");
    };
    /* PC Anchors */
    const moveTo1 = () => {
        gsap.to(window, {
            scrollTo: {
                y: "#app",
            },
            ease: Power4.easeInOut,
            duration: 0.75,
        });
    };
    
    const handleLangChange = (selectedLang) => {
      let openDomain = selectedLang;
      if (openDomain == 'avax') {
        openDomain = 'app';
      }
      if (subdomain != openDomain && window.location.hostname.split('.')[0] != openDomain) {
        window.open(`https://${selectedLang}`,'_self');
      }
    }
    
    const languageFlag = {
      "avax": "/assets/icons/avax.svg",
      // "optimism": "/assets/icons/optimism.svg",
    }
    const languages = Object.keys(languageFlag);
    
    const additionalOptions = [];
    for (let i=0;i<languages.length;i++) {
      if (languages[i] != lang) {
        additionalOptions.push(languages[i]);
      }
    }

    return (
        <div className="header">
        <div className="mob-header">
          <div className="box">
            <div className="mob-header-content">
                  <Link to="/">
                    <a className={router.pathname == "/" ? "activeLink" : ""}>
                      TEMPLATE
                    </a>
                  </Link>
                  
              </div>

              <div style={{width:'100%',textAlign:'center'}}>
           
              </div>
              
                  
          </div>
        </div>
        <div className="box">
      
          <div className="headerContent">

                <Link to="/">
                  <img onClick={moveTo1}  style={{height:'40px'}} src={currentTheme == 'dark' ? logo_wt : logo} alt="logo" />
                </Link>
        
                <div className={"headerRight"}>
                  <Link to="/" passHref={true} className={router.pathname == "/" ? "link activeLink" : "link"}>
                      TEMPLATE
                  </Link>
                
                 </div>
                  
              <div className="headerRightButton">
                  
                 <div className={'headerRightButtonInner'}>
                  
                    </div>
                  
                  <span style={{top:'5px'}}>
                    <MdMenu onClick={openMobHeader} style={{fontSize:'36px'}} className="open-mob-header" />
                    <MdClose onClick={closeMobHeader} style={{fontSize:'36px'}} className="close-mob-header" />
                  </span>
                  
              </div>
      
          </div>
      
        </div>
      </div>)

}

export default Header;