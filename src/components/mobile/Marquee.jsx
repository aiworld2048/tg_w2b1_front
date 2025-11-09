import React, { useContext } from 'react'
import { Volume2Icon } from 'lucide-react'
import { GeneralContext } from '../../contexts/GeneralContext'

const Marquee = () => {
  const { banner_text } = useContext(GeneralContext);
  return (
    <div className="w-full flex items-center gap-2 mt-1 mb-2 px-2 py-2 lg:px-4 lg:py-3 shadow-lg rounded-xl border-2 border-transparent p-1" style={{
  background: 'linear-gradient(to right, #63a3ff, #b6deff)'
}}>
      <div className="flex items-center w-full px-3 py-1 bg-black/40 rounded-lg shadow-inner border border-yellow-400/40">
        <Volume2Icon className="text-yellow-400 mr-2 shrink-0" size={22} />
        <marquee className="w-full text-white font-semibold tracking-wide text-sm" behavior="" direction="left">
          {banner_text?.[0]?.text}
        </marquee>
      </div>
    </div>
  )
}

export default Marquee
