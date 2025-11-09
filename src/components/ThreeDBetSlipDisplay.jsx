import React, { useMemo, useState } from 'react';
import useFetch from '../hooks/useFetch';
import BASE_URL from '../hooks/baseUrl.jsx';
import '../tailwind_css.css';
import ThreeDBetSlipDetailComponent from './ThreeDBetSlipDetailComponent.jsx';

const ThreeDBetSlipDisplay = () => {
  const { data, loading, error } = useFetch(`${BASE_URL}/threed-bet/history`);
  const [selectedSlipId, setSelectedSlipId] = useState(null);

  const slips = useMemo(() => {
    if (data && data.slips) {
      return Array.isArray(data.slips) ? data.slips : [];
    }
    return [];
  }, [data]);
  
  const selectedSlip = useMemo(
    () => slips.find((s) => s.id === selectedSlipId) || null,
    [slips, selectedSlipId]
  );

  if (loading) return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg text-white text-center">
      <p className="text-xl text-blue-400">Loading...</p>
    </div>
  );

  if (error) return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg text-white text-center">
      <p className="text-xl text-red-400">{error}</p>
    </div>
  );

  if (!slips.length) return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg text-white text-center">
      <p className="text-xl text-yellow-400">လောင်းကြေးစာရင်း အချက်အလက် မရှိပါ။</p>
    </div>
  );

  if (selectedSlip) {
    return (
      <ThreeDBetSlipDetailComponent slip={selectedSlip} onBack={() => setSelectedSlipId(null)} />
    );
  }

  return (
    <div className="p-6 bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-auto text-white font-inter border border-gray-700">
      <h2 className="text-2xl font-bold text-teal-400 mb-4">3D စလစ်စာရင်း</h2>
      <div className="space-y-3">
        {slips.map((slip) => (
          <button
            key={slip.id}
            onClick={() => setSelectedSlipId(slip.id)}
            className="w-full text-left bg-gray-700 hover:bg-gray-600 transition-colors p-4 rounded-lg flex items-center justify-between"
          >
            <div>
              <p className="text-white font-semibold">စလစ်နံပါတ်: <span className="text-yellow-300">{slip.slip_no}</span></p>
              <p className="text-gray-300 text-sm">ကစားသမား: {slip.player_name} • ငွေပမာဏ: {parseFloat(slip.total_bet_amount).toFixed(2)} Kyats</p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-semibold capitalize ${slip.status === 'pending' ? 'text-yellow-400' : 'text-green-400'}`}>{slip.status}</p>
              <p className="text-gray-400 text-xs">{new Date(slip.created_at).toLocaleDateString()} {new Date(slip.created_at).toLocaleTimeString()}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThreeDBetSlipDisplay;
