import "./Settings.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../Components/Sidebar/Sidebar";

function Settings() {
  const url = "http://localhost:4000";
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);

  // Handle input changes
  const onChangeHandler = (event) => {
    const { name, value } = event.target;

    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // Update user data
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        //toast.error("User not authenticated");
        return;
      }

      const response = await axios.put(`${url}/api/user/update`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        console.log(response.data.message);
        navigate("/profile");
        //toast.success("Profile updated successfully!");
      } else {
        //toast.error("Failed to update profile");
      }
    } catch (error) {
      //toast.error("Failed to update profile");
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          //toast.error("User not authenticated");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${url}/api/user/settings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data);
      } catch (error) {
        //toast.error("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [url]);

  if (loading) return <p className="loadingMessage">Loading Profile...</p>;

  return (
    <div style={{ display: "flex", width: "250px" }}>
      <Sidebar />
      <div className="settingsContainer" style={{ marginLeft: "280px" }}>
        <div className="titleArea">
          <h1 className="title">Settings</h1>

          <div className="formGroup">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={userData?.name}
              onChange={onChangeHandler}
            />
          </div>

          <div className="formGroup">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={userData?.email}
              onChange={onChangeHandler}
            />
          </div>

          <div className="formGroup">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={userData?.password}
              onChange={onChangeHandler}
            />
          </div>

          <div className="buttonContainer">
            <button className="updateUserDetailsButton" onClick={handleUpdate}>
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
