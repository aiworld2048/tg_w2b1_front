import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import SmallSpinner from './SmallSpinner';
import { AuthContext } from '../../contexts/AuthContext';
import { LanguageContext } from '../../contexts/LanguageContext';
import ChangePassword from './ChangePassword';
import BASE_URL from '../../hooks/baseUrl';
import { IoMdClose } from 'react-icons/io';
import { FaExchangeAlt } from 'react-icons/fa';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const { content } = useContext(LanguageContext);

  // Exchange modal state
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [exchangeType, setExchangeType] = useState('mainToGame');
  const [exchangeAmount, setExchangeAmount] = useState('');
  const [exchangeLoading, setExchangeLoading] = useState(false);
  const [exchangeError, setExchangeError] = useState('');

  // Exchange API logic
  const handleExchange = async () => {
    setExchangeError('');
    if (!exchangeAmount || Number(exchangeAmount) <= 0) {
      setExchangeError('Please enter a valid amount');
      return;
    }
    setExchangeLoading(true);
    const url = exchangeType === 'mainToGame'
      ? `${BASE_URL}/exchange-main-to-game`
      : `${BASE_URL}/exchange-game-to-main`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ amount: Number(exchangeAmount) }),
      });
      const data = await res.json();
      if (res.ok && data.status === 'Request was successful.') {
        // Refresh user profile
        const profileRes = await fetch(`${BASE_URL}/user`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        const profileData = await profileRes.json();
        if (profileData && profileData.data) updateProfile(profileData.data);
        setShowExchangeModal(false);
        setExchangeAmount('');
        setExchangeType('mainToGame');
      } else {
        setExchangeError(data.message || 'Exchange failed!');
      }
    } catch (e) {
      setExchangeError('Network error. Please try again.');
    }
    setExchangeLoading(false);
  };

  return (
    <div>
          {/* Balances */}
      <div className="flex justify-center mb-4">
        <div className="w-full sm:w-auto max-w-xs bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-xl px-6 py-3 text-center font-bold shadow-lg">
          {content?.profile?.game_balance || 'Game Balance'}:
          <span className="text-lg ml-2">
      {user?.balance !== undefined && user?.balance !== null ? Number(user.balance).toLocaleString() : 0}
    </span>
        </div>
      </div>
      {/* Exchange Modal */}
      {showExchangeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm relative flex flex-col items-center">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-black focus:outline-none"
              onClick={() => setShowExchangeModal(false)}
              aria-label="Close"
            >
              <IoMdClose size={24} />
            </button>
            <div className="flex flex-col items-center mb-4">
              <FaExchangeAlt className="text-yellow-400 text-3xl mb-1" />
              <h3 className="text-xl font-bold text-gray-800">Exchange Balance</h3>
            </div>
            <div className="flex w-full justify-between mb-4">
              <div className="flex flex-col items-center flex-1">
                <span className="text-xs text-gray-500">Main</span>
                <span className="font-bold text-lg text-yellow-500">{user?.main_balance}</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <span className="text-xs text-gray-500">Game</span>
                <span className="font-bold text-lg text-blue-500">{user?.balance}</span>
              </div>
            </div>
            <div className="flex w-full justify-center gap-2 mb-4">
              <button
                className={`flex-1 py-2 rounded-lg font-semibold border transition text-sm ${exchangeType === 'mainToGame' ? 'bg-yellow-400 text-black border-yellow-400 shadow' : 'bg-gray-100 text-gray-600 border-gray-200'}`}
                onClick={() => setExchangeType('mainToGame')}
                type="button"
                aria-label="Main to Game"
              >
                Main → Game
              </button>
              <button
                className={`flex-1 py-2 rounded-lg font-semibold border transition text-sm ${exchangeType === 'gameToMain' ? 'bg-blue-500 text-white border-blue-500 shadow' : 'bg-gray-100 text-gray-600 border-gray-200'}`}
                onClick={() => setExchangeType('gameToMain')}
                type="button"
                aria-label="Game to Main"
              >
                Game → Main
              </button>
            </div>
            <div className="w-full mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                min="1"
                inputMode="numeric"
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-lg focus:outline-none focus:border-yellow-400 transition"
                value={exchangeAmount}
                onChange={e => setExchangeAmount(e.target.value)}
                placeholder="Enter amount"
                autoFocus
              />
            </div>
            {exchangeError && <div className="text-red-500 text-sm mb-2 w-full text-center">{exchangeError}</div>}
            <div className="flex w-full gap-2 mt-2">
              <button
                className="flex-1 bg-gray-200 text-gray-700 rounded-lg py-2 font-semibold hover:bg-gray-300 transition"
                onClick={() => setShowExchangeModal(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className={`flex-1 rounded-lg py-2 font-semibold flex items-center justify-center transition ${(!exchangeAmount || exchangeLoading) ? 'bg-yellow-200 text-gray-400 cursor-not-allowed' : 'bg-yellow-400 text-black hover:bg-yellow-500'}`}
                onClick={handleExchange}
                type="button"
                disabled={!exchangeAmount || exchangeLoading}
                aria-disabled={!exchangeAmount || exchangeLoading}
              >
                {exchangeLoading && <span className="loader mr-2"></span>}
                Exchange
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Profile Info */}
        <form className="bg-white/10 backdrop-blur-sm px-4 py-5 rounded-2xl border border-white/20 mb-4">
  <div className="flex justify-between items-center mb-4">
    <h5 className="font-bold text-white text-lg">
      {content?.profile?.my_profile}
    </h5>
  </div>

  <div className="grid grid-cols-12 gap-y-3 text-sm">
    {/* Username */}
    <div className="col-span-5 text-gray-300 font-medium">
      {content?.profile?.username} :
    </div>
    <div className="col-span-7 text-white">
      {user?.user_name}
    </div>

    {/* Full Name */}
    <div className="col-span-5 text-gray-300 font-medium">
      {content?.profile?.full_name} :
    </div>
    <div className="col-span-7 text-white">
      {user?.name}
    </div>

    {/* Phone */}
    <div className="col-span-5 text-gray-300 font-medium">
      {content?.profile?.phone} :
    </div>
    <div className="col-span-7 text-white">
      {user?.phone ?? ""}
    </div>
  </div>
</form>
      {/* Change Password Form */}
      <ChangePassword />
    </div>
  )
}

export default Profile
