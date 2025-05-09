import { useState } from "react";
import axios from "axios";
import "./GenerateReviewReports.css";

function GenerateReviewReports() {
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/reviews/generate-review-report",
        dateRange,
        {
          responseType: "blob",
        }
      );

      // Create a blob from the PDF data
      const blob = new Blob([response.data], { type: "application/pdf" });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;
      link.download = `review-report-${dateRange.startDate}-to-${dateRange.endDate}.pdf`;

      // Append to body, click and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to generate report. Please try again.");
      console.error("Error generating report:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-container">
      <h2 className="report-heading">Generate Review Reports</h2>

      <form onSubmit={handleGenerateReport} className="report-form">
        <div className="date-range-container">
          <div className="date-input-group">
            <label htmlFor="startDate">Start Date:</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
              required
            />
          </div>

          <div className="date-input-group">
            <label htmlFor="endDate">End Date:</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
              required
            />
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button
          type="submit"
          className="generate-Renting-button"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Report"}
        </button>
      </form>
    </div>
  );
}

export default GenerateReviewReports;
