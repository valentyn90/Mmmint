import WalletConnectProvider from "@walletconnect/web3-provider";
//import Torus from "@toruslabs/torus-embed"
import WalletLink from "walletlink";
import { Alert, Button, Col, Menu, Row } from "antd";
import "antd/dist/antd.css";
import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link  } from "react-router-dom";
import Web3Modal from "web3modal";
import "./App.css";
import { Account, Contract, GasGauge, Header, ThemeSwitch } from "./components";
import { GOOGLEANALYTICS_ID, NETWORK, NETWORKS } from "./constants";
import { Transactor } from "./helpers";
import {
  useBalance,
  useContractLoader,
  useContractReader,
  useEventListener,
  useGasPrice,
  useOnBlock,
  useUserSigner,
} from "./hooks";
// import Hints from "./Hints";
import ReactGA from "react-ga4";
import { PageTemplate } from "./views";

const { ethers } = require("ethers");

if (GOOGLEANALYTICS_ID != undefined && GOOGLEANALYTICS_ID != '') {
  ReactGA.initialize(GOOGLEANALYTICS_ID);
  ReactGA.send(window.location.pathname + window.location.search);
}

const targetNetwork = NETWORKS[ process.env.REACT_APP_NETWORK || 'localhost' ];
console.log('DEPLOYED NETWORK:',process.env.REACT_APP_NETWORK);

document.title = `React (${targetNetwork.name.replace('host','').charAt(0).toUpperCase() + targetNetwork.name.replace('host','').substr(1).toLowerCase()})`;

if (process.env.NODE_ENV === 'production') {
  console.log = () => {}
  console.warn = () => {}
  console.error = () => {}
  console.debug = () => {}
}

// 😬 Sorry for all the console logging
const DEBUG = true;
const NETWORKCHECK = true;
const USE_BURNER_WALLET = false;

// const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
//
// attempt to connect to our own scaffold eth rpc and if that fails fall back to infura...
// Using StaticJsonRpcProvider as the chainId won't change see https://github.com/ethers-io/ethers.js/issues/901
//const scaffoldEthProvider = navigator.onLine ? new ethers.providers.StaticJsonRpcProvider("https://rpc.scaffoldeth.io:48544") : null;

const mainnetInfura = navigator.onLine ? new ethers.providers.StaticJsonRpcProvider(targetNetwork.rpcUrl) : null;

// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = targetNetwork.rpcUrl;
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
if (DEBUG) console.log("🏠 Connecting to provider:", localProviderUrlFromEnv);
const localProvider = new ethers.providers.StaticJsonRpcProvider(localProviderUrlFromEnv);

// 🔭 block explorer URL
const blockExplorer = targetNetwork.blockExplorer;

// Coinbase walletLink init
const walletLink = new WalletLink({
  appName: 'coinbase',
});

// WalletLink provider
const walletLinkProvider = walletLink.makeWeb3Provider(
    localProviderUrl,
    43114,
);

/*
  Web3 modal helps us "connect" external wallets:
*/
const web3Modal = new Web3Modal({
  // network: 'avalanche', // Optional. If using WalletConnect on xDai, change network to "xdai" and add RPC info below for xDai chain.
  cacheProvider: true, // optional
  theme:"light", // optional. Change to "dark" for a dark theme.
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        bridge: "https://bridge.walletconnect.org",
        // infuraId: INFURA_ID,
        rpc: {
          1:process.env.REACT_APP_RPC_URL, // mainnet // For more WalletConnect providers: https://docs.walletconnect.org/quick-start/dapps/web3-provider#required
          42: process.env.REACT_APP_RPC_URL,
          43114:process.env.REACT_APP_RPC_URL,
          100:process.env.REACT_APP_RPC_URL,
        },
      },
    },
    // torus: {
    //   package: Torus,
    // },
    'custom-walletlink': {
      display: {
        logo: 'data:image/png;base64,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',
        name: 'Coinbase Wallet',
        //description: 'Coinbase Wallet',
      },
      package: walletLinkProvider,
      connector: async (provider, options) => {
        await provider.enable();
        return provider;
      },
    },
  },
});



