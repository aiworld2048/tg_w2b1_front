import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../contexts/LanguageContext';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import { MdDelete, MdEdit, MdCheck } from 'react-icons/md';
import { IoWalletOutline } from "react-icons/io5";
import Spinner from '../components/Loader/Spinner';
import BASE_URL from '../hooks/baseUrl';

const ThreeDConfirmPage = () => {
  const { content } = useContext(LanguageContext);
  const { user, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  // State management
  const [total, setTotal] = useState(0);
  const [betData, setBetData] = useState([]);
  const [isValid, setIsValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editAmount, setEditAmount] = useState('');

  // Load bet data from localStorage
  useEffect(() => {
    try {
      const storedBets = localStorage.getItem('threed_bets');
      if (storedBets) {
        const parsedBets = JSON.parse(storedBets);
        if (parsedBets && parsedBets.amounts && parsedBets.amounts.length > 0) {
          setBetData([parsedBets]);
          setTotal(parsedBets.totalAmount || 0);
          setIsValid(true);
        } else {
          setIsValid(false);
          setTimeout(() => navigate('/3d'), 2000);
        }
      } else {
        setIsValid(false);
        setTimeout(() => navigate('/3d'), 2000);
      }
    } catch (error) {
      console.error('Error parsing bet data:', error);
      setIsValid(false);
      setTimeout(() => navigate('/3d'), 2000);
    }
  }, [navigate]);

  // Handle bet submission
  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please login to place bets');
      return;
    }

    if (total > user.balance) {
      toast.error('Insufficient balance');
      return;
    }

    setLoading(true);

    try {
             // API call for 3D betting
       const response = await fetch(`${BASE_URL}/threed-bet`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${localStorage.getItem('token')}`,
           'Accept': 'application/json',
           'X-Requested-With': 'XMLHttpRequest'
         },
         body: JSON.stringify({
           totalAmount: total,
           amounts: betData[0].amounts
         })
       });

      const responseData = await response.json();
      
      if (response.ok && responseData.status === "Request was successful.") {
        // Update user profile/balance
        try {
                     const profileRes = await fetch('/api/user', {
             method: 'GET',
             headers: {
               'Authorization': `Bearer ${localStorage.getItem('token')}`
             }
           });

          if (profileRes.ok) {
            const contentType = profileRes.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              const profileData = await profileRes.json();
              if (profileData && profileData.data && updateProfile) {
                updateProfile(profileData.data);
              }
            } else {
              console.warn('Profile response is not JSON, skipping profile update');
            }
          }
        } catch (profileError) {
          console.error('Error updating profile:', profileError);
        }

        // Clear localStorage and show success
        localStorage.removeItem('threed_bets');
        
        if (toast && typeof toast.success === 'function') {
          toast.success(responseData.message || 'ထီအောင်မြင်စွာ ထိုးပြီးပါပြီ။');
        }
        
        setTimeout(() => {
          navigate('/3d');
        }, 2000);
      } else {
        // Handle error response from backend
        const errorMessage = responseData.message || 'Failed to place bet';
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error placing bet:', error);
      if (toast && typeof toast.error === 'function') {
        toast.error(error.message || 'Failed to place bet. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Edit bet amount
  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditAmount(betData[index].amount.toString());
  };

  // Save edited amount
  const handleSaveEdit = () => {
    if (editingIndex !== null && editAmount) {
      const newAmount = parseFloat(editAmount);
      if (newAmount > 0) {
        const updatedBets = [...betData];
        // Update all amounts in the amounts array
        updatedBets[0].amounts.forEach(item => {
          item.amount = newAmount;
        });
        updatedBets[0].totalAmount = updatedBets[0].amounts.reduce((sum, item) => sum + item.amount, 0);
        
        setBetData(updatedBets);
        setTotal(updatedBets[0].totalAmount);
        
        // Update localStorage
        localStorage.setItem('threed_bets', JSON.stringify(updatedBets[0]));
      }
    }
    setEditingIndex(null);
    setEditAmount('');
  };

  // Delete bet
  const handleDelete = (index) => {
    const updatedBets = betData.filter((_, i) => i !== index);
    if (updatedBets.length === 0) {
      localStorage.removeItem('threed_bets');
      navigate('/3d');
    } else {
      setBetData(updatedBets);
      setTotal(updatedBets.reduce((sum, bet) => sum + bet.totalAmount, 0));
      localStorage.setItem('threed_bets', JSON.stringify(updatedBets[0]));
    }
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditAmount('');
  };

  if (!isValid) {
    return (
      <div className="min-h-screen bg-[#101223] flex items-center justify-center">
        <div className="text-center">
          <Spinner />
          <p className="text-white mt-4">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101223] text-white p-4">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Header */}
      <div className="max-w-md mx-auto mb-6">
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate('/3d')}
            className="text-yellow-400 hover:text-yellow-300"
          >
            ← Back to 3D
          </button>
          <h1 className="text-xl font-bold text-yellow-400">3D Bet Confirmation</h1>
          <div className="w-8"></div>
        </div>
      </div>

      {/* Wallet Info */}
      <div className="max-w-md mx-auto mb-6">
        <div className="flex justify-around items-center bg-[#12486b] border-2 border-[#576265] rounded-3xl p-3">
          <IoWalletOutline className="w-6 h-6 text-white" />
          <span className="text-base font-medium">ပိုက်ဆံအိတ်</span>
          <span className="text-base font-bold font-['Lato']">
            {user?.balance ? `${user.balance.toLocaleString()} Kyats` : '0 Kyats'}
          </span>
        </div>
      </div>

      {/* Bet Details */}
      <div className="max-w-md mx-auto mb-6">
        <div className="bg-[#1a1f35] rounded-lg p-4">
          <h2 className="text-lg font-semibold text-yellow-400 mb-4">Selected Numbers</h2>
          
          {betData.map((bet, index) => (
            <div key={index} className="mb-4 p-3 bg-[#12486b] rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">Numbers:</span>
                <div className="flex flex-wrap gap-1">
                  {bet.amounts.map((item, itemIndex) => (
                    <span
                      key={itemIndex}
                      className="bg-yellow-400 text-black px-2 py-1 rounded text-sm font-bold"
                    >
                      {item.num}
                    </span>
                  ))}
                </div>
              </div>
              
                             <div className="flex justify-between items-center mb-2">
                 <span className="text-sm text-gray-300">Amount per digit:</span>
                 {editingIndex === index ? (
                   <div className="flex items-center gap-2">
                     <input
                       type="number"
                       value={editAmount}
                       onChange={(e) => setEditAmount(e.target.value)}
                       className="w-20 px-2 py-1 text-black rounded text-sm"
                       min="1"
                     />
                     <button
                       onClick={handleSaveEdit}
                       className="text-green-400 hover:text-green-300"
                     >
                       <MdCheck className="w-4 h-4" />
                     </button>
                     <button
                       onClick={handleCancelEdit}
                       className="text-red-400 hover:text-red-300"
                     >
                       ✕
                     </button>
                   </div>
                 ) : (
                   <div className="flex items-center gap-2">
                     <span className="text-white font-semibold">
                       {bet.amounts[0].amount.toLocaleString()} Kyats per number
                     </span>
                     <button
                       onClick={() => handleEdit(index)}
                       className="text-blue-400 hover:text-blue-300"
                     >
                       <MdEdit className="w-4 h-4" />
                     </button>
                     <button
                       onClick={() => handleDelete(index)}
                       className="text-red-400 hover:text-red-300"
                     >
                       <MdDelete className="w-4 h-4" />
                     </button>
                   </div>
                 )}
               </div>

               <div className="flex justify-between items-center mb-2">
                 <span className="text-sm text-gray-300">Total numbers:</span>
                 <span className="text-white font-semibold">
                   {bet.amounts.length} numbers
                 </span>
               </div>

               <div className="flex justify-between items-center pt-2 border-t border-gray-600">
                 <span className="text-sm text-gray-300">Total:</span>
                 <span className="text-yellow-400 font-bold">
                   {bet.totalAmount.toLocaleString()} Kyats
                 </span>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total Summary */}
      <div className="max-w-md mx-auto mb-6">
        <div className="bg-[#1a1f35] rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-white">Total Bet Amount:</span>
            <span className="text-2xl font-bold text-yellow-400">
              {total.toLocaleString()} Kyats
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="max-w-md mx-auto mb-20">
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/3d')}
            className="flex justify-center items-center gap-2 py-3 px-4 border border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-50 transition-colors"
          >
            <MdDelete className="w-5 h-5" />
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || total === 0}
            className="flex justify-center items-center gap-2 py-3 px-4 bg-[#12486b] text-white rounded-lg font-medium hover:bg-[#0d3a5a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Spinner />
                Processing...
              </>
            ) : (
              <>
                <MdCheck className="w-5 h-5" />
                Confirm Bet
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThreeDConfirmPage;
