import { createBrowserRouter } from "react-router-dom";
 import HomePage from "../pages/Home";
// import LoginPage from "../pages/Login";
// import RegisterPage from "../pages/Register";
import GamesPage from "../pages/Games";
import Promotion from "../pages/Promotion";
import RankingPage from "../pages/Ranking";
import ContactPage from "../pages/Contact";
import InformationPage from "../pages/Information";
import AboutPage from "../pages/About";
import DemoPlayPage from "../pages/DemoPlay";
import Layout from "../components/Layout";
import ReelsPage from "../pages/ReelsPage";
import AdsVideo from "../pages/AdsVideo";
import DigitBetGame from "../components/desktop/Digits/DigitBetGame";
import ShanGame from "../components/desktop/Shan/ShanGame";
import PoneWineGame from "../components/desktop/ponewine/PoneWineGame";
import TwoDPage from "../pages/TwoDPage";
import TwoDBetPage from "../pages/TwoDBetPage";
import TwoDConfirmPage from "../pages/TwoDConfirmPage";
import ThreeDPage from "../pages/ThreeDPage";
import ThreeDConfirmPage from "../pages/ThreeDConfirmPage";
import ThreeDBetSlipDisplay from "../components/ThreeDBetSlipDisplay";
import WalletPage from "../pages/Wallet";
import InternalTransfer from "../pages/Slot/InternalTransfer";
import WalletHistoryPage from "../pages/Slot/WalletHistory";
import TransactionsPage from "../pages/Slot/Transaction";
import ExchangeTranLog from "../components/desktop/ExchangeTranLog";
import MorningBetSlipDisplay from "../components/MorningBetSlipDisplay";
import EveningBtSlipDisplay from "../components/EveningBtSlipDisplay";
import TwoDDailyWinner from "../components/TwoDDailyWinner";
import ThreeDWinner from "../components/ThreeDWinner";
import BuffaloGame from "../components/BuffaloGame";



export const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: <HomePage />
        },
        {
          path: '/reels',
          element: <ReelsPage />
        },
        {
          path: '/games',
          element: <GamesPage />
        },
        {
          path: '/demo-play',
          element: <DemoPlayPage />
        },
        {
          path: '/ranking',
          element: <RankingPage />
        },
        {
          path: '/promotion',
          element: <Promotion />
        },
        {
          path: '/contact',
          element: <ContactPage />
        },
        {
          path: '/information',
          element: <InformationPage />
        },
        {
          path: '/about',
          element: <AboutPage />
        },
        {
          path: '/ads-video',
          element: <AdsVideo />
        },
        {
          path: '/digitbet',
          element: <DigitBetGame />
        },
        {
          path: '/shan',
          element: <ShanGame />
        },
        {
          path: '/ponewine',
          element: <PoneWineGame />
        },
        {
          path: '/buffalo',
          element: <BuffaloGame />
        },

        {
          path: '/2d',
          element: <TwoDPage />
        },
        {
          path: '/2d/bet',
          element: <TwoDBetPage />
        },
        {
          path: '/2d/confirm',
          element: <TwoDConfirmPage />
        },
        {
          path: '/3d',
          element: <ThreeDPage />
        },
        {
          path: '/3d/confirm',
          element: <ThreeDConfirmPage />
        },
        {
          path: '/3d/history',
          element: <ThreeDBetSlipDisplay />
        },
         {
          path: '/3d/winner',
          element: <ThreeDWinner />
        },
        {
          path: '/morning-bet-slip',
          element: <MorningBetSlipDisplay />
        },
        {
          path: '/evening-bet-slip',
          element: <EveningBtSlipDisplay />
        },
        {
          path: '/2d/daily-winner',
          element: <TwoDDailyWinner />
        },
        {
          path : '/wallet',
          element : <WalletPage />
      },
      {
          path: '/wallet/internal-transfer',
          element: <InternalTransfer />
      },
      {
          path:'/wallet-history',
          element:<WalletHistoryPage/>
      },
      {
        path:'/transactions',
        element:<TransactionsPage/>
      },
      {
        path: '/exchange-log',
        element: <ExchangeTranLog />
      }
      ]
    },
    // {
    //   path: '/login',
    //   element: <LoginPage />
    // },
    // {
    //   path: '/register',
    //   element: <RegisterPage />
    // },
  ]);