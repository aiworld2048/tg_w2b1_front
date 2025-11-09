import React, { useContext, useEffect, useState } from "react";
import all from "../../assets/img/all.png";
import slot from "../../assets/img/slotL.png";
import casino from "../../assets/img/casinoL.png";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { LanguageContext } from "../../contexts/LanguageContext";
import { GameContext } from "../../contexts/GameContext";
import { AuthContext } from "../../contexts/AuthContext";
import { GameList } from "./GameList";
import ProviderList from "./ProviderList";
import shan from "../../assets/img/shan.jpg";
import ponewine from "../../assets/img/ponewine.jpg";
import styles from "./GameTabsLg.module.css";
import digitBetLogo from "./logo.webp";
import shanLogo from "./Shan/assets/img/shan.jpg";
import ponewineLogo from "./ponewine/assets/img/mobile.png";
import TwoDLogo from "../../assets/img/logo.png";
import useGuestRegister from "../../hooks/useGuestRegister";
import CredentialsDisplay from "../CredentialsDisplay";
import buffaloLogo from "../../assets/buffalo/500-200x200.png";

const GameTabsLg = () => {
  const { content } = useContext(LanguageContext);
  const { user, updateProfile } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const type = searchParams.get("type");
  const provider = searchParams.get("provider");
  const { 
    createGuestAccount, 
    loading: guestLoading, 
    error: guestError,
    showCredentials,
    credentials,
    handleCloseCredentials
  } = useGuestRegister();
  const {
    types: gameTabs,
    providersData: providers,
    game_lists: games,
    loading,
    hot_games,
    table_games,
    card_games,
    bingo_games,
  } = useContext(GameContext);
  // const gameProvider = providers && providers.find((p) => p?.code == provider)?.id;

  

  const baseImageMap = {
    1: "/images/Final_All/Slot/SlotPng.png",
    2: "/images/Final_All/Casino/LiveCasinoPNG.png",
    3: "/images/Final_All/Sport Book/SportPNG.png",
    4: "/images/Final_All/Virtual Sport/VirtualSportPNG.png",
    5: "/images/Final_All/Lottery/LotteryPNG.png",
    // 6: "//assets/img/my_local_images/qipai.png",
    7: "/images/Final_All/P2P/P2PPNG.png",
    8: "/images/Final_All/Fishing/FishingPng.png",
    9: "/images/Final_All/Cock Fighting/CockFishingPNG_00000.png",
    10: "/images/Final_All/Bonus/BonusPNG.png",
    11: "/images/Final_All/E-Sport/E- SportPNG.png",
    // 12: "//assets/img/my_local_images/poker.png",
    // 13: "//assets/img/my_local_images/others.png",
    // 14: "//assets/img/my_local_images/premium.png",
  };

  const activeImageMap = {
    1: "/images/Final_All/Slot/APNG Slot.png",
    2: "/images/Final_All/Casino/APNGLive Casino.png",
    3: "/images/Final_All/Sport Book/Sport Sport Book APNG.png",
    4: "/images/Final_All/Virtual Sport/APNG Virtual sport.png",
    5: "/images/Final_All/Lottery/APNG Lottery.png",
    // 6: "/./assets/my_local_images/qipai.png",
    7: "/images/Final_All/P2P/APNG P2P.png",
    8: "/images/Final_All/Fishing/APNG fishing.png",
    9: "/images/Final_All/Cock Fighting/Cock Fishing APNG.png",
    10: "/images/Final_All/Bonus/APNG Bonus.png",
    11: "/images/Final_All/E-Sport/APNG E-sport.png",
    // 12: "/assets/my_local_images/poker.png",
    // 13: "/assets/my_local_images/others.png",
    // 14: "/assets/my_local_images/premium.png",
  };

  const hotGame =  '/images/Final_All/Hot Game/Hot Game Fire.png';
  const activeHotGame = '/images/Final_All/Hot Game/Hopt Game APNG/Hopt Game APNG.png'

  const hotImg = type === "hot" ? activeHotGame : hotGame ;
  // Use the first game type's image as a fallback for All Games/Hot Games
  const defaultTabImg = gameTabs && gameTabs.length > 0 ? gameTabs[0].img : "";

  return (
    <div className="px-1 lg:block">
      {/* Modern Tab Navigation */}
      <div className="flex overflow-x-auto gap-3 pb-4 scrollbar-hide snap-x snap-mandatory">
        {/** Each tab is a snap-center, touch-friendly, shadowed card */}

           {/* Hot Games Tab */}
        <button
          className={`relative flex flex-col items-center justify-center min-w-[68px] p-1 rounded-2xl transition-all duration-300 shadow-lg bg-gradient-to-br border-2 border-transparent group snap-center active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400 select-none
            ${type === "hot"
              ? "from-yellow-400/90 to-orange-500/90 border-yellow-400 ring-2 ring-yellow-300/60 shadow-2xl"
              : "from-slate-800/80 to-slate-900/80 hover:from-yellow-200/30 hover:to-orange-200/30 hover:border-yellow-400/60"}
          `}
          style={{boxShadow: '0 2px 12px 0 rgba(0,0,0,0.14)'}}
          onClick={() => navigate("/?type=hot")}
        >
          <div className="relative w-14 h-14 aspect-square overflow-hidden rounded-2xl  p-1  transition-all duration-200 flex items-center justify-center"   style={{
                  background: 'linear-gradient(to right, #2155f0, #0a2472)'}}
                >
            <div className="w-full h-full bg-black/60 rounded-2xl flex items-center justify-center group-hover:bg-black/80 transition-all duration-200">
              <img
                src={hotImg}
                className="w-10 h-10 object-contain rounded-2xl group-hover:scale-105 transition-transform duration-200"
                alt="Hot Games"
              />
            </div>
          </div>
          <span className="mt-2 px-3 py-1 text-black font-bold text-xs rounded-full shadow text-center max-w-[90%] truncate whitespace-nowrap border group-hover:scale-105 transition-transform duration-200" style={{
  background: 'linear-gradient(to right, #63a3ff, #b6deff)'}}>
            Hot Games
          </span>
        </button>

          {/* Buffalo Game Tab */}
        <button
          className={`relative flex flex-col items-center justify-center min-w-[68px] p-1 rounded-2xl transition-all duration-300 shadow-lg bg-gradient-to-br border-2 border-transparent group snap-center active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400 select-none
            ${type === "buffalo"
              ? "from-yellow-400/90 to-orange-500/90 border-yellow-400 ring-2 ring-yellow-300/60 shadow-2xl"
              : "from-slate-800/80 to-slate-900/80 hover:from-yellow-200/30 hover:to-orange-200/30 hover:border-yellow-400/60"}
          `}
          style={{boxShadow: '0 2px 12px 0 rgba(0,0,0,0.14)'}}
          onClick={() => navigate("/buffalo")}
        >
          <div className="relative w-14 h-14 aspect-square overflow-hidden rounded-2xl p-1 transition-all duration-200 flex items-center justify-center"   style={{
                  background: 'linear-gradient(to right, #2155f0, #0a2472)'}}
                >
            <div className="w-full h-full bg-black/60 rounded-2xl flex items-center justify-center group-hover:bg-black/80 transition-all duration-200">
              <img
                src={buffaloLogo}
                className="w-10 h-10 object-contain rounded-2xl group-hover:scale-105 transition-transform duration-200"
                alt="Buffalo Game"
              />
            </div>
          </div>
          <span className="mt-2 px-3 py-1 text-black font-bold text-xs rounded-full shadow text-center max-w-[90%] truncate whitespace-nowrap border group-hover:scale-105 transition-transform duration-200" style={{
  background: 'linear-gradient(to right, #63a3ff, #b6deff)'}}>
            Buffalo
          </span>
        </button>

        {/* Pone Wine Game Tab */}
       {/* <button
          className={`relative flex flex-col items-center justify-center min-w-[68px] p-1 rounded-2xl transition-all duration-300 shadow-lg bg-gradient-to-br border-2 border-transparent group snap-center active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400 select-none
            ${
              type === "ponewine"
                ? "from-yellow-400/90 to-orange-500/90 border-yellow-400 ring-2 ring-yellow-300/60 shadow-2xl"
                : "from-slate-800/80 to-slate-900/80 hover:from-yellow-200/30 hover:to-orange-200/30 hover:border-yellow-400/60"
            }
          `}
          style={{ boxShadow: "0 2px 12px 0 rgba(0,0,0,0.14)" }}
          onClick={() => navigate("/ponewine")}
        >
          <div className="relative w-14 h-14 aspect-square overflow-hidden rounded-2xl bg-gradient-to-br p-1  transition-all duration-200 flex items-center justify-center"
            style={{
                  background: 'linear-gradient(to right, #2155f0, #0a2472)'}}
                >
            <div className="w-full h-full bg-black/60 rounded-2xl flex items-center justify-center group-hover:bg-black/80 transition-all duration-200">
              <img
                src={ponewineLogo}
                className="w-10 h-10 object-contain rounded-2xl group-hover:scale-105 transition-transform duration-200"
                alt="Pone Wine Game"
              />
            </div>
          </div>
          <span className="mt-2 px-3 py-1 text-black font-bold text-xs rounded-full shadow text-center max-w-[90%] truncate whitespace-nowrap border group-hover:scale-105 transition-transform duration-200" style={{
  background: 'linear-gradient(to right, #63a3ff, #b6deff)'}}>
            PoneWine
          </span>
        </button> */}

         {/* Dynamic Game Type Tabs */}
        {gameTabs &&
          gameTabs
            .filter((item) => ![6, 12, 13, 14].includes(item.id))
            .map((item) => (
              <button
                key={item.id}
                className={`relative flex flex-col items-center justify-center min-w-[68px] p-1 rounded-2xl transition-all duration-300 shadow-lg bg-gradient-to-br border-2 border-transparent group snap-center active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400 select-none
                  ${type == item.id
                    ? "from-yellow-400/90 to-orange-500/90 border-yellow-400 ring-2 ring-yellow-300/60 shadow-2xl"
                    : "from-slate-800/80 to-slate-900/80 hover:from-yellow-200/30 hover:to-orange-200/30 hover:border-yellow-400/60"}
                `}
                style={{boxShadow: '0 2px 12px 0 rgba(0,0,0,0.14)'}}
                onClick={() => navigate(`?type=${item.id}`)}
              >
                <div className="relative w-14 h-14 aspect-square overflow-hidden rounded-2xl  p-1  transition-all duration-200 flex items-center justify-center"   style={{
                  background: 'linear-gradient(to right, #2155f0, #0a2472)'}}
                >
                  <div className="w-full h-full bg-black/60 rounded-2xl flex items-center justify-center group-hover:bg-black/80 transition-all duration-200">
                    <img
                      src={
                        type == item.id
                          ? activeImageMap[item.id]
                          : baseImageMap[item.id]
                      }
                      className="w-10 h-10 object-contain rounded-2xl group-hover:scale-105 transition-transform duration-200"
                      alt={item.name}
                    />
                  </div>
                </div>
                <span className="mt-2 px-3 py-1  text-black font-bold text-xs rounded-full shadow text-center max-w-[90%] truncate whitespace-nowrap border  group-hover:scale-105 transition-transform duration-200" style={{
  background: 'linear-gradient(to right, #63a3ff, #b6deff)'}}>
                  {item.name}
                </span>
              </button>
            ))}

       
         {/* Shan Game Tab */}
       {/* <button
          className={`relative flex flex-col items-center justify-center min-w-[68px] p-1 rounded-2xl transition-all duration-300 shadow-lg bg-gradient-to-br border-2 border-transparent group snap-center active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400 select-none
            ${
              type === "digitbet"
                ? "from-yellow-400/90 to-orange-500/90 border-yellow-400 ring-2 ring-yellow-300/60 shadow-2xl"
                : "from-slate-800/80 to-slate-900/80 hover:from-yellow-200/30 hover:to-orange-200/30 hover:border-yellow-400/60"
            }
          `}
          style={{ boxShadow: "0 2px 12px 0 rgba(0,0,0,0.14)" }}
          onClick={() => navigate("/shan")}
        >
          <div className="relative w-14 h-14 aspect-square overflow-hidden rounded-2xl  p-1 group-hover:shadow-2xl transition-all duration-200 flex items-center justify-center"
            style={{
                  background: 'linear-gradient(to right, #2155f0, #0a2472)'}}
                >
            <div className="w-full h-full bg-black/60 rounded-2xl flex items-center justify-center group-hover:bg-black/80 transition-all duration-200">
              <img
                src={shanLogo}
                className="w-10 h-10 object-contain rounded-2xl group-hover:scale-105 transition-transform duration-200"
                alt="Shan Game"
              />
            </div>
          </div>
          <span className="mt-2 px-3 py-1  text-black font-bold text-xs rounded-full shadow text-center max-w-[90%] truncate whitespace-nowrap border group-hover:scale-105 transition-transform duration-200" style={{
  background: 'linear-gradient(to right, #63a3ff, #b6deff)'}}>
            ShanKoMe
          </span>
        </button> */}
        {/* 2D Tab */}
        {/* <button
          className={`relative flex flex-col items-center justify-center min-w-[68px] p-1 rounded-2xl transition-all duration-300 shadow-lg bg-gradient-to-br border-2 border-transparent group snap-center active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400 select-none
            ${type === "2d"
              ? "from-yellow-400/90 to-orange-500/90 border-yellow-400 ring-2 ring-yellow-300/60 shadow-2xl"
              : "from-slate-800/80 to-slate-900/80 hover:from-yellow-200/30 hover:to-orange-200/30 hover:border-yellow-400/60"}
          `}
          style={{boxShadow: '0 2px 12px 0 rgba(0,0,0,0.14)'}}
          onClick={() => navigate("/2d")}
        >
          <div className="relative w-14 h-14 aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-400/70 via-white/10 to-yellow-600/70 p-1 group-hover:from-yellow-400 group-hover:to-orange-400 group-hover:shadow-2xl transition-all duration-200 flex items-center justify-center">
            <div className="w-full h-full bg-black/60 rounded-2xl flex items-center justify-center group-hover:bg-black/80 transition-all duration-200">
              <img
                src={TwoDLogo}
                className="w-10 h-10 object-contain rounded-2xl group-hover:scale-105 transition-transform duration-200"
                alt="2D"
              />
            </div>
          </div>
          <span className="mt-2 px-3 py-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-600 text-black font-bold text-xs rounded-full shadow text-center max-w-[90%] truncate whitespace-nowrap border border-yellow-300 group-hover:scale-105 transition-transform duration-200">
            2D
          </span>
        </button> */}

        {/* Shan Game Tab */}
        {/* <button
          className={`relative flex flex-col items-center justify-center min-w-[68px] p-1 rounded-2xl transition-all duration-300 shadow-lg bg-gradient-to-br border-2 border-transparent group snap-center active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400 select-none
            ${type === "digitbet"
              ? "from-yellow-400/90 to-orange-500/90 border-yellow-400 ring-2 ring-yellow-300/60 shadow-2xl"
              : "from-slate-800/80 to-slate-900/80 hover:from-yellow-200/30 hover:to-orange-200/30 hover:border-yellow-400/60"}
          `}
          style={{boxShadow: '0 2px 12px 0 rgba(0,0,0,0.14)'}}
          onClick={() => navigate("/shan")}
        >
          <div className="relative w-14 h-14 aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-400/70 via-white/10 to-yellow-600/70 p-1 group-hover:from-yellow-400 group-hover:to-orange-400 group-hover:shadow-2xl transition-all duration-200 flex items-center justify-center">
            <div className="w-full h-full bg-black/60 rounded-2xl flex items-center justify-center group-hover:bg-black/80 transition-all duration-200">
              <img
                src={shanLogo}
                className="w-10 h-10 object-contain rounded-2xl group-hover:scale-105 transition-transform duration-200"
                alt="Shan Game"
              />
            </div>
          </div>
          <span className="mt-2 px-3 py-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-600 text-black font-bold text-xs rounded-full shadow text-center max-w-[90%] truncate whitespace-nowrap border border-yellow-300 group-hover:scale-105 transition-transform duration-200">
            ShanKoMe
          </span>
        </button> */}

     

        {/* 3D Tab */}
        {/* <button
          className={`relative flex flex-col items-center justify-center min-w-[68px] p-1 rounded-2xl transition-all duration-300 shadow-lg bg-gradient-to-br border-2 border-transparent group snap-center active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400 select-none
            ${type === "3d"
              ? "from-yellow-400/90 to-orange-500/90 border-yellow-400 ring-2 ring-yellow-300/60 shadow-2xl"
              : "from-slate-800/80 to-slate-900/80 hover:from-yellow-200/30 hover:to-orange-200/30 hover:border-yellow-400/60"}
          `}
          style={{boxShadow: '0 2px 12px 0 rgba(0,0,0,0.14)'}}
          onClick={() => navigate("/3d")}
        >
          <div className="relative w-14 h-14 aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-400/70 via-white/10 to-yellow-600/70 p-1 group-hover:from-yellow-400 group-hover:to-orange-400 group-hover:shadow-2xl transition-all duration-200 flex items-center justify-center">
            <div className="w-full h-full bg-black/60 rounded-2xl flex items-center justify-center group-hover:bg-black/80 transition-all duration-200">
              <img
                src={TwoDLogo}
                className="w-10 h-10 object-contain rounded-2xl group-hover:scale-105 transition-transform duration-200"
                alt="3D"
              />
            </div>
          </div>
          <span className="mt-2 px-3 py-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-600 text-black font-bold text-xs rounded-full shadow text-center max-w-[90%] truncate whitespace-nowrap border border-yellow-300 group-hover:scale-105 transition-transform duration-200">
            3D
          </span>
        </button> */}

       
      </div>

      {/* Content Area */}
      {/* {!user && (
        <div className="flex flex-col gap-4 p-6 bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-lg border border-yellow-400/30">
          <h1 className="text-2xl font-bold text-yellow-400">Create Guest Account</h1>
          <p className="text-sm text-white">
            Create a guest account to start playing immediately. No registration required!
          </p>
          <button 
            className={`bg-yellow-400 text-black px-6 py-3 rounded-md font-semibold hover:bg-yellow-300 transition-colors duration-200 ${
              guestLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
            }`}
            onClick={createGuestAccount}
            disabled={guestLoading}
          >
            {guestLoading ? 'Creating Account...' : 'Create Guest Account'}
          </button>
          {guestError && (
            <p className="text-red-400 text-sm mt-2">
              {guestError}
            </p>
          )}
        </div>
      )} */}
      <div className="space-y-6">
        {/* Game Lists */}
        {type && provider && <GameList loading={loading} />}
        
        {type == "hot" && (
          <div className="space-y-4">
            <h5 className="text-xl font-bold text-yellow-400">{content?.game_type?.hot}</h5>
            <GameList loading={loading} games={hot_games} />
          </div>
        )}

        {/* All Games View - Show all providers for each type */}
        {type == "all" && !provider && (
          <div className="space-y-8">

            <h4 className="mb-4 text-xl font-bold text-yellow-400 px-1">
              မြန်မာဂိမ်းများ
            </h4>
   
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 w-full">

                    {/* Buffalo Game Tab */}
        <button
          className={`cursor-pointer group flex flex-col items-center`
        }
          
          onClick={() => navigate("/buffalo")}
        >
          <div className="relative w-full aspect-square overflow-hidden  p-1  group-hover:shadow-2xl transition-all duration-200"
                style={{
                  background: 'linear-gradient(to right, #2155f0, #0a2472)'}}
                >
            <div className="w-full h-full bg-black/60 rounded-2xl flex items-center justify-center group-hover:bg-black/80 transition-all duration-200">
              <img
                src={buffaloLogo}
                className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-200"
                alt="Buffalo Game"
                
              />
            </div>
          </div>
          <span className="mt-2 px-3 py-1  text-black font-bold text-xs rounded-full shadow text-center max-w-[90%] truncate whitespace-nowrap border group-hover:scale-105 transition-transform duration-200" style={{
  background: 'linear-gradient(to right, #63a3ff, #b6deff)'}}>
            Buffalo
          </span>
        </button>
         

            {/* Pone Wine Game Tab */}
          {/*  <button
              className={`cursor-pointer group flex flex-col items-center
 
  `}
              // style={{boxShadow: '0 2px 12px 0 rgba(0,0,0,0.14)'}}
              onClick={() => navigate("/ponewine")}
            >
              <div className="relative w-full aspect-square overflow-hidden rounded-2xl p-1  transition-all duration-200" 
               style={{
                  background: 'linear-gradient(to right, #2155f0, #0a2472)'}}
                >
                <div className="w-full h-full bg-black/60 rounded-2xl flex items-center justify-center group-hover:bg-black/80 transition-all duration-200">
                  <img
                    src={ponewineLogo}
                    className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-200"
                    alt="Pone Wine Game"
                  />
                </div>
              </div>
              <span className="mt-2 px-3 py-1  text-black font-bold text-xs rounded-full shadow text-center max-w-[90%] truncate whitespace-nowrap border group-hover:scale-105 transition-transform duration-200" style={{
  background: 'linear-gradient(to right, #63a3ff, #b6deff)'}}>
                PoneWine
              </span>
            </button> */}

                    {/* Shan Game Tab */}
             {/* <button
              className={`cursor-pointer group flex flex-col items-center`}
              onClick={() => navigate("/shan")}
            >
              <div className="relative w-full aspect-square overflow-hidden rounded-2xl  p-1  transition-all duration-200"
                  style={{
                  background: 'linear-gradient(to right, #2155f0, #0a2472)'}}
              >
                <div className="w-full h-full bg-black/60 rounded-2xl flex items-center justify-center group-hover:bg-black/80 transition-all duration-200">
                  <img
                    src={shanLogo}
                    className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-200"
                    alt="Shan Game"
                  />
                </div>
              </div>
              <span className="mt-2 px-3 py-1  text-black font-bold text-xs rounded-full shadow text-center max-w-[90%] truncate whitespace-nowrap border  group-hover:scale-105 transition-transform duration-200" style={{
  background: 'linear-gradient(to right, #63a3ff, #b6deff)'}}>
                ShanKoMe
              </span>
            </button> */}
              
              {/* 2D  */}
              {/* <button
                className={`cursor-pointer group flex flex-col items-center`}
                onClick={() => navigate("/2d")}
              >
                <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-400/70 via-white/10 to-yellow-600/70 p-1 group-hover:from-yellow-400 group-hover:to-orange-400 group-hover:shadow-2xl transition-all duration-200">
                  <div className="w-full h-full bg-black/60 rounded-2xl flex items-center justify-center group-hover:bg-black/80 transition-all duration-200">
                    <img
                      src={TwoDLogo}
                      className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-200"
                      alt="2D"
                    />
                  </div>
                </div>
                <span className="mt-2 px-3 py-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-600 text-black font-bold text-xs rounded-full shadow text-center max-w-[90%] truncate whitespace-nowrap border border-yellow-300 group-hover:scale-105 transition-transform duration-200">
                  2D
                </span>
              </button> */}

              {/* 3D Tab */}
              {/* <button
                className={`cursor-pointer group flex flex-col items-center
 
  `}
                // style={{boxShadow: '0 3px 14px rgba(0,0,0,0.15)'}}
                onClick={() => navigate("/3d")}
              >
                <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-400/70 via-white/10 to-yellow-600/70 p-1 group-hover:from-yellow-400 group-hover:to-orange-400 group-hover:shadow-2xl transition-all duration-200">
                  <div className="w-full h-full bg-black/60 rounded-2xl flex items-center justify-center group-hover:bg-black/80 transition-all duration-200">
                    <img
                      src={TwoDLogo}
                      className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-200"
                      alt="3D"
                    />
                  </div>
                </div>
                <span className="mt-2 px-4 py-1 bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-500 text-black font-semibold text-sm rounded-full shadow text-center max-w-[90%] truncate whitespace-nowrap border border-yellow-200 group-hover:scale-110 transition-transform duration-200">
                  3D
                </span>
              </button> */}
            </div>
            {gameTabs &&
              gameTabs.
                filter((item) => ![6, 12, 13, 14].includes(item.id)).map((tab, index) => (
                <div className="w-full" key={index}>
                  <h4 className="mb-4 text-xl font-bold text-yellow-400 px-1">
                    {tab.name}
                  </h4>
                  <ProviderList typeCode={tab?.code} type={tab} />
                </div>
              ))}
          </div>
        )}

        {/* Individual Type View - Show providers for specific type */}
        {!provider &&
          gameTabs &&
          gameTabs.map(
            (tab, index) =>
              type == tab.id && (
                <div className="w-full" key={index}>
                  <h5 className="mb-4 text-lg font-semibold text-white">{tab.name}</h5>
                  <ProviderList typeCode={tab?.code} type={tab} />
                </div>
              )
          )}
      </div>
      
      {/* Credentials Modal */}
      {showCredentials && (
        <CredentialsDisplay
          username={credentials.username}
          password={credentials.password}
          onClose={handleCloseCredentials}
        />
      )}
    </div>
  );
};

export default GameTabsLg;
