import "./App.css";
// import ListCustomizations from "./Pages/ListCustomizations";
// import ShopNow from "./Pages/ShopNow";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Shop from "./Pages/Shop/Shop";
import ItemDetails from "./Pages/ItemDetails/ItemDetails";
import Shipping from "./Pages/Shipping/Shipping";
import Success from "./Pages/SuccessPage/Success";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Authentication/Login";
import Profile from "./Pages/Profile/Profile";
import MyOrders from "./Pages/Profile/MyOrders";
import Settings from "./Pages/Profile/Settings";
import Repair from "./Pages/Profile/Repair";
import UserRepairList from "./Pages/Profile/UserRepairList";
import MyCustomization from "./Pages/Profile/MyCustomization";
import UpdateRepair from "./Pages/Profile/UpdateRepair";
import UpdateReview from "./Pages/Review/updateReview";
import ViewSingleItem from "./Pages/Rentings/ViewSingleItem.jsx";
import ProductCheckout from "./Pages/ProductCheckout/ProductCheckout.jsx";
import RentingStore from "./Pages/Rentings/RentingStore.jsx";
import ViewMyOrders from "./Pages/Profile/ViewMyOrders.jsx";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/item/:id" element={<ItemDetails />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/payment/success" element={<Success />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/repair" element={<Repair />} />
          <Route path="/my-repairs" element={<UserRepairList />} />
          <Route path="/my-repairs/update/:id" element={<UpdateRepair />} />
          <Route path="/my-customization" element={<MyCustomization />} />
          <Route path="/update-review/:id" element={<UpdateReview />} />
          <Route path="/viewSingleItem/:id" element={<ViewSingleItem />} />
          <Route path="/checkout/:id" element={<ProductCheckout />} />
          <Route path="/rentingStore" element={<RentingStore />} />
          <Route path="/viewMyOrders" element={<ViewMyOrders />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
