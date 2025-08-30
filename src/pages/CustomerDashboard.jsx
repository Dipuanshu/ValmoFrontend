/** @format */

import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { email } = useParams();

  const [customerSession, setCustomerSession] = useState(null);
  const [applicationDetails, setApplicationDetails] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [timer, setTimer] = useState(180);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [status, setStatus] = useState();
  const [Bank, setBank] = useState();
  console.log("Bank", Bank);

  // ✅ interval IDs ko state me mat rakho → useRef
  const timerIntervalRef = useRef(null);
  const statusPollingRef = useRef(null);

  // ✅ checkAuth & polling
  useEffect(() => {
    if (!checkAuth()) {
      return;
    }

    // Load initial data
    loadApplicationDetails();

    // Poll every 10 seconds
    statusPollingRef.current = setInterval(() => {
      loadApplicationDetails();
    }, 10000);

    return () => {
      if (statusPollingRef.current) clearInterval(statusPollingRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const checkAuth = () => {
    const session = localStorage.getItem("customerSession");
    if (!session) {
      navigate("/customer-login");
      return false;
    }
    const parsedSession = JSON.parse(session);
    setCustomerSession(parsedSession);
    loadApplicationDetails();
    return true;
  };

  const loadApplicationDetails = async () => {
    try {
      const response = await fetch(
        `https://valmobackend.onrender.com/getApplication/email/${email}`
      );
      const result = await response.json();

      if (response.ok) {
        const enhancedDetails = {
          ...result,
          approved: !!result.approved,
          rejected: !!result.rejected,
          agreementSent: !!result.agreementSent,
          oneTimeFeePaid: !!result.oneTimeFeePaid,
        };
        setApplicationDetails(enhancedDetails);
      }
    } catch (err) {
      console.error("Error loading application:", err);
    }
  };

  useEffect(() => {
    axios
      .get(`https://valmobackend.onrender.com/getApplication/${email}`)
      .then((res) => {
        setStatus(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [email]);

  useEffect(() => {
    axios
      .get(`https://valmobackend.onrender.com/getAssignedBank/${email}`)
      .then((res) => {
        if (res.data.success && res.data.bankDetails) {
          setBank(res.data.bankDetails); // ab Bank me object aayega
        }
      })
      .catch((err) => {
        console.log("Error fetching bank:", err);
      });
  }, [email]);

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  const handlePayNow = () => {
    setShowPaymentModal(true);
    startTimer();
  };

  const startTimer = () => {
    let timeLeft = 180;
    setTimer(timeLeft);

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    timerIntervalRef.current = setInterval(() => {
      timeLeft--;
      setTimer(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(timerIntervalRef.current);
        setShowPaymentModal(false);
        showMessage("Payment session expired. Please try again.", "error");
      }
    }, 1000);
  };

  const closeModal = () => {
    setShowPaymentModal(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
  };

  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  if (!customerSession) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Header */}
      <header className="bg-white shadow-lg py-3 sm:py-4 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto space-y-4 sm:space-y-0">
          <div className="flex items-center">
            <img
              src="https://www.valmo.in/static-assets/valmo-web/valmo-logo-white.svg"
              alt="Valmo Logo"
              className="h-6 sm:h-8 filter invert"
            />
          </div>
          <button
            onClick={handlePayNow}
            className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-transform duration-200 ease-in-out text-sm sm:text-base"
          >
            <i className="fas fa-credit-card mr-2"></i>
            Pay Now
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="max-w-4xl mx-auto">
          {/* Application Progress Card - Moved above welcome note */}
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 mb-6 hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
              Application Progress
            </h3>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative">
              {/* Step 1: Approval */}
              <div className="flex flex-col items-center w-full md:w-auto mb-8 md:mb-0">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                    applicationDetails?.approved ||
                    applicationDetails?.rejected ||
                    applicationDetails?.agreementSent ||
                    applicationDetails?.oneTimeFeePaid
                      ? "bg-green-500 border-green-500"
                      : applicationDetails && !applicationDetails.rejected
                      ? "bg-blue-500 border-blue-500"
                      : "bg-gray-200 border-gray-300"
                  }`}
                >
                  {applicationDetails?.approved ||
                  applicationDetails?.rejected ||
                  applicationDetails?.agreementSent ||
                  applicationDetails?.oneTimeFeePaid ? (
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  ) : applicationDetails?.rejected ? (
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  ) : (
                    <span
                      className={`font-medium ${
                        applicationDetails && !applicationDetails.rejected
                          ? "text-white"
                          : "text-gray-500"
                      }`}
                    >
                      1
                    </span>
                  )}
                </div>
                <div className="mt-3 text-center">
                  <h3
                    className={`text-sm font-medium ${
                      applicationDetails?.approved ||
                      applicationDetails?.rejected ||
                      applicationDetails?.agreementSent ||
                      applicationDetails?.oneTimeFeePaid
                        ? "text-green-600"
                        : applicationDetails && !applicationDetails.rejected
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`}
                  >
                    Approval
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Application Review
                  </p>
                </div>
              </div>

              {/* Connector 1 */}
              <div className="absolute top-6 left-1/6 md:left-1/3 w-2/3 md:w-1/3 h-0.5 bg-gray-200 z-0 hidden md:block"></div>
              <div className="h-0.5 w-32 bg-gray-200 my-4 md:hidden"></div>

              {/* Step 2: Agreement */}
              <div className="flex flex-col items-center w-full md:w-auto mb-8 md:mb-0">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                    applicationDetails?.agreementSent ||
                    applicationDetails?.oneTimeFeePaid
                      ? "bg-green-500 border-green-500"
                      : applicationDetails?.approved &&
                        !applicationDetails.rejected
                      ? "bg-blue-500 border-blue-500"
                      : "bg-gray-200 border-gray-300"
                  }`}
                >
                  {applicationDetails?.agreementSent ||
                  applicationDetails?.oneTimeFeePaid ? (
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  ) : (
                    <span
                      className={`font-medium ${
                        applicationDetails?.approved &&
                        !applicationDetails.rejected
                          ? "text-white"
                          : "text-gray-500"
                      }`}
                    >
                      2
                    </span>
                  )}
                </div>
                <div className="mt-3 text-center">
                  <h3
                    className={`text-sm font-medium ${
                      applicationDetails?.agreementSent ||
                      applicationDetails?.oneTimeFeePaid
                        ? "text-green-600"
                        : applicationDetails?.approved &&
                          !applicationDetails.rejected
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`}
                  >
                    Agreement
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Sign Documents</p>
                </div>
              </div>

              {/* Connector 2 */}
              <div className="absolute top-6 right-1/6 md:right-1/3 w-2/3 md:w-1/3 h-0.5 bg-gray-200 z-0 hidden md:block"></div>
              <div className="h-0.5 w-32 bg-gray-200 my-4 md:hidden"></div>

              {/* Step 3: One Time Fee */}
              <div className="flex flex-col items-center w-full md:w-auto">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                    applicationDetails?.oneTimeFeePaid
                      ? "bg-green-500 border-green-500"
                      : applicationDetails?.agreementSent
                      ? "bg-blue-500 border-blue-500"
                      : "bg-gray-200 border-gray-300"
                  }`}
                >
                  {applicationDetails?.oneTimeFeePaid ? (
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  ) : (
                    <span
                      className={`font-medium ${
                        applicationDetails?.agreementSent
                          ? "text-white"
                          : "text-gray-500"
                      }`}
                    >
                      3
                    </span>
                  )}
                </div>
                <div className="mt-3 text-center">
                  <h3
                    className={`text-sm font-medium ${
                      applicationDetails?.oneTimeFeePaid
                        ? "text-green-600"
                        : applicationDetails?.agreementSent
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`}
                  >
                    One Time Fee
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Payment Processing
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Welcome Note */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
              Welcome, {applicationDetails?.fullName || "Customer"}!
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Here's your franchise application details
            </p>
          </div>

          {/* Alert messages */}
          {message.text && (
            <div
              className={`text-center py-3 mb-4 rounded-lg ${
                message.type === "success"
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Application Details Card */}
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 mb-6 hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
              <i className="fas fa-file-alt mr-2 sm:mr-3 text-blue-600"></i>Your
              Application Details
            </h3>

            {applicationDetails ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <strong className="text-gray-700 text-sm">Name:</strong>{" "}
                      <span className="text-gray-900 text-sm">
                        {applicationDetails.fullName}
                      </span>
                    </div>
                    <div>
                      <strong className="text-gray-700 text-sm">Phone:</strong>{" "}
                      <span className="text-gray-900 text-sm">
                        {applicationDetails.mobileNumber}
                      </span>
                    </div>
                    <div>
                      <strong className="text-gray-700 text-sm">Email:</strong>{" "}
                      <span className="text-gray-900 text-sm">
                        {applicationDetails.email}
                      </span>
                    </div>
                    <div>
                      <strong className="text-gray-700 text-sm">
                        Address:
                      </strong>{" "}
                      <span className="text-gray-900 text-sm">
                        {applicationDetails.residentialStreet},{" "}
                        {applicationDetails.residentialCity},{" "}
                        {applicationDetails.residentialDistrict},{" "}
                        {applicationDetails.residentialState} -{" "}
                        {applicationDetails.residentialPinCode}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <strong className="text-gray-700 text-sm">
                        Investment Capacity:
                      </strong>{" "}
                      <span className="text-gray-900 text-sm">
                        {applicationDetails.investmentCapacity}
                      </span>
                    </div>
                    <div>
                      <strong className="text-gray-700 text-sm">
                        Experience:
                      </strong>{" "}
                      <span className="text-gray-900 text-sm">
                        {applicationDetails.professionalBackground || "N/A"}
                      </span>
                    </div>
                    <div>
                      <strong className="text-gray-700 text-sm">
                        Application Date:
                      </strong>{" "}
                      <span className="text-gray-900 text-sm">
                        {new Date(
                          applicationDetails.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <strong className="text-gray-700 text-sm">Status:</strong>{" "}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                          applicationDetails.approved
                            ? "bg-green-100 text-green-800"
                            : applicationDetails.rejected
                            ? "bg-red-100 text-red-800"
                            : applicationDetails.oneTimeFeePaid
                            ? "bg-green-100 text-green-800"
                            : applicationDetails.agreementSent
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {applicationDetails.approved
                          ? "Approved"
                          : applicationDetails.rejected
                          ? "Rejected"
                          : applicationDetails.oneTimeFeePaid
                          ? "One Time Fee Paid"
                          : applicationDetails.agreementSent
                          ? "Agreement Sent"
                          : "Pending"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Uploaded Documents */}
                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Uploaded Documents
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <strong>Photo:</strong>{" "}
                      {applicationDetails.photo ? (
                        <a
                          href={applicationDetails.photo}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline"
                        >
                          View
                        </a>
                      ) : (
                        "Not Uploaded"
                      )}
                    </li>
                    <li>
                      <strong>Aadhar Card:</strong>{" "}
                      {applicationDetails.aadharCard ? (
                        <a
                          href={applicationDetails.aadharCard}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline"
                        >
                          View
                        </a>
                      ) : (
                        "Not Uploaded"
                      )}
                    </li>
                    <li>
                      <strong>PAN Card:</strong>{" "}
                      {applicationDetails.panCard ? (
                        <a
                          href={applicationDetails.panCard}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline"
                        >
                          View
                        </a>
                      ) : (
                        "Not Uploaded"
                      )}
                    </li>
                    <li>
                      <strong>Passbook/Cancelled Cheque:</strong>{" "}
                      {applicationDetails.cancelCheque ? (
                        <a
                          href={applicationDetails.cancelCheque}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline"
                        >
                          View
                        </a>
                      ) : (
                        "Not Uploaded"
                      )}
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
                <p className="text-gray-600">
                  Loading your application details...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-2xl relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <i className="fas fa-times text-xl"></i>
            </button>

            {/* QR Code ya Bank Details */}
            {Bank?.qrCode ? (
              <>
                {/* Offer Section */}
                {status.data.status === "approved" ? (
                  <div className="bg-gray-50 p-4 rounded-xl shadow-sm space-y-2 text-sm text-gray-800 inline-block text-left">
                    <p>
                      📝 Kindly pay your booking fee of <strong>₹18,600</strong>
                      .
                    </p>
                    <p>
                      🔥 <strong>Offer:</strong> If you pay through PhonePe, pay
                      only{" "}
                      <span className="text-green-600 font-semibold">
                        ₹16,999
                      </span>
                      !
                    </p>
                    <p>
                      💸 Save{" "}
                      <span className="font-semibold text-green-600">
                        ₹1,601
                      </span>{" "}
                      by choosing PhonePe!
                    </p>
                    <p>📱 PhonePe = ₹16,999</p>
                    <p>💳 Other = ₹18,600</p>
                    <p className="text-red-600 font-medium">
                      ⏳ Hurry! Limited time offer.
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-xl shadow-sm space-y-2 text-sm text-gray-800 inline-block text-left">
                    <p>
                      📝 Kindly pay your Agreement Fee of{" "}
                      <strong>₹90,100</strong>.
                    </p>
                    <p>
                      🔥 <strong>Offer:</strong> If you pay through PhonePe, pay
                      only{" "}
                      <span className="text-green-600 font-semibold">
                        ₹88,500
                      </span>
                      !
                    </p>
                    <p>
                      💸 Save{" "}
                      <span className="font-semibold text-green-600">
                        ₹1,600
                      </span>{" "}
                      by choosing PhonePe as your payment method!
                    </p>
                    <div className="border-t border-gray-300 pt-2 space-y-1">
                      <p className="font-semibold">📌 Payment Details:</p>
                      <p>💼 Regular Fee = ₹90,100</p>
                      <p>📱 PhonePe Payment = ₹88,500</p>
                    </div>
                    <p className="text-red-600 font-medium">
                      ⏳ Hurry! Limited Time Offer
                    </p>
                  </div>
                )}

                {/* QR Code Section */}
                <div className="text-center mb-6 mt-6">
                  <div className="w-64 h-64 mx-auto bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <img
                      src={Bank.qrCode}
                      alt="QR Code"
                      className="w-full h-full object-contain p-4"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Scan this QR code to pay
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Bank Details Section */}
                <div className="bg-gray-50 p-4 rounded-xl shadow-sm space-y-1 text-sm text-gray-800 inline-block text-left mt-6">
                  <p className="font-semibold">Bank Details:</p>
                  <p>
                    🏦 Bank Name: <strong>{Bank.bankName}</strong>
                  </p>
                  <p>
                    🏛 Branch: <strong>{Bank.bankBranch}</strong>
                  </p>
                  <p>
                    👤 A/C Holder: <strong>{Bank.accountHolderName}</strong>
                  </p>
                  <p>
                    🔢 A/C No.: <strong>{Bank.accountNumber}</strong>
                  </p>
                  <p>
                    🆔 IFSC Code: <strong>{Bank.ifscCode}</strong>
                  </p>
                  <p className="text-gray-600 text-xs mt-1">
                    Use these details to complete your payment.
                  </p>
                </div>
              </>
            )}

            {/* Timer */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Payment expires in{" "}
                <span className="font-semibold text-red-600">
                  {formatTimer(timer)}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