function App(props) {
  
  const mainnetProvider = mainnetInfura // scaffoldEthProvider && scaffoldEthProvider._network ? scaffoldEthProvider : mainnetInfura;

  const [injectedProvider, setInjectedProvider] = useState();
  const [address, setAddress] = useState("0x0000000000000000000000000000000000000000");
  const [loaded, setLoaded] = useState(false);

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    if(injectedProvider && injectedProvider.provider && typeof injectedProvider.provider.disconnect == "function"){
      await injectedProvider.provider.disconnect();
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork, "fast");
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userSigner = useUserSigner(injectedProvider, localProvider, USE_BURNER_WALLET);

  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        setAddress(newAddress);
      }
    }
    getAddress();
    
  }, [userSigner]);

  // You can warn the user if you would like them to be on a specific network
  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;
  const selectedChainId =
    userSigner && userSigner.provider && userSigner.provider._network && userSigner.provider._network.chainId;

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userSigner, gasPrice);

  // Faucet Tx can be used to send funds from the faucet
  // const faucetTx = Transactor(localProvider, gasPrice);

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider, { chainId: localChainId });
  const writeContracts = useContractLoader(userSigner, { chainId: localChainId });
  
 // if (targetNetwork.name.indexOf("local") !== -1) {
   // const mainnetContracts = useContractLoader(mainnetProvider, { chainId: localChainId });
