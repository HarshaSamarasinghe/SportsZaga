import { useState, useEffect } from "react";
import "./ListUsers.css";
import axios from "axios";
import { toast } from "react-toastify";

function ListUsers() {
  const url = "http://localhost:4000";
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/user/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  const removeUser = async (userId) => {
    try {
      const response = await axios.post(`${url}/api/user/remove`, {
        id: userId,
      });
      if (response.status === 200) {
        fetchList();
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An unexpected error occurred."
      );
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // Filter users by name (case-insensitive)
  const filteredList = list.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="user-list-page">
      <h1 className="page-title">All Users</h1>

      <input
        type="text"
        placeholder="Search name here..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: "10px",
          width: "100%",
          maxWidth: "400px",
          marginBottom: "20px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          fontSize: "16px",
        }}
      />

      <div className="user-list-content">
        {loading ? (
          <p>Loading...</p>
        ) : filteredList.length === 0 ? (
          <p>No users found.</p>
        ) : (
          filteredList.map((user, index) => (
            <div className="user-card" key={index}>
              <div className="user-details">
                <p className="user-name">{user.name}</p>
                <p className="user-email">{user.email}</p>
              </div>
              <div className="user-action">
                <button
                  className="deleteUser"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Are you sure you want to delete ${user.name}?`
                      )
                    ) {
                      removeUser(user._id);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ListUsers;
