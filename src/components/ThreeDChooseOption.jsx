import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';

const ThreeDChooseOption = ({ 
  onClose, 
  onAddDigits,
  onPermutation,
  onBreakGroup,
  onSingleDouble,
  onFrontBack,
  onPowerNumber,
  onTwentyNumbers
}) => {
  const [selectedOption, setSelectedOption] = useState(null);

  // Generate break groups based on sum of digits (0-27)
  const generateBreakGroups = () => {
    const groups = [];
    
    // Generate all 3-digit numbers from 000 to 999
    for (let i = 0; i <= 999; i++) {
      const num = i.toString().padStart(3, '0');
      const sum = num.split('').reduce((acc, digit) => acc + parseInt(digit), 0);
      
      // Find or create the break group
      let group = groups.find(g => g.name === `Break ${sum}`);
      if (!group) {
        group = { name: `Break ${sum}`, numbers: [] };
        groups.push(group);
      }
      group.numbers.push(num);
    }
    
    // Sort groups by break number
    return groups.sort((a, b) => {
      const aNum = parseInt(a.name.split(' ')[1]);
      const bNum = parseInt(b.name.split(' ')[1]);
      return aNum - bNum;
    });
  };

  const breakGroups = generateBreakGroups();

  const singleNumbers = ['001', '003', '005', '007', '009', '011', '013', '015', '017', '019', '021', '023', '025', '027', '029', '031', '033', '035', '037', '039', '041', '043', '045', '047', '049', '051', '053', '055', '057', '059', '061', '063', '065', '067', '069', '071', '073', '075', '077', '079', '081', '083', '085', '087', '089', '091', '093', '095', '097', '099'];
  
  const doubleNumbers = ['000', '002', '004', '006', '008', '010', '012', '014', '016', '018', '020', '022', '024', '026', '028', '030', '032', '034', '036', '038', '040', '042', '044', '046', '048', '050', '052', '054', '056', '058', '060', '062', '064', '066', '068', '070', '072', '074', '076', '078', '080', '082', '084', '086', '088', '090', '092', '094', '096', '098'];

  const frontNumbers = [
    { name: 'Front 0', numbers: ['000', '001', '002', '003', '004', '005', '006', '007', '008', '009'] },
    { name: 'Front 1', numbers: ['100', '101', '102', '103', '104', '105', '106', '107', '108', '109'] },
    { name: 'Front 2', numbers: ['200', '201', '202', '203', '204', '205', '206', '207', '208', '209'] },
    { name: 'Front 3', numbers: ['300', '301', '302', '303', '304', '305', '306', '307', '308', '309'] },
    { name: 'Front 4', numbers: ['400', '401', '402', '403', '404', '405', '406', '407', '408', '409'] },
    { name: 'Front 5', numbers: ['500', '501', '502', '503', '504', '505', '506', '507', '508', '509'] },
    { name: 'Front 6', numbers: ['600', '601', '602', '603', '604', '605', '606', '607', '608', '609'] },
    { name: 'Front 7', numbers: ['700', '701', '702', '703', '704', '705', '706', '707', '708', '709'] },
    { name: 'Front 8', numbers: ['800', '801', '802', '803', '804', '805', '806', '807', '808', '809'] },
    { name: 'Front 9', numbers: ['900', '901', '902', '903', '904', '905', '906', '907', '908', '909'] }
  ];

  const backNumbers = [
    { name: 'Back 0', numbers: ['000', '100', '200', '300', '400', '500', '600', '700', '800', '900'] },
    { name: 'Back 1', numbers: ['001', '101', '201', '301', '401', '501', '601', '701', '801', '901'] },
    { name: 'Back 2', numbers: ['002', '102', '202', '302', '402', '502', '602', '702', '802', '902'] },
    { name: 'Back 3', numbers: ['003', '103', '203', '303', '403', '503', '603', '703', '803', '903'] },
    { name: 'Back 4', numbers: ['004', '104', '204', '304', '404', '504', '604', '704', '804', '904'] },
    { name: 'Back 5', numbers: ['005', '105', '205', '305', '405', '505', '605', '705', '805', '905'] },
    { name: 'Back 6', numbers: ['006', '106', '206', '306', '406', '506', '606', '706', '806', '906'] },
    { name: 'Back 7', numbers: ['007', '107', '207', '307', '407', '507', '607', '707', '807', '907'] },
    { name: 'Back 8', numbers: ['008', '108', '208', '308', '408', '508', '608', '708', '808', '908'] },
    { name: 'Back 9', numbers: ['009', '109', '209', '309', '409', '509', '609', '709', '809', '909'] }
  ];

  const powerNumbers = ['000', '111', '222', '333', '444', '555', '666', '777', '888', '999'];

  const twentyNumbers = [
    '000', '001', '002', '003', '004', '005', '006', '007', '008', '009',
    '010', '011', '012', '013', '014', '015', '016', '017', '018', '019'
  ];

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleAddNumbers = (numbers) => {
    if (onAddDigits) {
      onAddDigits(numbers);
    }
    onClose();
  };

  const renderOptionContent = () => {
    switch (selectedOption) {
             case 'break':
         return (
           <div className="space-y-2">
             <h3 className="text-lg font-semibold text-yellow-400 mb-3">Break Groups (Sum of Digits)</h3>
             <p className="text-sm text-gray-300 mb-3">
               Example: 123 = 1+2+3 = 6 (Break 6), 190 = 1+9+0 = 10 (Break 10)
             </p>
             <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
               {breakGroups.map((group, index) => (
                 <button
                   key={index}
                   onClick={() => handleAddNumbers(group.numbers)}
                   className="p-2 bg-[#12486b] hover:bg-[#0d3a5a] rounded-lg text-white text-xs transition-colors"
                   title={`${group.name}: ${group.numbers.length} numbers`}
                 >
                   {group.name}
                   <div className="text-xs text-gray-300">({group.numbers.length})</div>
                 </button>
               ))}
             </div>
           </div>
         );

      case 'single':
        return (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-yellow-400 mb-3">Single Numbers</h3>
            <button
              onClick={() => handleAddNumbers(singleNumbers)}
              className="w-full p-3 bg-[#12486b] hover:bg-[#0d3a5a] rounded-lg text-white font-medium transition-colors"
            >
              Add All Single Numbers ({singleNumbers.length})
            </button>
          </div>
        );

      case 'double':
        return (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-yellow-400 mb-3">Double Numbers</h3>
            <button
              onClick={() => handleAddNumbers(doubleNumbers)}
              className="w-full p-3 bg-[#12486b] hover:bg-[#0d3a5a] rounded-lg text-white font-medium transition-colors"
            >
              Add All Double Numbers ({doubleNumbers.length})
            </button>
          </div>
        );

      case 'front':
        return (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-yellow-400 mb-3">Front Numbers</h3>
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
              {frontNumbers.map((group, index) => (
                <button
                  key={index}
                  onClick={() => handleAddNumbers(group.numbers)}
                  className="p-2 bg-[#12486b] hover:bg-[#0d3a5a] rounded-lg text-white text-sm transition-colors"
                >
                  {group.name}
                </button>
              ))}
            </div>
          </div>
        );

      case 'back':
        return (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-yellow-400 mb-3">Back Numbers</h3>
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
              {backNumbers.map((group, index) => (
                <button
                  key={index}
                  onClick={() => handleAddNumbers(group.numbers)}
                  className="p-2 bg-[#12486b] hover:bg-[#0d3a5a] rounded-lg text-white text-sm transition-colors"
                >
                  {group.name}
                </button>
              ))}
            </div>
          </div>
        );

      case 'power':
        return (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-yellow-400 mb-3">Power Numbers</h3>
            <button
              onClick={() => handleAddNumbers(powerNumbers)}
              className="w-full p-3 bg-[#12486b] hover:bg-[#0d3a5a] rounded-lg text-white font-medium transition-colors"
            >
              Add All Power Numbers ({powerNumbers.length})
            </button>
          </div>
        );

      case 'twenty':
        return (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-yellow-400 mb-3">First 20 Numbers</h3>
            <button
              onClick={() => handleAddNumbers(twentyNumbers)}
              className="w-full p-3 bg-[#12486b] hover:bg-[#0d3a5a] rounded-lg text-white font-medium transition-colors"
            >
              Add First 20 Numbers ({twentyNumbers.length})
            </button>
          </div>
        );

             default:
         return (
           <div className="grid grid-cols-2 gap-3">
             <button
               onClick={() => handleOptionSelect('break')}
               className="p-3 bg-[#12486b] hover:bg-[#0d3a5a] rounded-lg text-white font-medium transition-colors"
             >
               Break Groups (0-27)
             </button>
            <button
              onClick={() => handleOptionSelect('single')}
              className="p-3 bg-[#12486b] hover:bg-[#0d3a5a] rounded-lg text-white font-medium transition-colors"
            >
              Single Numbers
            </button>
            <button
              onClick={() => handleOptionSelect('double')}
              className="p-3 bg-[#12486b] hover:bg-[#0d3a5a] rounded-lg text-white font-medium transition-colors"
            >
              Double Numbers
            </button>
            <button
              onClick={() => handleOptionSelect('front')}
              className="p-3 bg-[#12486b] hover:bg-[#0d3a5a] rounded-lg text-white font-medium transition-colors"
            >
              Front Numbers
            </button>
            <button
              onClick={() => handleOptionSelect('back')}
              className="p-3 bg-[#12486b] hover:bg-[#0d3a5a] rounded-lg text-white font-medium transition-colors"
            >
              Back Numbers
            </button>
            <button
              onClick={() => handleOptionSelect('power')}
              className="p-3 bg-[#12486b] hover:bg-[#0d3a5a] rounded-lg text-white font-medium transition-colors"
            >
              Power Numbers
            </button>
            <button
              onClick={() => handleOptionSelect('twenty')}
              className="p-3 bg-[#12486b] hover:bg-[#0d3a5a] rounded-lg text-white font-medium transition-colors"
            >
              First 20
            </button>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1f35] rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-yellow-400">Quick Select Options</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <MdClose className="w-6 h-6" />
          </button>
        </div>

        {selectedOption && (
          <button
            onClick={() => setSelectedOption(null)}
            className="mb-4 text-yellow-400 hover:text-yellow-300 text-sm"
          >
            ← Back to Options
          </button>
        )}

        {renderOptionContent()}
      </div>
    </div>
  );
};

export default ThreeDChooseOption;
