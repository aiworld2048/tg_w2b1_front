import React from 'react';

const ThreeDBetSlipDetailComponent = ({ slip, onBack }) => {
  if (!slip) return null;

  return (
    <div className="p-6 bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-auto text-white font-inter border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-teal-400">3D လောင်းကြေးစာရင်း အသေးစိတ်</h2>
        <button
          onClick={onBack}
          className="px-3 py-1 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600 text-sm"
        >
          ပြန်သွားမည်
        </button>
      </div>

      <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-700">
        <p className="text-lg font-semibold text-gray-300">
          <span className="text-teal-300">စလစ်နံပါတ်:</span> {slip.slip_no}
        </p>
        <p className="text-lg font-semibold text-gray-300">
          <span className="text-teal-300">ကစားသမား:</span> {slip.player_name}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
          <p className="text-md text-gray-400">စုစုပေါင်း လောင်းကြေးပမာဏ:</p>
          <p className="text-2xl font-bold text-white">{parseFloat(slip.total_bet_amount).toFixed(2)} Kyats</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
          <p className="text-md text-gray-400">Draw Session:</p>
          <p className="text-2xl font-bold text-white">{slip.draw_session}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
          <p className="text-md text-gray-400">အခြေအနေ:</p>
          <p className={`text-2xl font-bold capitalize ${slip.status === 'pending' ? 'text-yellow-400' : 'text-green-400'}`}>
            {slip.status}
          </p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
          <p className="text-md text-gray-400">ဂိမ်းရက်စွဲ:</p>
          <p className="text-xl font-bold text-white">{new Date(slip.game_date).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6 p-4 bg-gray-700 rounded-lg shadow-inner">
        <div>
          <p className="text-md text-gray-400">အရင်လက်ကျန်:</p>
          <p className="text-xl font-bold text-white">{parseFloat(slip.before_balance).toFixed(2)} Kyats</p>
        </div>
        <div>
          <p className="text-md text-gray-400">ပြီးနောက်လက်ကျန်:</p>
          <p className="text-xl font-bold text-white">{parseFloat(slip.after_balance).toFixed(2)} Kyats</p>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-teal-400 mb-4 text-center">လောင်းကြေးများ</h3>
      <div className="space-y-3">
        {slip.three_d_bets?.map((betItem) => (
          <div key={betItem.id} className="bg-gray-700 p-4 rounded-lg shadow-md flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold text-white">ဂဏန်း: <span className="text-yellow-300">{betItem.bet_number}</span></p>
              <p className="text-md text-gray-400">ပမာဏ: {parseFloat(betItem.bet_amount).toFixed(2)} Kyats</p>
              <p className="text-sm text-gray-500">Break Group: {betItem.break_group}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-white">
                အနိုင်/အရှုံး: {" "}
                <span className={`${betItem.win_lose ? 'text-green-400' : 'text-red-400'}`}>
                  {betItem.win_lose ? 'အနိုင်' : 'အရှုံး'}
                </span>
              </p>
              <p className="text-md text-gray-400">ဖြစ်နိုင်ခြေရှိသော ပေးချေမှု: {parseFloat(betItem.potential_payout).toFixed(2)} Kyats</p>
              <p className="text-sm text-gray-500">Permutation: {betItem.is_permutation ? 'Yes' : 'No'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThreeDBetSlipDetailComponent;
