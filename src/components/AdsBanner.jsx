import React, { useContext, useEffect } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { GeneralContext } from '../contexts/GeneralContext';

const AdsBanner = () => {
  const {ads_banner} = useContext(GeneralContext);
  
  const MySwal = withReactContent(Swal);
  const adsFire = () => {
    MySwal.fire({
      imageUrl: ads_banner?.img_url,
         
      imageHeight: 150,
      width: '100%',
      // text: ads_banner[0]?.text || '',
      confirmButtonText: 'OK',
      customClass: {
        popup: 'my-swal-popup',
        htmlContainer: 'my-swal-text'
      }
    })
  }



  useEffect(() => {
    if (
      !sessionStorage.getItem('adsShown') &&
      ads_banner &&
      ads_banner.img_url
    ) {
      adsFire();
      sessionStorage.setItem('adsShown', 'true');
    }
  }, [ads_banner]);

     return (
    <style>{`
   .my-swal-popup {
  padding: 0 !important;
  width: 90vw !important;
  max-width: 400px; 
}

.my-swal-popup img {
  display: block;
  width: 100%;
  height: auto;
  object-fit: cover;
  margin: 0 !important;
}

.swal2-actions {
  margin-top: 6px !important; 
}
    `}</style>);
}

export default AdsBanner