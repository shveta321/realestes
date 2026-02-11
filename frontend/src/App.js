import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicWebsite from "./route/PublicWebsite";
import Loging from "./components/Navbar/Loging";
import Signup from "./components/Navbar/Signup";

import ProtectedRoute from "./route/ProtectedRoute";
import AdminLayout from "./route/AdminLayout";
import Dashboard from "./Pages/admin/Dashboard";
import Users from "./Pages/admin/Users";
// import Properties from "./Pages/admin/Properties";
import Investorprop from "./Pages/admin/Investorprop";
import Inquiries from "./Pages/admin/Inquiries";
import Admproperties from "./Pages/admin/Admproperties";


import SellerLayout from "./route/SellerLayout";
import MyProperties from "./Pages/seller/MyProperties";
// import Addproperty from "./Pages/seller/Addproperty";
import PropertyForm from "./Pages/seller/PropertyForm";
import SellerDashboard from "./Pages/seller/SellerDashboard";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<PublicWebsite />} />
        <Route path="/loging" element={<Loging />} />
        <Route path="/Signup" element={<Signup />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          {/* <Route path="properties" element={<Properties />} /> */}
          <Route path="Investorprop" element={<Investorprop />} />
          <Route path="Inquiries" element={<Inquiries />} />
          <Route path="Admproperties" element={<Admproperties />} />

          
        </Route>

        <Route
          path="/seller/*"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <SellerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="SellerDashboard" element={<SellerDashboard />} />
          {/* <Route path="properties" element={<Properties />} /> */}
          <Route path="Properties" element={<MyProperties />} />
          {/* <Route path="Addproperty" element={<Addproperty />} /> */}
                    <Route path="propertyForm" element={<PropertyForm />} />


        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
