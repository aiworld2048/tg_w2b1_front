import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import BASE_URL from "../hooks/baseUrl";

const BuffaloGameRoom = ({ roomId, onBack }) => {
  const { user } = useContext(AuthContext);
  const [gameUrl, setGameUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gameLoadTimeout, setGameLoadTimeout] = useState(false);
  const [useIframe, setUseIframe] = useState(false); // Option to use iframe instead of direct navigation

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
          const url = data.Url || data.game_url;
          setGameUrl(url);
          
          // Buffalo games need direct navigation due to server connectivity requirements
          // The game tries to connect to version check servers (rwer5mfk2.africanbuffalo.vip:23000)
          // that may be blocked or refuse connections in iframes
          // Default to direct navigation for better compatibility
          if (!useIframe) {
            setTimeout(() => {
              if (url) {
                console.log('Redirecting to direct play for better game compatibility...');
                window.location.href = url;
              }
            }, 1000); // Small delay to show loading state, then redirect
          }
          
          // Set timeout to detect if game is stuck loading in iframe
          setTimeout(() => {
            setGameLoadTimeout(true);
          }, 5000);
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
          <p className="text-gray-300 mb-4">
            Preparing {rooms[roomId]?.name} for you
          </p>
          <p className="text-gray-400 text-sm">
            Redirecting to game...
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

      {/* Full Screen Game Iframe or Direct Navigation */}
      {useIframe ? (
        <div className="fixed inset-0 top-20 bg-black">
          <iframe
          src={gameUrl}
          className="w-full h-full border-0"
          title={`Buffalo Game Room ${roomId}`}
          allowFullScreen
          allow="autoplay; fullscreen; microphone; camera; payment; gamepad; accelerometer; gyroscope; web-share; cross-origin-isolated"
          // Removed sandbox restrictions to allow game's network requests
          // The game needs to make requests to version check servers
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
            // Check if game loaded properly after a delay
            setTimeout(() => {
              try {
                const iframe = document.querySelector('iframe[title*="Buffalo Game Room"]');
                if (iframe && iframe.contentWindow) {
                  // Try to detect if game is stuck on loading
                  console.log('Iframe content window accessible');
                }
              } catch (e) {
                console.warn('Cannot access iframe content (cross-origin):', e);
              }
            }, 3000);
          }}
          onError={(e) => {
            console.error('Iframe failed to load:', e);
            setError('Game failed to load. Please try opening in a new window or check your network connection.');
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
        {(gameLoadTimeout || error) && (
          <div className="absolute bottom-4 right-4 z-20">
            <div className="bg-yellow-400/90 hover:bg-yellow-400 text-black px-4 py-3 rounded-lg text-sm font-bold transition-all duration-300 backdrop-blur-sm shadow-lg max-w-xs">
              <div className="flex items-center space-x-2 mb-2">
                <span>⚠️</span>
                <span>Game not loading?</span>
              </div>
              <p className="text-xs mb-2">
                <strong>Tip:</strong> The game may need to connect to external servers. Buffalo games work better when opened directly.
              </p>
              <button
                onClick={() => {
                  if (gameUrl) {
                    window.open(gameUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
                  }
                }}
                className="w-full bg-black/20 hover:bg-black/40 px-3 py-1 rounded text-xs font-bold transition-all duration-300 mb-2"
              >
                Open in New Window
              </button>
              <button
                onClick={() => {
                  if (gameUrl) {
                    window.location.href = gameUrl;
                  }
                }}
                className="w-full bg-green-500/80 hover:bg-green-500 px-3 py-1 rounded text-xs font-bold transition-all duration-300"
              >
                🎯 Direct Play (Recommended)
              </button>
            </div>
          </div>
        )}
        
        {/* Direct Play Option */}
        <div className="absolute bottom-4 left-4 z-20">
          <button
            onClick={() => {
              // Direct redirect to game URL (exact provider format)
              // This bypasses iframe restrictions and allows full game functionality
              if (gameUrl) {
                window.location.href = gameUrl;
              }
            }}
            className="bg-green-500/80 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 backdrop-blur-sm shadow-lg"
            title="Open game directly (bypass iframe - recommended if game is not loading)"
          >
            🎯 Direct Play
          </button>
        </div>
        </div>
      ) : (
        // If not using iframe, show a message while redirecting
        <div className="fixed inset-0 top-20 bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-yellow-400 mb-2">Opening Game...</h2>
            <p className="text-gray-300 text-sm mb-4">
              Redirecting to {rooms[roomId]?.name}...
            </p>
            <button
              onClick={() => {
                setUseIframe(true);
                setGameLoadTimeout(false);
              }}
              className="text-gray-400 hover:text-gray-200 text-xs underline"
            >
              Use iframe instead
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuffaloGameRoom;
