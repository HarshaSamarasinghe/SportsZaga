import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./UpdateCustomization.css"; // Importing external CSS

const UpdateCustomization = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    color: "",
    weight: "",
    size: "",
    material: "",
    durability: "",
    totalPrice: "",
    progress: 0,
  });

  useEffect(() => {
    const fetchCustomization = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/customize/list`
        );
        const customization = response.data.data.find(
          (item) => item._id === id
        );
        if (customization) {
          setFormData(customization);
        }
      } catch (error) {
        console.error("Error fetching customization:", error);
      }
    };
    fetchCustomization();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:4000/api/customize/update/${id}`,
        formData
      );
      alert("Customization updated successfully!");
      navigate("/customization");
    } catch (error) {
      console.error("Error updating customization:", error);
      alert("Failed to update customization.");
    }
  };

  return (
    <div className="update-container">
      <h2>Update Customization</h2>

      <table className="custom-table">
        <tbody>
          <tr>
            <td>Image:</td>
            <td>
              <img
                src={`http://localhost:4000/images/${formData.image}`}
                alt="Customization"
                className="custom-img"
              />
            </td>
          </tr>
          <tr>
            <td>Name:</td>
            <td>{formData.name}</td>
          </tr>
          <tr>
            <td>Weight:</td>
            <td>{formData.weight}</td>
          </tr>
          <tr>
            <td>Size:</td>
            <td>{formData.size}</td>
          </tr>
          <tr>
            <td>Material:</td>
            <td>{formData.material}</td>
          </tr>
          <tr>
            <td>Durability:</td>
            <td>{formData.durability}</td>
          </tr>
          <tr>
            <td>Total Price:</td>
            <td>{formData.totalPrice}</td>
          </tr>
          <tr>
            <td>Color:</td>
            <td>
              <div
                className="color-box"
                style={{ backgroundColor: `${formData.color}` }}
              ></div>
            </td>
          </tr>
        </tbody>
      </table>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="progress">Progress:</label>
          <input
            type="number"
            id="progress"
            name="progress"
            value={formData.progress}
            onChange={handleChange}
            placeholder="Update Progress"
            required
          />
        </div>
        <button type="submit" className="update-button">
          Update Customization
        </button>
      </form>
    </div>
  );
};

export default UpdateCustomization;

/*import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateCustomization = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    color: "",
    weight: "",
    size: "",
    material: "",
    durability: "",
    totalPrice: "",
    progress: 0,
  });

  useEffect(() => {
    // Fetch customization data for the given ID
    const fetchCustomization = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/customize/list`);
        const customization = response.data.data.find((item) => item._id === id);
        if (customization) {
          setFormData(customization);
        }
      } catch (error) {
        console.error("Error fetching customization:", error);
      }
    };
    fetchCustomization();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:4000/api/customize/update/${id}`, formData);
      alert("Customization updated successfully!");
      navigate("/admin");  // Redirect back to Admin Dashboard after updating
    } catch (error) {
      console.error("Error updating customization:", error);
      alert("Failed to update customization.");
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Update Customization</h2>
      <img style={{ width: '200px', height: '200px'}} src={formData.image} alt="" />
      <p>{formData.weight}</p>
      <p>{formData.name}</p>
      <p>{formData.size}</p>
      <div style={{ width: '20px', height: '20px', backgroundColor: `${formData.color}` }}></div>
      <form onSubmit={handleSubmit}>
        
        <input type="text" name="size" value={formData.size}  placeholder="Size"  required readOnly/>
        <input type="text" name="material" value={formData.material}  placeholder="Material"  required readOnly/>
        <input type="text" name="durability" value={formData.durability}  placeholder="Durability"  required readOnly/>
        <input type="number" name="totalPrice" value={formData.totalPrice}  placeholder="Total Price"   required readOnly/>
        <input type="number" name="progress" value={formData.progress} onChange={handleChange} placeholder="Total Price" required />
        <button type="submit">Update Customization</button>
      </form>
    </div>
  );
};

export default UpdateCustomization;*/
