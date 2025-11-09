import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../contexts/LanguageContext';
import { AuthContext } from '../contexts/AuthContext';
import { GeneralContext } from '../contexts/GeneralContext';
import { toast } from 'react-toastify';
import { IoWalletOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { BsClock } from "react-icons/bs";
import { MdDelete, MdCheck } from "react-icons/md";
import ThreeDChooseOption from "../components/ThreeDChooseOption";
import BASE_URL from '../hooks/baseUrl';

const ThreeDPage = () => {
  const { content } = useContext(LanguageContext);
  const { user } = useContext(AuthContext);
  const { contacts } = useContext(GeneralContext);
  const navigate = useNavigate();

  // State management
  const [selectedDigits, setSelectedDigits] = useState([]);
  const [digitInput, setDigitInput] = useState('');
  const [amount, setAmount] = useState('');
  const [permutationAmount, setPermutationAmount] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [closingTime, setClosingTime] = useState('02:30:00 PM');
  const [showQuickSelect, setShowQuickSelect] = useState(false);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format date for display
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Add digit to selection
  const chooseNumber = () => {
    if (!digitInput.trim()) {
      toast.error('Please enter a 3-digit number');
      return;
    }

    const digit = digitInput.trim();
    
    // Validate 3-digit number
    if (!/^\d{3}$/.test(digit)) {
      toast.error('Please enter a valid 3-digit number (000-999)');
      return;
    }

    if (selectedDigits.includes(digit)) {
      toast.error('This number is already selected');
      return;
    }

    setSelectedDigits([...selectedDigits, digit]);
    setDigitInput('');
  };

  // Remove all selected digits
  const removeNumber = () => {
    setSelectedDigits([]);
    setAmount('');
    setPermutationAmount('');
  };

  // Generate all permutations of a 3-digit number
  const generatePermutations = (num) => {
    const digits = num.split('');
    const permutations = [];
    
    // Generate all possible arrangements
    for (let i = 0; i < digits.length; i++) {
      for (let j = 0; j < digits.length; j++) {
        for (let k = 0; k < digits.length; k++) {
          if (i !== j && i !== k && j !== k) {
            const perm = digits[i] + digits[j] + digits[k];
            if (!permutations.includes(perm)) {
              permutations.push(perm);
            }
          }
        }
      }
    }
    
    return permutations;
  };

  // Add permutation numbers (all possible arrangements of selected digits)
  const addPermutation = () => {
    if (selectedDigits.length === 0) {
      toast.error('Please select numbers first');
      return;
    }

    const newDigits = [...selectedDigits];
    selectedDigits.forEach(digit => {
      const permutations = generatePermutations(digit);
      permutations.forEach(perm => {
        if (!newDigits.includes(perm)) {
          newDigits.push(perm);
        }
      });
    });

    setSelectedDigits(newDigits);
    toast.success(`Permutation numbers added (${newDigits.length - selectedDigits.length} new numbers)`);
  };

  // Remove specific digit
  const removeSpecificDigit = (digitToRemove) => {
    setSelectedDigits(selectedDigits.filter(digit => digit !== digitToRemove));
  };

  // Add digits from quick selection
  const addDigits = (digits) => {
    const newDigits = [...selectedDigits];
    digits.forEach(digit => {
      if (!newDigits.includes(digit)) {
        newDigits.push(digit);
      }
    });
    setSelectedDigits(newDigits);
    toast.success(`${digits.length} numbers added`);
  };

  // Navigate to confirmation page
  const goToConfirm = () => {
    if (selectedDigits.length === 0) {
      toast.error('Please select at least one number');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    // Create amounts array for API
    const amounts = selectedDigits.map(digit => ({
      num: digit,
      amount: parseFloat(amount)
    }));

    // Calculate total amount
    const totalAmount = selectedDigits.length * parseFloat(amount);

    const betData = {
      totalAmount: totalAmount,
      amounts: amounts,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('threed_bets', JSON.stringify(betData));
    navigate('/3d/confirm');
  };

  return (
    <div className="min-h-screen bg-[#101223] text-white p-4">
      {/* Header */}
      <div className="max-w-md mx-auto mb-6">
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className="text-yellow-400 hover:text-yellow-300"
          >
            ← Back to Home
          </button>
          <h1 className="text-xl font-bold text-yellow-400">3D Betting</h1>
          <div className="w-8"></div>
        </div>
      </div>

      {/* Wallet Section */}
      <div className="max-w-md mx-auto mb-6">
        <div className="flex justify-around items-center bg-[#12486b] border-2 border-[#576265] rounded-3xl p-3">
          <IoWalletOutline className="w-6 h-6 text-white" />
          <span className="text-base font-medium">ပိုက်ဆံအိတ်</span>
          <span className="text-base font-bold font-['Lato']">
            {user?.balance ? `${user.balance.toLocaleString()} Kyats` : '0 Kyats'}
          </span>
          <button className="bg-white text-[#12486b] p-2 rounded-full">
            <FaPlus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Time Section */}
      {/* <div className="max-w-md mx-auto mb-4">
        <div className="flex justify-between items-center bg-[#12486b] rounded-lg p-3">
          <div className="flex items-center gap-2">
            <BsClock className="w-5 h-5 text-yellow-400" />
            <span className="text-sm">{formatDate(currentTime)}</span>
          </div>
          <div>
            <span className="text-sm text-yellow-400">ပိတ်ချိန် {closingTime}</span>
          </div>
        </div>
      </div> */}

      {/* Dream Number Section */}
      {/* <div className="max-w-md mx-auto mb-6">
        <div className="relative flex justify-center items-center bg-[#78d6c6] rounded-3xl p-4 shadow-lg" 
             style={{ boxShadow: '0px 0px 21px 0px rgba(240, 252, 172, 0.9)' }}>
          <span className="text-lg font-semibold text-gray-800">အိမ်မက်ဂဏန်း</span>
          <div className="absolute bottom-0 right-3 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-gray-800">3D</span>
          </div>
        </div>
      </div> */}

              {/* Quick Action Buttons */}
        <div className="max-w-md mx-auto mb-6">
          <div className="grid grid-cols-3 gap-4">
            <button 
              onClick={() => setShowQuickSelect(!showQuickSelect)}
              className="bg-[#12486b] hover:bg-[#0d3a5a] text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              အမြန်ရွေးရန်
            </button>
            <button 
              onClick={() => navigate('/3d/winner')}
              className="bg-[#12486b] hover:bg-[#0d3a5a] text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              3D Winner
            </button>
            <button 
              onClick={() => navigate('/3d/history')}
              className="bg-[#12486b] hover:bg-[#0d3a5a] text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              3D History
            </button>
          </div>
        </div>

      {/* Number Selection Section */}
      <div className="max-w-md mx-auto">
        <p className="text-center text-gray-300 mb-4 text-sm">ထိုးဂဏန်းရွေးမည်</p>
        
        {/* Digit Input */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            value={digitInput}
            onChange={(e) => setDigitInput(e.target.value)}
            placeholder="3-digit number"
            className="w-full p-3 border border-gray-500 bg-white text-gray-800 rounded-lg focus:outline-none focus:border-yellow-400"
            maxLength={3}
          />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="ဒဲ့ဂဏန်း ငွေပမာဏ"
            className="w-full p-3 border border-gray-500 bg-white text-gray-800 rounded-lg focus:outline-none focus:border-yellow-400"
          />
        </div>

        {/* Permutation Section */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <button
            onClick={addPermutation}
            className="flex justify-center items-center gap-2 bg-gray-400 hover:bg-gray-500 text-gray-800 py-3 px-4 rounded-lg font-medium transition-colors"
          >
            ပတ်လည်ထိုးမည်
          </button>
          {/* <input
            type="number"
            value={permutationAmount}
            onChange={(e) => setPermutationAmount(e.target.value)}
            placeholder="ပတ်လည်ငွေပမာဏ"
            className="w-full p-3 border border-gray-500 bg-white text-gray-800 rounded-lg focus:outline-none focus:border-yellow-400"
          /> */}
        </div>

        {/* Choose Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={chooseNumber}
            className="bg-[#12486b] hover:bg-[#0d3a5a] text-white py-3 px-8 rounded-lg font-medium transition-colors"
          >
            ရွေးမည်
          </button>
        </div>

                                   {/* Selected Numbers Display */}
          <div className="mb-24">
            <p className="text-gray-300 text-sm mb-3">ရွေးချယ်ထားသောဂဏန်းများ</p>
            <div className="min-h-[150px] border border-gray-500 rounded-lg p-4 bg-white bg-opacity-5">
              {selectedDigits.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No numbers selected</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedDigits.map((digit, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-[#12486b] text-white px-3 py-2 rounded-lg"
                    >
                      <span className="font-medium">{digit}</span>
                      <button
                        onClick={() => removeSpecificDigit(digit)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <MdDelete className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
      </div>

                           {/* Fixed Bottom Footer */}
        <div className="fixed bottom-20 left-0 right-0 bg-white p-4 border-t border-gray-200 rounded-lg mx-4 shadow-lg z-40">
          <div className="max-w-md mx-auto">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={removeNumber}
                className="flex justify-center items-center gap-2 py-3 px-4 border border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-50 transition-colors"
              >
                <MdDelete className="w-5 h-5" />
                ဖျက်မည်
              </button>
              <button
                onClick={goToConfirm}
                className="flex justify-center items-center gap-2 py-3 px-4 bg-[#12486b] text-white rounded-lg font-medium hover:bg-[#0d3a5a] transition-colors"
              >
                <MdCheck className="w-5 h-5" />
                ထိုးမည်
              </button>
            </div>
          </div>
        </div>

      {/* Quick Selection Modal */}
      {showQuickSelect && (
        <ThreeDChooseOption
          onClose={() => setShowQuickSelect(false)}
          onAddDigits={addDigits}
        />
      )}
    </div>
  );
};

export default ThreeDPage;
