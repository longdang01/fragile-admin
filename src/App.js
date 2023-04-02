import logo from "./logo.svg";
import "./App.css";

import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./components/dashboard/Dashboard";
import Product from "./components/product/Product";
import Category from "./components/category/Category";
import SubCategory from "./components/subCategory/SubCategory";
import Brand from "./components/brand/Brand";
import Supplier from "./components/supplier/Supplier";
import Collection from "./components/collection/Collection";
import Invoice from "./components/invoice/Invoice";
import Slide from "./components/slide/Slide";
import Customer from "./components/customer/Customer";
import Staff from "./components/staff/Staff";
import Orders from "./components/orders/Orders";
import Login from "./components/user/Login";

import AuthGuard from "./guard/AuthGuard";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <AuthGuard>
                <Layout />
              </AuthGuard>
            }
          >
            <Route path="/" element={<Navigate to="/dashboard" />}></Route>
            {/* <Route index element={<Dashboard />}></Route> */}
            <Route path="dashboard" element={<Dashboard />}></Route>
            <Route path="product" element={<Product />}></Route>
            <Route path="category" element={<Category />}></Route>
            <Route path="subCategory" element={<SubCategory />}></Route>
            <Route path="brand" element={<Brand />}></Route>
            <Route path="supplier" element={<Supplier />}></Route>
            <Route path="collection" element={<Collection />}></Route>
            <Route path="invoice" element={<Invoice />}></Route>
            <Route path="orders" element={<Orders />}></Route>
            <Route path="customer" element={<Customer />}></Route>
            <Route path="staff" element={<Staff />}></Route>
            <Route path="slide" element={<Slide />}></Route>
          </Route>

          <Route path="login" element={<Login />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