//  }
  
  //
  // 🧫 DEBUG 👨🏻‍🔬
  //
  
  useEffect(() => {
    if (
      DEBUG &&
      mainnetProvider &&
      address &&
      selectedChainId &&
      readContracts &&
      writeContracts
    ) {
      console.log("_____________________________________ DAPP _____________________________________");
      //console.log("🌎 mainnetProvider", mainnetProvider);
      console.log("🏠 localChainId", localChainId);
      console.log("👩‍💼 selected address:", address);
      console.log("🕵🏻‍♂️ selectedChainId:", selectedChainId);
      //console.log("💵 yourLocalBalance", yourLocalBalance ? ethers.utils.formatEther(yourLocalBalance) : "...");
      //console.log("💵 yourMainnetBalance", yourMainnetBalance ? ethers.utils.formatEther(yourMainnetBalance) : "...");
      console.log("📝 contracts", readContracts);
      //console.log("🌍 DAI contract on mainnet:", mainnetContracts);
      //console.log("💵 yourMainnetDAIBalance", myMainnetDAIBalance);
      //console.log("🔐 writeContracts", writeContracts);
      
      // setTimeout(()=>{
         setLoaded(true);
      // },5000)

    }
  }, [
    mainnetProvider,
    address,
    selectedChainId,
    readContracts,
    writeContracts,
  ]);

  let networkDisplay = "";
  
  // console.log('NETWORKCHECK',NETWORKCHECK,localChainId,selectedChainId)
  
  if (NETWORKCHECK && localChainId && selectedChainId && localChainId != selectedChainId) {
    
    const networkSelected = NETWORK(selectedChainId);
    const networkLocal = NETWORK(localChainId);
    
    if (selectedChainId === 1337 && localChainId === 31337) {
      networkDisplay = (
        <div style={{ zIndex: 200000, position: "absolute", right: 0, top: 0, padding: 16 }}>
          <Alert
            message="⚠️ Wrong Network ID"
            description={
              <div>
                You have <b>chain id 1337</b> for localhost and you need to change it to <b>31337</b> to work with
                HardHat.
                <div>(MetaMask -&gt; Settings -&gt; Networks -&gt; Chain ID -&gt; 31337)</div>
              </div>
            }
            type="error"
            closable={false}
          />
        </div>
      );
    } else {
      
      console.log('WRONG NETWORK')
      
      networkDisplay = (
        <div className="wrongNetwork">
          <Alert
          onClick={async () => {
                  
                    try {
                      
                      const data = [
                        {
                          chainId: '0x'+targetNetwork.chainId.toString(16),
                          chainName: targetNetwork.name,
                          nativeCurrency: targetNetwork.nativeCurrency,
                          rpcUrls: [targetNetwork.rpcUrl],
                          blockExplorerUrls: [targetNetwork.blockExplorer],
                        },
                      ];
                      
                      console.log(data)

                      try {
                        await window.ethereum.request({ 
                          method: 'wallet_addEthereumChain', params: data
                        })
                      }catch(e){}
                      
                      try {
                        await window.ethereum.request({
                          method: 'wallet_switchEthereumChain',
                          params: [{ chainId: '0x'+targetNetwork.chainId.toString(16) }]
                        });
                      }catch(e){}

                    }catch(e){}
                    
                  }}
            //message="⚠️ Wrong Network"
            style={{backgroundColor:'#F35454', border:'0px',color:'white',textAlign:'center'}}
            description={
              <div style={{color:'white',fontSize:'18px'}}>
                <b style={{color:'white',fontSize:'20px'}}>{networkSelected && networkSelected.name.toUpperCase()}</b> network is not currently supported. Please click here to switch to the <b style={{color:'white',fontSize:'20px'}}>{networkLocal && networkLocal.name.toUpperCase()}</b> network.
              </div>
            }
            type="error"
            closable={false}
          />
        </div>
      );
    }
  } else {
    networkDisplay = (
      <div style={{ zIndex: 2000000, position: "fixed", right: 83, bottom: 3, padding: 16, fontStyle:'italic',color: targetNetwork.color }}>
        {targetNetwork.name} {process.env.REACT_APP_VERSION_TAG}
      </div>
    );
  }


   
  const updateValue = async(contracts, contractName, functionName, args) => {
    let newValue;
    if (args && args.length > 0) {
      newValue = await contracts[contractName][functionName](...args);
    }
    else {
      newValue = await contracts[contractName][functionName]();
    }
    return newValue;
  };
  
  const setValue = async(contractName, functionName, args, variable, callback) => {
    // useOnBlock(readContracts && readContracts[contractName] && readContracts[contractName].provider, () => {
    if (contractName == 'ETH') {
      
      const d = await localProvider.getBalance(address);
      if (d !== variable) {
        callback(d);
      }
      
    } else {

    if (readContracts && readContracts[contractName]) {
      updateValue(readContracts, contractName, functionName, args).then((d) => {

        if (d != variable) {
        
          callback(d);

        }
      })
    }
    }
    // });
  }

  const loadWeb3Modal = useCallback(async (force) => {
    
      const provider = await web3Modal.connect();
      
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
      
      provider.on("chainChanged", chainId => {
        console.log(`chain changed to ${chainId}! updating providers`);
        setInjectedProvider(new ethers.providers.Web3Provider(provider));
      });
  
      provider.on("accountsChanged", () => {
        console.log(`account changed!`);
        setInjectedProvider(new ethers.providers.Web3Provider(provider));
      });
  
      // Subscribe to session disconnection
      provider.on("disconnect", (code, reason) => {
        console.log(code, reason);
        logoutOfWeb3Modal();
      });

  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal(true);
    }
  }, [loadWeb3Modal]);

  const [route, setRoute] = useState();
  useEffect(() => {
    setRoute(window.location.pathname);
  }, [setRoute]);

  let faucetHint = "";
  const faucetAvailable = localProvider && localProvider.connection && targetNetwork.name.indexOf("local") !== -1;

  const [faucetClicked, setFaucetClicked] = useState(false);
  
  const charityDecimals = {
    'DAI': 18,
    'USDC': 6
  }

  const params = {faucetAvailable,updateValue,setValue,charityDecimals,readContracts,writeContracts,tx,targetNetwork,web3Modal,loadWeb3Modal,address,localProvider,userSigner,mainnetProvider,logoutOfWeb3Modal,blockExplorer}
  
  return (
    <div className="App">
      {networkDisplay}
      <Router>
       <Switch>
          <Route exact path="/">
            <PageTemplate
              {...params}
            />  
          </Route>
        </Switch>
      </Router>
      <ThemeSwitch />
      
    </div>
  );
}

export default App;
