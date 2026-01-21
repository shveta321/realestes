import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicWebsite from "./route/PublicWebsite";
import Loging from "./components/Navbar/Loging";
import Signup from "./components/Navbar/Signup";

import ProtectedRoute from "./route/ProtectedRoute";
import AdminLayout from "./route/AdminLayout";
import Dashboard from "./Pages/admin/Dashboard";
import Users from "./Pages/admin/Users";

import SellerLayout from "./route/SellerLayout";
import Addproperty from "./Pages/seller/Addproperty";


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
          {/* <Route path="properties" element={<Properties />} />
  <Route path="inquiries" element={<Inquiries />} /> */}
        </Route>

        <Route
          path="/seller/*"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <SellerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
                              <Route path="Addproperty" element={<Addproperty />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
