import "./Profile.css";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../../Components/Sidebar/Sidebar";

function Profile() {
  const navigate = useNavigate();

  const url = "http://localhost:4000";

  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${url}/api/user/settings`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        setUserData(response.data.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <p>Loading Profile...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ display: "flex", width: "250px" }}>
      <Sidebar />
      <div className="myProfile" style={{ marginLeft: "280px" }}>
        <div className="myProfileContainer">
          <div className="profileInfoContainer">
            <h5 className="profileName">{userData?.name}</h5>
            <p className="profileEmail">{userData?.email}</p>
          </div>

          <div className="updateProfileNavigate"></div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
