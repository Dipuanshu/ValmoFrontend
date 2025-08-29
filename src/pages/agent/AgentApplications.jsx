/** @format */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AgentApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  // Bank selection state
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [availableBanks, setAvailableBanks] = useState([]);
  const [selectedBanks, setSelectedBanks] = useState([]);
  const [loadingBanks, setLoadingBanks] = useState(false);

  // Check if user is agent
  useEffect(() => {
    const userType = localStorage.getItem("userType");
    if (userType !== "agent") {
      navigate("/multi-login");
      return;
    }
    fetchApplications();
  }, []);

  // Fetch all applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://valmobackend.onrender.com/getApplication"
      );
      setApplications(res.data.data || []);
      setFilteredApplications(res.data.data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      alert("Failed to fetch applications ❌");
    } finally {
      setLoading(false);
    }
  };

  // Search and filter applications
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredApplications(applications);
    } else {
      const q = searchTerm.toLowerCase();
      const filtered = applications.filter((application) => {
        const name = (application.fullName || "").toLowerCase();
        const email = (application.email || "").toLowerCase();
        const phone = String(application.mobileNumber || "").toLowerCase();
        return name.includes(q) || email.includes(q) || phone.includes(q);
      });
      setFilteredApplications(filtered);
    }
  }, [searchTerm, applications]);

  // View Application
  const handleViewApplication = (applicationId) => {
    // Navigate to view application page
    navigate(`/view-application/${encodeURIComponent(applicationId)}`);
  };

  // Edit Application
  const handleEditApplication = (application) => {
    // For now, we'll just show an alert - you can implement edit modal later
    alert("Edit functionality would open here");
  };

  const handleDelete = async (applicationId) => {
    if (!window.confirm("Are you sure you want to delete this application?"))
      return;
    try {
      await axios.delete(
        `https://valmobackend.onrender.com/application/${applicationId}`
      );
      alert("Application deleted successfully ✅");
      fetchApplications(); // Refresh the list
    } catch (error) {
      console.error("Error deleting application:", error);
      alert("Failed to delete application ❌");
    }
  };

  // Bank selection functions
  const loadAvailableBanks = async () => {
    try {
      setLoadingBanks(true);
      const response = await axios.get(
        "https://valmobackend.onrender.com/bankDetails"
      );

      const bankData = response.data.data;

      if (bankData) {
        // Wrap the single bank object inside an array
        setAvailableBanks([bankData]);
      } else {
        setAvailableBanks([]);
      }
    } catch (error) {
      console.error("Error loading bank details:", error);
      alert("Failed to load bank details ❌");
    } finally {
      setLoadingBanks(false);
    }
  };

  const handleBankSelection = (application) => {
    setSelectedApplication(application);
    setIsBankModalOpen(true);
    loadAvailableBanks();
    // Reset selected banks
    setSelectedBanks([]);
  };

  const toggleBankSelection = (bankId) => {
    setSelectedBanks((prev) => {
      if (prev.includes(bankId)) {
        return prev.filter((id) => id !== bankId);
      } else {
        return [...prev, bankId];
      }
    });
  };

  const handleAssignBanks = async () => {
    if (selectedBanks.length === 0) {
      alert("Please select at least one bank or QR code option");
      return;
    }

    try {
      // For each selected bank, send assignment to back
      const promises = selectedBanks.map((bankId) => {
        const bank = availableBanks.find((b) => b._id === bankId);
        return axios.post(
          "https://valmobackend.onrender.com/assignBankDetails",
          {
            customerEmail: selectedApplication.email,
            bankOption: bankId,
            bankDetails: bank,
          }
        );
      });

      await Promise.all(promises);
      alert("Bank details assigned successfully! ✅");
      setIsBankModalOpen(false);
      fetchApplications(); // Refresh the list
    } catch (error) {
      console.error("Error assigning bank details:", error);
      alert("Failed to assign bank details ❌");
    }
  };

  // Copy proposal function
  const handleCopyProposal = async (application) => {
    try {
      // Call the same API as used in create proposal
      const response = await axios.post(
        "https://valmobackend.onrender.com/sendProposal",
        {
          email: application.email,
          name: application.fullName,
        }
      );

      if (response.data.success) {
        // Copy to clipboard
        const proposalText = `Dear ${application.fullName},

Your application has been approved. Please find the payment details below:
Bank: ${response.data.bankDetails.bankName}
Account Number: ${response.data.bankDetails.accountNumber}
IFSC Code: ${response.data.bankDetails.ifscCode}
Branch: ${response.data.bankDetails.branchName}

For UPI payments:
UPI ID: ${response.data.bankDetails.upiId || "N/A"}

Or scan the QR code attached to make the payment.

Thank you for choosing Valmo!`;

        await navigator.clipboard.writeText(proposalText);
        alert("Proposal copied to clipboard! ✅");
      } else {
        alert("Failed to generate proposal ❌");
      }
    } catch (error) {
      console.error("Error copying proposal:", error);
      alert("Failed to copy proposal ❌");
    }
  };

  // Logout Function
  const logout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <>
      {/* HEADER */}
      <header className="bg-blue-600 shadow-md py-3 sm:py-4 px-4 sm:px-6 flex items-center justify-between text-white">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <img
            src="https://registrations-meesho-valmo.in/valmologo.png"
            alt="VALMO"
            className="h-6 sm:h-8"
          />
          <h1 className="text-lg sm:text-xl font-bold">
            Application Management
          </h1>
        </div>
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded text-xs sm:text-sm hover:bg-red-600 flex items-center"
          >
            <i className="fas fa-sign-out-alt mr-1 sm:mr-2" />
            Logout
          </button>
        </div>
      </header>

      <div className="container mx-auto p-4 sm:p-6">
        {/* Search Section */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-4 sm:mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4">
            <h2 className="text-lg sm:text-2xl font-semibold text-blue-600">
              <i className="fas fa-file-alt mr-1 sm:mr-2" />
              All Applications
            </h2>
            <div className="relative w-full md:w-1/3">
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                className="w-full p-2 sm:p-3 pl-8 sm:pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="fas fa-search absolute left-2 sm:left-3 top-2.5 sm:top-4 text-gray-400 text-xs sm:text-sm"></i>
            </div>
            <button
              onClick={fetchApplications}
              className="bg-green-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded hover:bg-green-600 flex items-center text-xs sm:text-sm"
            >
              <i className="fas fa-refresh mr-1 sm:mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Applications List Section */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-6 sm:py-8">
                <i className="fas fa-spinner fa-spin text-xl sm:text-2xl text-blue-600 mb-3 sm:mb-4"></i>
                <p className="text-gray-600 text-sm sm:text-base">
                  Loading applications...
                </p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <i className="fas fa-inbox text-3xl sm:text-4xl text-gray-400 mb-3 sm:mb-4"></i>
                <p className="text-gray-600 text-sm sm:text-base">
                  No applications found
                </p>
              </div>
            ) : (
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-2 px-3 sm:py-3 sm:px-4 text-left font-medium text-gray-700 text-xs sm:text-sm">
                      Applicant Name
                    </th>
                    <th className="py-2 px-3 sm:py-3 sm:px-4 text-left font-medium text-gray-700 text-xs sm:text-sm">
                      Email ID
                    </th>
                    <th className="py-2 px-3 sm:py-3 sm:px-4 text-left font-medium text-gray-700 text-xs sm:text-sm">
                      Phone
                    </th>
                    <th className="py-2 px-3 sm:py-3 sm:px-4 text-left font-medium text-gray-700 text-xs sm:text-sm">
                      Status
                    </th>
                    <th className="py-2 px-3 sm:py-3 sm:px-4 text-left font-medium text-gray-700 text-xs sm:text-sm">
                      Submitted Date
                    </th>
                    <th className="py-2 px-3 sm:py-3 sm:px-4 text-left font-medium text-gray-700 text-xs sm:text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((application) => (
                    <tr
                      key={application._id}
                      className="border-b hover:bg-gray-50 text-xs sm:text-sm"
                    >
                      <td className="py-2 px-3 sm:py-3 sm:px-4">
                        {application.fullName}
                      </td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4">
                        {application.email}
                      </td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4">
                        {application.mobileNumber}
                      </td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4">
                        <span
                          className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-medium ${
                            application.approved
                              ? "bg-green-100 text-green-800"
                              : application.rejected
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {application.approved
                            ? "Approved"
                            : application.rejected
                            ? "Rejected"
                            : "Pending"}
                        </span>
                      </td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4">
                        {application.createdAt
                          ? new Date(application.createdAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() =>
                              handleViewApplication(application._id)
                            }
                            title="View"
                            className="text-blue-600 hover:text-blue-700 p-1"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button
                            onClick={() => handleEditApplication(application)}
                            title="Edit"
                            className="text-yellow-600 hover:text-yellow-700 p-1"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(application._id)}
                            title="Delete"
                            className="text-red-600 hover:text-red-700 p-1"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                          <button
                            onClick={() => handleBankSelection(application)}
                            title="Assign Bank"
                            className="text-green-600 hover:text-green-700 p-1"
                          >
                            <i className="fas fa-university"></i>
                          </button>
                          <button
                            onClick={() => handleCopyProposal(application)}
                            title="Copy Proposal"
                            className="text-purple-600 hover:text-purple-700 p-1"
                          >
                            <i className="fas fa-copy"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Bank Selection Modal */}
        {isBankModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Select Banks for {selectedApplication?.fullName}
                </h3>
                <button
                  onClick={() => setIsBankModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="px-6 py-4 space-y-4">
                {loadingBanks ? (
                  <div className="text-center py-4">
                    <i className="fas fa-spinner fa-spin text-xl text-blue-600 mb-2"></i>
                    <p className="text-gray-600">Loading banks...</p>
                  </div>
                ) : !availableBanks || availableBanks.length === 0 ? (
                  <div className="text-center py-4">
                    <i className="fas fa-university text-2xl text-gray-400 mb-2"></i>
                    <p className="text-gray-600">No banks available</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="qr_code"
                          checked={selectedBanks.includes("qr_code")}
                          onChange={() => toggleBankSelection("qr_code")}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <label
                          htmlFor="qr_code"
                          className="ml-2 text-sm font-medium text-gray-700"
                        >
                          QR Code Payment
                        </label>
                      </div>
                    </div>

                    {availableBanks.map((bank) => (
                      <div key={bank._id} className="border rounded-lg p-3">
                        <div className="flex items-start">
                          <input
                            type="checkbox"
                            id={bank._id}
                            checked={selectedBanks.includes(bank._id)}
                            onChange={() => toggleBankSelection(bank._id)}
                            className="h-4 w-4 text-blue-600 rounded mt-1"
                          />
                          <label htmlFor={bank._id} className="ml-2">
                            <div className="font-medium text-sm">
                              {bank.bankName}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              <div>Account: {bank.accountNumber}</div>
                              <div>IFSC: {bank.ifscCode}</div>
                              <div>UPI: {bank.upiId || "N/A"}</div>
                            </div>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsBankModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAssignBanks}
                  disabled={selectedBanks.length === 0 || loadingBanks}
                  className={`px-4 py-2 rounded-md font-medium text-white ${
                    selectedBanks.length === 0 || loadingBanks
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  Assign Selected
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AgentApplications;
