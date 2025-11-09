import { createContext, useMemo, useContext } from "react";
import BASE_URL from "../hooks/baseUrl";
import useFetch from "../hooks/useFetch";
import { AuthContext } from "./AuthContext";


const GeneralContext = createContext({
    banners: null,
    banner_text: null,
    ads_banner: null,
    promotions: null,
    contacts: null,
    loading: false
});




const GeneralContextProvider = ({ children }) => {
    const { auth } = useContext(AuthContext);
    
    // Public endpoints - always fetch
    const { data: banner, loading1 } = useFetch(BASE_URL + "/banner");
    const { data: ads_banner, loading2 } = useFetch(BASE_URL + "/popup-ads-banner");
    const { data: banner_text, loading3 } = useFetch(BASE_URL + "/banner_Text");
    
    // Protected endpoints - only fetch when authenticated
    const { data: promotions, loading4} = useFetch(auth ? BASE_URL + "/promotion" : null);
    const { data: contacts, loading5} = useFetch(auth ? BASE_URL + "/contact" : null);
   
    // console.log('adsBanner',ads_banner);
    // Debug logging
    // console.log('GeneralContext Debug:', {
    //     banner,
    //     bannerLength: banner?.length,
    //     ads_banner,
    //     banner_text,
    //     promotions,
    //     contacts,
    //     loading1,
    //     loading2,
    //     loading3,
    //     loading4,
    //     loading5
    // });

   const loading = loading1 || loading2 || loading3 || loading4 || loading5;

    const value = useMemo(() => ({
        banners: banner || null,
        banner_text: banner_text || null,
        ads_banner: ads_banner || null,
        promotions: promotions || null,
        contacts: contacts || null,
        loading
    }), [banner, banner_text, ads_banner, promotions, contacts, loading]);


    return (
        <GeneralContext.Provider value={value}>
            {children}
        </GeneralContext.Provider>
    );
};

export { GeneralContext, GeneralContextProvider };
