import { Routes, Route } from "react-router-dom";

import Header from "../components/Navbar/Header";
import ForgotPassword from "../components/Navbar/ForgotPassword";
import ResetPassword from "../components/Navbar/ResetPassword";


import Footerpage from "../components/Footer/Footerpage";

import Homepag from "../components/Banner/Homepag";
import Lookbuyer from "../components/Banner/Lookbuyer";
import Buyingcom from "../components/Banner/Buyingcom";
// import Legaladvitfunding from "../components/Banner/Legaladvitfunding";
// import Ownersbuy from "../components/Banner/Ownersbuy";
import Investormain from "../components/Banner/Investormain";
import AdvisoryServices from "../components/Banner/AdvisoryServices";
import Freeuplod from "../components/Banner/Freeuplod";
import Adviservices from "../components/Banner/Adviservices";
import ServicePage from "../components/Navbar/ServicePage";

import Contact from "../components/Navbar/Contact";
import PlotTips from "../components/Navbar/PlotTips";
import Commercialtips from "../components/Navbar/Commercialtips";
import Buyicommproperty from "../components/Buyingcommprope/Buyicommproperty";
import Residentialbuye from "../components/Buyingcommprope/Residentialbuye";
import Pgrentbuying from "../components/Buyingcommprope/Pgrentbuying";
import Investors from "../components/Buyingcommprope/Investors";
import Buyerleadform from "../components/Buyingcommprope/Buyerleadform";
import Filter from "../components/Buyingcommprope/Filter";

export default function PublicWebsiteLayout() {
  return (
    <>
      <Header />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Homepag />
              <Freeuplod />
              <Lookbuyer />
              <Buyingcom />
              {/* <Legaladvitfunding /> */}
              {/* <Ownersbuy /> */}
              <Investormain />
              <AdvisoryServices />
            </>
          }
        />
<Route path="/Forgot-password" element={<ForgotPassword />} />
<Route path="/ResetPassword" element={<ResetPassword />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/PlotTips" element={<PlotTips />} />
        <Route path="/Commercialtips" element={<Commercialtips />} />
        <Route path="/Freeuplod" element={<Freeuplod />} />
                <Route path="/Buyingcom" element={<Buyingcom />} />
                


        {/* Property Pages */}
        <Route path="/Buyicommproperty" element={<Buyicommproperty />} />
        <Route path="/Residentialbuye" element={<Residentialbuye />} />
        <Route path="/Pgrentbuying" element={<Pgrentbuying />} />
        <Route path="/Investors" element={<Investors />} />
        <Route path="/Buyerleadform" element={<Buyerleadform />} />
        <Route path="/Filter" element={<Filter />} />
        <Route path="/Adviservices" element={<Adviservices />} />
        <Route path="/service/:name" element={<ServicePage />} />

        

      </Routes>

      <Footerpage />
    </>
  );
}
