import Sidebar from "../../../Components/Sidebar/Sidebar";
import { useState } from "react";
import axios from "axios";
import "./Repair.css";
const Repair = () => {
  const url = "http://localhost:4000";

  const [data, setData] = useState({
    userId: "",
    name: "",
    equipment: "",
    description: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((prev) => ({
      ...prev,
      userId: `${localStorage.getItem("token")}`,
    }));
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    const response = await axios.post(`${url}/api/repair/create`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.data.success) {
      console.log(response.data.message);
      setData({
        userId: "",
        name: "",
        equipment: "",
        description: "",
        progress: 0,
        price: 0,
        status: "",
      });
    } else {
      console.log(response.data.message);
    }
  };

  return (
    <div div style={{ display: "flex", width: "250px" }}>
      <Sidebar />
      <div className="create-repair-wrapper">
        <div>
          <div
            className="create-repair-container"
            style={{ marginLeft: "280px", width: "100%" }}
          >
            <h2 className="create-repair-heading">Create Repair</h2>
            <p className="create-repair-description">
              Please fill in the details below to create a new repair request.
            </p>
            <div className="create-repair-form-container">
              <form onSubmit={onSubmitHandler}>
                <label htmlFor="Name">Name</label>
                <input
                  type="rtext"
                  name="name"
                  onChange={onChangeHandler}
                  value={data.name}
                  required
                />
                <br />

                <label htmlFor="equipment">equipment</label>
                <input
                  type="text"
                  name="equipment"
                  onChange={onChangeHandler}
                  value={data.equipment}
                  required
                />
                <br />

                <label htmlFor="description">Problem</label>
                <input
                  type="text"
                  name="description"
                  onChange={onChangeHandler}
                  value={data.description}
                  required
                />
                <br />
                <div className="create-repair-button">
                  <button type="submit" className="rep-submit-button">
                    {" "}
                    Submit{" "}
                  </button>
                </div>
              </form>
            </div>
            <p className="create-repair-note">
              Note: Please ensure that all details are correct before
              submitting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Repair;
