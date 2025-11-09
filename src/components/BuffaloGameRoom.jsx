import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import BASE_URL from "../hooks/baseUrl";

const BuffaloGameRoom = ({ roomId, onBack }) => {
  const { user } = useContext(AuthContext);
  const [gameUrl, setGameUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const rooms = {
    1: { name: "African Buffalo", level: "Basic", minBet: 50, rtp: "96%", roomNumber: "(50)" },
    2: { name: "African Buffalo", level: "Intermediate", minBet: 500, rtp: "96%", roomNumber: "(500)" },
    3: { name: "African Buffalo", level: "High", minBet: 5000, rtp: "97%", roomNumber: "(5000)" },
    4: { name: "African Buffalo", level: "VIP", minBet: 10000, rtp: "97%", roomNumber: "(10000)" }
  };

  useEffect(() => {
    const launchGame = async () => {
      try {
        setLoading(true);
        setError(null);

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
          if (response.status === 401) {
            window.location.href = "/";
            return;
          }
          throw new Error("Launch Game failed");
        }

        const data = await response.json();
        
        if (data.code === 1) {
          // Use the URL from API response (exact provider format)
          setGameUrl(data.Url || data.game_url);
        } else {
          setError(data.msg || "Failed to launch game");
        }
      } catch (err) {
        console.error("Launch Game error:", err);
        setError("Failed to launch game. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (user && roomId) {
      launchGame();
    }
  }, [user, roomId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-yellow-400 mb-2">Loading Game Room...</h2>
          <p className="text-gray-300">
            Preparing {rooms[roomId]?.name} for you
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-400 mb-4">Game Launch Failed</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          {error.includes('balance') && (
            <div className="bg-yellow-400/20 border border-yellow-400/30 rounded-lg p-4 mb-6">
              <p className="text-yellow-400 text-sm">
                <strong>Your Balance:</strong> {user?.balance?.toLocaleString() || 0}
              </p>
              <p className="text-yellow-400 text-sm">
                <strong>Required:</strong> {rooms[roomId]?.minBet?.toLocaleString()}
              </p>
              <p className="text-gray-300 text-xs mt-2">
                Please choose a room that matches your balance level.
              </p>
            </div>
          )}
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-lg font-bold hover:from-yellow-300 hover:to-orange-400 transition-all duration-300"
          >
            Back to Rooms
          </button>
        </div>
      </div>
    );
  }

  if (!gameUrl) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">No Game URL Available</h2>
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-lg font-bold hover:from-yellow-300 hover:to-orange-400 transition-all duration-300"
          >
            Back to Rooms
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative">
      {/* Game Room Header - Fixed at top */}
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 p-4 shadow-lg z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="bg-black/20 hover:bg-black/40 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 hover:scale-105"
            >
              <span className="text-xl">←</span>
              <span>Back to Rooms</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-black">
                {rooms[roomId]?.name} {rooms[roomId]?.roomNumber}
              </h1>
              <p className="text-black/80">
                {rooms[roomId]?.level} Level • RTP: {rooms[roomId]?.rtp}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-black/80 text-sm">Your Balance</p>
              <p className="text-black font-bold text-xl">
                {user?.balance?.toLocaleString() || 0}
              </p>
            </div>
            <div className="text-right">
              <p className="text-black/80 text-sm">Min Bet</p>
              <p className="text-black font-bold text-xl">
                {rooms[roomId]?.minBet?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Game Iframe */}
      <div className="fixed inset-0 top-20 bg-black">
        <iframe
          src={gameUrl}
          className="w-full h-full border-0"
          title={`Buffalo Game Room ${roomId}`}
          allowFullScreen
          allow="autoplay; fullscreen; microphone; camera; payment; gamepad; accelerometer; gyroscope; web-share; cross-origin-isolated"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation allow-top-navigation-by-user-activation"
          loading="eager"
          referrerPolicy="no-referrer-when-downgrade"
          style={{ 
            border: 'none',
            background: 'transparent',
            width: '100vw',
            height: 'calc(100vh - 80px)',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 10
          }}
          onLoad={() => {
            console.log('Buffalo game iframe loaded successfully');
          }}
          onError={() => {
            console.log('Iframe failed to load - check VPN settings');
          }}
        />
        
        {/* Floating Back Button */}
        <div className="absolute top-4 left-4 z-20">
          <button
            onClick={onBack}
            className="bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 backdrop-blur-sm"
          >
            <span className="text-xl">←</span>
            <span>Back</span>
          </button>
        </div>
        
        {/* VPN Warning & Fallback */}
        <div className="absolute bottom-4 right-4 z-20">
          <div className="bg-yellow-400/90 hover:bg-yellow-400 text-black px-4 py-3 rounded-lg text-sm font-bold transition-all duration-300 backdrop-blur-sm shadow-lg max-w-xs">
            <div className="flex items-center space-x-2 mb-2">
              <span>⚠️</span>
              <span>Game not loading?</span>
            </div>
            <p className="text-xs mb-2">
              <strong>Tip:</strong> Disable VPN for Buffalo games
            </p>
            <button
              onClick={() => {
                window.open(gameUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
              }}
              className="w-full bg-black/20 hover:bg-black/40 px-3 py-1 rounded text-xs font-bold transition-all duration-300"
            >
              Open in New Window
            </button>
          </div>
        </div>
        
        {/* Direct Play Option */}
        <div className="absolute bottom-4 left-4 z-20">
          <button
            onClick={() => {
              // Direct redirect to game URL (exact provider format)
              window.location.href = gameUrl;
            }}
            className="bg-green-500/80 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 backdrop-blur-sm shadow-lg"
            title="Open game directly (bypass iframe)"
          >
            🎯 Direct Play
          </button>
        </div>
      </div>

    </div>
  );
};

export default BuffaloGameRoom;
