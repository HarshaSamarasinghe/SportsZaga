import { useState } from "react";
import axios from "axios";
import "./CusReportsGeneration.css";

const ReportGeneration = () => {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
  });
  const today = new Date().toISOString().split("T")[0];
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `http://localhost:4000/api/customize/report`,
        {
          params: {
            startDate: formData.startDate,
            endDate: formData.endDate,
          },
          responseType: "blob", // Important for file download
        }
      );

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `customization_report_${formData.startDate}_to_${formData.endDate}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report");
    }
  };

  return (
    <div className="report-container">
      <h2>Generate Customization Report</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="generate-button">
          Generate Report
        </button>
      </form>
    </div>
  );
};

export default ReportGeneration;
