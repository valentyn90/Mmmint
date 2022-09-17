import React, { useEffect, useState, useRef } from "react";
import st from "./styles/pageTemplate.module.css";
import { FaTwitter, FaCopy } from "react-icons/fa";
import $ from "jquery";
import { Power4 } from "gsap/dist/gsap";
import { gsap } from "gsap/dist/gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination } from "swiper";
import "swiper/swiper.min.css";
import "swiper/components/pagination/pagination.min.css";

import commafy from 'commafy';
import { utils } from "ethers";
import moment from 'moment'
import { Header, Footer } from "../components";

import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
const antIcon = <LoadingOutlined style={{ fontSize: 12 }} spin />;

const PageTemplate = (props) => {

  const [statsLoaded, setStatsLoaded] = useState(false);

  const useFocus = () => {
    const htmlElRef = useRef(null)
    const setFocus = () => { htmlElRef.current && htmlElRef.current.focus() }
    return [htmlElRef, setFocus]
  }
  const [inputRef, setInputFocus] = useFocus()

  useEffect(async() => {
    document.title = `React | Template (${props.targetNetwork.name.replace('host','').charAt(0).toUpperCase() + props.targetNetwork.name.replace('host','').substr(1).toLowerCase()})`;
  }, []);

  const setValue = props.setValue;

  const updateStats = (c) => {

    setTimeout(() => {

      if (props && props.address && props.address != '0x0000000000000000000000000000000000000000') {

        setValue("", "balanceOf", [props.address], balance, setBalance);

        props.readContracts[""][""](props.readContracts[''].address, props.readContracts[''].address).then((d) => {

          set(d[''])

        });
      }

    }, 10)

    let url = `/api/v1/data/stats`;
    //console.log(url);
    fetch(url).then((d) => {
      if (d.ok) {
        return d.json()
      }
      // else {
      //   setTimeout(() => {
      //     updateStats();
      //   }, 60000);
      // }
    }).then((d) => {
      // console.log(d);

      try {
        // setrewardChartData(d['rewardovertime']);
      }
      catch (e) {}

    })


  }

  useEffect(async() => {
    if (props && props.readContracts) {
      //  updateStats()
    }
  }, [props.readContracts, props.address]);

  if (props.readContracts && statsLoaded == false) {

    setStatsLoaded(true);

    const listener = (blockNumber, contract) => {
      if (contract != undefined) {
        //  console.log('UPDATING CONTRACTS');
        //.log(contract, blockNumber); // , fn, args, provider.listeners()
        //  updateStats(contract);
      }
    };

    // updateStats();

    // const contractsToListen = ['']
    //   contractsToListen.map(c => {
    //     props.readContracts[c].provider.removeAllListeners("block");
    //     props.readContracts[c].provider.on("block", (block) => { listener(block, c) });
    //   });

  }

  SwiperCore.use([Navigation, Pagination]);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    /* Header on-scroll Animation */
    const headerAnim = gsap.timeline();
    headerAnim.fromTo(
      ".header", {
        backgroundColor: "transparent",
        backdropFilter: "blur(0px)",
      }, {
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(5px)",
        scrollTrigger: {
          trigger: ".hero",
          start: "0% 0",
          end: "50% 0",
          scrub: 0.5,
          toggleActions: "start pause resume none",
        },
      }
    );
  }, []);

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

  return (
    <div id="app" className="app">

      <Header {...props}/>

      <div className={st.stake + " " + " section"}>
        <div className="box">
            
        </div>
      </div><Footer {...props}/>
      
    </div>
  );
};

export default PageTemplate;
