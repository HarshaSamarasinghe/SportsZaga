import "./App.css";
import AddItem from "./Pages/AddItem";
import ListItems from "./Pages/ListItems";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UpdateItem from "./Pages/UpdateItem";
import ListOrders from "./Pages/ListOrders";
import ListUsers from "./Pages/ListUsers";
import AdminCustomizeList from "./Pages/AdminCustomizeList";
import UpdateCustomization from "./Pages/UpdateCustomization";
import ListRepairs from "./Pages/ListRepairs";
import UpdateRepair from "./Pages/UpdateRepair";
import AdminHomePage from "./Pages/AdminHomePage/AdminHomePage.jsx";
import Sidebar from "./Components/SideBar.jsx";
import CreateRentingItems from "./Pages/CreateRentingItems/CreateRentingItems.jsx";
import AdminViewRentingStore from "./Pages/ViewRentingStore.jsx";
import RentedOrdersList from "./Pages/RentedOrdersList.jsx";
import GenerateCusReports from "./Pages/CusReportsGeneration/CusReportsGeneration.jsx";
import GenerateItemReport from "./Pages/GenerateItemReport/GenerateItemReport.jsx";
import GenerateRepairReports from "./Pages/GenerateRepairReport/GenerateRepairReport.jsx";
import GenerateRentingReports from "./Pages/GenerateRentingReports/GenerateRentingReports.jsx";
import ReviewList from "./Pages/Reviews.jsx";
import GenerateReviewReports from "./Pages/GenerateReviewReports/GenerateReviewReports.jsx";
// import AddRentingItem from "./Pages/AddRentingItem/AddRentingItem.jsx";

function App() {
  return (
    <Router>
      <div style={{ display: "flex", height: "100vh" }}>
        {/* Sidebar with fixed width */}
        <div style={{ width: "250px", flexShrink: 0 }}>
          <Sidebar />
        </div>

        {/* Main content takes remaining space */}
        <div style={{ flexGrow: 1, padding: "20px" }}>
          <Routes>
            <Route path="/" element={<AdminHomePage />} />

            {/* Admin Pages of renting management */}
            <Route path="/create-renting" element={<CreateRentingItems />} />
            <Route
              path="/view-renting-store"
              element={<AdminViewRentingStore />}
            />
            <Route path="/rented-orders-list" element={<RentedOrdersList />} />
            <Route
              path="/generate-renting-reports"
              element={<GenerateRentingReports />}
            />

            <Route path="/reviewList" element={<ReviewList />} />
            <Route path="/ReviewReports" element={<GenerateReviewReports />} />

            {/* Admin Pages of inventory management */}
            <Route path="/add" element={<AddItem />} />
            <Route path="/list" element={<ListItems />} />
            <Route path="/update/:id" element={<UpdateItem />} />
            <Route path="/orders" element={<ListOrders />} />

            {/* Admin Pages of user management */}
            <Route path="/users" element={<ListUsers />} />

            {/* Admin Pages of customization management */}
            <Route path="/customization" element={<AdminCustomizeList />} />
            <Route
              path="/generate-cus-reports"
              element={<GenerateCusReports />}
            />
            <Route
              path="/customization/update/:id"
              element={<UpdateCustomization />}
            />

            {/* Admin Pages of repair management */}
            <Route path="/repairs" element={<ListRepairs />} />
            <Route path="/repair/update/:id" element={<UpdateRepair />} />
            <Route path="/item/report" element={<GenerateItemReport />} />
            <Route path="/repair-report" element={<GenerateRepairReports />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
