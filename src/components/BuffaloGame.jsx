import React, { useContext, useState, useRef } from "react";
import { AuthContext } from "../contexts/AuthContext";
import buffaloLogo from "../assets/buffalo/500-200x200.png";
import africanBuffaloImage from "../assets/buffalo/af.png";
import BASE_URL from "../hooks/baseUrl";

const BuffaloGame = () => {
  const { user } = useContext(AuthContext);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const handleLaunchGame = async (roomId) => {
    if (!user) {
      alert("Please login to play Buffalo game");
      return;
    }

    try {
      // Get the game URL directly and navigate to it
      const response = await fetch(`${BASE_URL}/buffalo/launch-game`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          type_id: 1,
          provider_id: 23,
          game_id: 23,
          room_id: roomId,
        }),
      });

      if (!response.ok) {
        throw new Error("Launch Game failed");
      }

      const data = await response.json();
      
      if (data.code === 1) {
        // Direct navigation to game URL (no iframe)
        window.location.href = data.Url || data.game_url;
      } else {
        alert(data.msg || "Failed to launch game");
      }
    } catch (error) {
      console.error("Launch Game error:", error);
      alert("Failed to launch game. Please try again.");
    }
  };

  const handleBackToRooms = () => {
    setSelectedRoom(null);
  };

  const rooms = [
    {
      id: 1,
      name: "African Buffalo",
      minBet: 50,
      level: "Basic",
      description: "Perfect for beginners",
      rtp: "96%",
      roomNumber: "(50)"
    },
    {
      id: 2,
      name: "African Buffalo",
      minBet: 500,
      level: "Intermediate",
      description: "For experienced players",
      rtp: "96%",
      roomNumber: "(500)"
    },
    {
      id: 3,
      name: "African Buffalo",
      minBet: 5000,
      level: "High",
      description: "High stakes gaming",
      rtp: "97%",
      roomNumber: "(5000)"
    },
    {
      id: 4,
      name: "African Buffalo",
      minBet: 10000,
      level: "VIP",
      description: "Exclusive VIP room",
      rtp: "97%",
      roomNumber: "(10000)"
    }
  ];

  const canPlayRoom = (minBet) => {
    if (!user) return false;
    return user.balance >= minBet;
  };

  // Scroll functions
  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.offsetWidth * 0.6; // Scroll 60% of container width for smaller cards
    const targetScroll = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  };

  // Update scroll button states and active card indicator
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 10);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.offsetWidth - 10
    );

    // Calculate active card index based on scroll position
    const cardWidth = container.offsetWidth * 0.22; // Updated for smaller cards
    const scrollPosition = container.scrollLeft + (container.offsetWidth / 2);
    const newIndex = Math.floor(scrollPosition / (cardWidth + 24)); // 24px gap
    setActiveCardIndex(Math.min(Math.max(0, newIndex), rooms.length - 1));
  };

  // Add touch/swipe support
  const handleTouchStart = (e) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    container.dataset.touchStartX = e.touches[0].clientX;
    container.dataset.scrollLeft = container.scrollLeft;
  };

  const handleTouchMove = (e) => {
    const container = scrollContainerRef.current;
    if (!container || !container.dataset.touchStartX) return;
    
    const touchX = e.touches[0].clientX;
    const touchStartX = parseFloat(container.dataset.touchStartX);
    const scrollLeft = parseFloat(container.dataset.scrollLeft);
    const diff = touchStartX - touchX;
    
    container.scrollLeft = scrollLeft + diff;
  };

  // No longer need the room component since we're using direct navigation
  // if (selectedRoom) {
  //   return (
  //     <BuffaloGameRoom 
  //       roomId={selectedRoom} 
  //       onBack={handleBackToRooms}
  //     />
  //   );
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        {/* <div className="text-center mb-8">
          <img 
            src={buffaloLogo} 
            alt="Buffalo Game" 
            className="w-40 h-40 mx-auto mb-6 rounded-3xl shadow-2xl border-4 border-yellow-400/30"
          />
          <h1 className="text-4xl font-bold text-yellow-400 mb-4">
            Buffalo Slot Game
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience the thrill of the African savanna with our exciting Buffalo slot game. 
            Choose your room and start your adventure!
          </p>
        </div> */}

        {/* User Balance */}
        {/* {user && (
          <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-2xl p-4 mb-8 border border-yellow-400/30">
            <div className="flex items-center justify-center space-x-4">
              <div className="text-center">
                <p className="text-gray-300 text-sm">Your Balance</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {user.balance?.toLocaleString() || 0}
                </p>
              </div>
            </div>
            <div className="mt-3 text-center">
              <p className="text-gray-300 text-sm">
                Available Rooms: {rooms.filter(room => canPlayRoom(room.minBet)).length} of {rooms.length}
              </p>
            </div>
          </div>
        )} */}

        {/* Room Selection - Horizontal Slider */}
        <div className="relative mb-8">
          {/* Left Arrow */}
          {/* {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black text-yellow-400 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-2xl"
              aria-label="Scroll left"
            >
              <span className="text-2xl font-bold">←</span>
            </button>
          )} */}

          {/* Right Arrow */}
          {/* {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black text-yellow-400 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-2xl"
              aria-label="Scroll right"
            >
              <span className="text-2xl font-bold">→</span>
            </button>
          )} */}

          {/* Scrollable Container */}
          <div 
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 w-full"
    
          >
            {rooms.map((room) => (
            <div 
              key={room.id}
           className={`relative rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 snap-center flex-shrink-0 ${
                canPlayRoom(room.minBet) 
                  ? 'border-2 border-yellow-400/50 hover:border-yellow-400 hover:shadow-2xl hover:shadow-yellow-400/20' 
                  : 'border-2 border-gray-600/50 opacity-60'
              }`}
   
            >
              {/* Game Image Background */}
              <div>
                <img 
                  src={africanBuffaloImage} 
                  alt="African Buffalo" 
                    className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-200"
                />
                
                {/* Overlay Gradient */}
                {/* <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60"></div> */}
                
                {/* L7 Badge */}
                <div className="absolute top-3 left-3">
                  <div className="bg-white/90 text-black px-2 py-1 rounded text-xs font-bold">
                    L7
                  </div>
                </div>

                {/* Availability Indicator */}
                {!canPlayRoom(room.minBet) && (
                  <div className="absolute top-3 right-3">
                    <div className="bg-red-500/90 text-white px-2 py-1 rounded text-xs font-bold">
                      Insufficient Balance
                    </div>
                  </div>
                )}

                {/* Game Title Overlay */}
                <div className="absolute bottom-20 left-3 right-3">
                  <div className="text-center">
                    <h3 className="text-green-400 font-bold text-lg mb-1">
                      AFRICAN
                    </h3>
                    <h3 className="text-yellow-400 font-bold text-xl mb-2" style={{
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                      WebkitTextStroke: '1px rgba(0,0,0,0.5)'
                    }}>
                      BUFFALO
                    </h3>
                  </div>
                </div>

                {/* Bottom Info Panel */}
                       <div className="bottom-0 left-0 right-0 bg-black/80 p-3">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="text-gray-300 text-xs">RTP:</p>
                      <p className="text-yellow-400 font-bold text-sm">{room.rtp}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-300 text-xs">Min Bet:</p>
                      <p className="text-white font-bold text-sm">{room.minBet.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-300 text-xs">African Buffalo {room.roomNumber}</p>
                  </div>
                </div>
              </div>

              {/* Play Button Overlay */}
                <div className=" absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => handleLaunchGame(room.id)}
                  disabled={!canPlayRoom(room.minBet)}
                  className={`px-1 py-1 rounded-xl font-bold text-lg transition-all duration-300 ${
                    canPlayRoom(room.minBet)
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-300 hover:to-orange-400 hover:shadow-2xl hover:scale-105'
                      : 'bg-gray-600/80 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  {!user ? 'Login to Play' : 
                   !canPlayRoom(room.minBet) ? 'Insufficient Balance' : 
                   '🚀 Play Now'}
                </button>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuffaloGame;
