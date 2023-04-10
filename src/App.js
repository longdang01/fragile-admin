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
import Lookbook from "./components/lookbook/Lookbook";
import Invoice from "./components/invoice/Invoice";
import Slide from "./components/slide/Slide";
import Customer from "./components/customer/Customer";
import Staff from "./components/staff/Staff";
import Orders from "./components/orders/Orders";
import NotFound from "./components/not-found/NotFound";
import Login from "./components/user/Login";

import AuthGuard from "./guard/AuthGuard";
import RoleGuard from "./guard/RoleGuard";
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
            <Route
              path="product"
              element={
                <RoleGuard roles={[1, 2]}>
                  <Product />
                </RoleGuard>
              }
            ></Route>
            <Route
              path="category"
              element={
                <RoleGuard roles={[1, 2]}>
                  <Category />
                </RoleGuard>
              }
            ></Route>
            <Route
              path="subCategory"
              element={
                <RoleGuard roles={[1, 2]}>
                  <SubCategory />
                </RoleGuard>
              }
            ></Route>
            <Route
              path="brand"
              element={
                <RoleGuard roles={[1, 2]}>
                  <Brand />
                </RoleGuard>
              }
            ></Route>
            <Route
              path="supplier"
              element={
                <RoleGuard roles={[1, 2]}>
                  <Supplier />
                </RoleGuard>
              }
            ></Route>
            <Route
              path="collection"
              element={
                <RoleGuard roles={[1, 2]}>
                  <Collection />
                </RoleGuard>
              }
            ></Route>

            <Route
              path="invoice"
              element={
                <RoleGuard roles={[1, 2]}>
                  <Invoice />
                </RoleGuard>
              }
            ></Route>
            <Route
              path="orders"
              element={
                <RoleGuard roles={[1, 3]}>
                  <Orders />
                </RoleGuard>
              }
            ></Route>
            <Route
              path="customer"
              element={
                <RoleGuard roles={[1, 3]}>
                  <Customer />
                </RoleGuard>
              }
            ></Route>
            <Route
              path="staff"
              element={
                <RoleGuard roles={[1]}>
                  <Staff />
                </RoleGuard>
              }
            ></Route>
            <Route
              path="slide"
              element={
                <RoleGuard roles={[1, 4]}>
                  <Slide />
                </RoleGuard>
              }
            ></Route>
            <Route
              path="lookbook"
              element={
                <RoleGuard roles={[1, 4]}>
                  <Lookbook />
                </RoleGuard>
              }
            ></Route>
            <Route path="not-found" element={<NotFound />}></Route>
          </Route>

          <Route path="login" element={<Login />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
