import React, { useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Building2,
  Briefcase,
  Users,
  CreditCard,
  Download,
  AlertCircle,
} from "lucide-react";
import { modemPay } from "../utils/modem.config.js";

// Polyfill for process object in browser
if (typeof window !== "undefined" && !window.process) {
  window.process = {
    env: {
      NODE_ENV: "development",
    },
  };
}

export default function GCCIRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: "",
    address: "",
    whatsappNo: "",
    region: "",
    tinBusinessReg: "",
    generalPhone: "",
    dateIssued: "",
    ceoEmail: "",
    dateEstablished: "",
    accountingEmail: "",
    poBox: "",
    generalOfficeEmail: "",
    ownership: "",
    legalStatus: "",
    tradingItems: "",
    manufacturingItems: "",
    serviceTypes: "",
    otherInfo: "",
    bankers: "",
    businessSectors: [],
    totalEmployees: "",
    femaleEmployees: "",
    maleEmployees: "",
    permanentEmployees: "",
    nonPermanentEmployees: "",
    membershipStatus: "",
    typeOfMember: "",
    recruitmentSource: [],
    membershipCategory: "",
    womanEntrepreneur: "",
    youthEntrepreneur: "",
    proprietorName: "",
    partners: "",
    directors: "",
    submitterName: "",
    submitterPosition: "",
    submitterEmail: "",
    submitterPhone: "",
    registrationDate: new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState({});
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const steps = [
    { number: 1, title: "Basic Info", icon: Building2 },
    { number: 2, title: "Business", icon: Briefcase },
    { number: 3, title: "Membership", icon: Users },
    { number: 4, title: "Payment", icon: CreditCard },
  ];

  const businessSectorOptions = [
    "Agriculture",
    "Communication",
    "Construction",
    "Education",
    "Engineering",
    "General Trading",
    "ICT Processing",
    "Manufacturing",
    "Real Estate",
    "Transport/Logistics",
    "Mining",
    "Travel",
    "Tourism",
    "Consulting",
    "Banking & Finance",
    "Legal Services",
    "Fashion & Textile",
    "Cleaning Services",
    "Carpentry",
    "Media/Printing",
    "Art & Craft",
    "Restaurant & Fast Food",
    "Clearing & Forwarding",
    "Petroleum & Allied Products",
    "Beauty Salon & Supplies",
    "Spare Parts & Motor services",
    "Others",
  ];

  const membershipCategories = [
    {
      name: "Category A",
      type: "Extra-Large Business",
      fee: 30000,
      votes: "Six (6) Votes",
    },
    {
      name: "Category B",
      type: "Large Business",
      fee: 20000,
      votes: "Five (5) Votes",
    },
    {
      name: "Category C",
      type: "Medium Business",
      fee: 15000,
      votes: "Four (4) Votes",
    },
    {
      name: "Category D",
      type: "Small Business",
      fee: 7500,
      votes: "Three (3) Votes",
    },
    {
      name: "Category E",
      type: "Micro Business",
      fee: 5000,
      votes: "Two (2) Votes",
    },
    { name: "Category F", type: "Start-Up", fee: 2500, votes: "One (1) Vote" },
  ];

  const getSelectedCategoryFee = () => {
    const category = membershipCategories.find(
      (cat) => cat.name === formData.membershipCategory
    );
    return category ? category.fee : 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && name === "businessSectors") {
      setFormData((prev) => ({
        ...prev,
        businessSectors: checked
          ? [...prev.businessSectors, value]
          : prev.businessSectors.filter((s) => s !== value),
      }));
    } else if (type === "checkbox" && name === "recruitmentSource") {
      setFormData((prev) => ({
        ...prev,
        recruitmentSource: checked
          ? [...prev.recruitmentSource, value]
          : prev.recruitmentSource.filter((s) => s !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.companyName.trim())
        newErrors.companyName = "Company name required";
      if (!formData.address.trim()) newErrors.address = "Address required";
      if (!formData.generalPhone.trim())
        newErrors.generalPhone = "Phone required";
      if (!formData.ceoEmail.trim()) newErrors.ceoEmail = "Email required";
      else if (!/\S+@\S+\.\S+/.test(formData.ceoEmail))
        newErrors.ceoEmail = "Invalid email";
    }

    if (step === 2) {
      if (!formData.ownership) newErrors.ownership = "Select ownership type";
      if (!formData.legalStatus) newErrors.legalStatus = "Select legal status";
    }

    if (step === 3) {
      if (!formData.membershipCategory)
        newErrors.membershipCategory = "Select category";
      if (!formData.membershipStatus)
        newErrors.membershipStatus = "Select status";
    }

    if (step === 4) {
      if (!formData.submitterName.trim())
        newErrors.submitterName = "Name required";
      if (!formData.submitterPosition.trim())
        newErrors.submitterPosition = "Position required";
      if (!formData.submitterEmail.trim())
        newErrors.submitterEmail = "Email required";
      else if (!/\S+@\S+\.\S+/.test(formData.submitterEmail))
        newErrors.submitterEmail = "Invalid email";
      if (!formData.submitterPhone.trim())
        newErrors.submitterPhone = "Phone required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) setCurrentStep(currentStep + 1);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const downloadFormData = () => {
    const category = membershipCategories.find(
      (cat) => cat.name === formData.membershipCategory
    );

    // Create HTML content for PDF
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>GCCI Membership Registration</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
    .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #1e3a8a; padding-bottom: 20px; }
    .header h1 { color: #1e3a8a; margin: 0; font-size: 28px; }
    .header p { color: #666; margin: 5px 0; }
    .section { margin-bottom: 25px; }
    .section h2 { background: #1e3a8a; color: white; padding: 10px; font-size: 16px; margin-bottom: 15px; }
    .field { margin-bottom: 10px; padding: 8px; background: #f8f9fa; }
    .field-label { font-weight: bold; color: #1e3a8a; display: inline-block; width: 200px; }
    .field-value { color: #333; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #1e3a8a; text-align: center; color: #666; }
    .signature-area { margin-top: 50px; display: flex; justify-content: space-between; }
    .signature-box { width: 45%; }
    .signature-line { border-top: 2px solid #000; margin-top: 60px; padding-top: 10px; text-align: center; font-weight: bold; }
  </style>
</head>
<body>
  <div class="header">
    <h1>GAMBIA CHAMBER OF COMMERCE & INDUSTRY</h1>
    <p>MEMBERSHIP REGISTRATION FORM</p>
    <p>Generated on: ${new Date().toLocaleString()}</p>
  </div>

  <div class="section">
    <h2>BASIC INFORMATION</h2>
    <div class="field"><span class="field-label">Company Name:</span> <span class="field-value">${
      formData.companyName
    }</span></div>
    <div class="field"><span class="field-label">Address:</span> <span class="field-value">${
      formData.address
    }</span></div>
    <div class="field"><span class="field-label">Region:</span> <span class="field-value">${
      formData.region
    }</span></div>
    <div class="field"><span class="field-label">WhatsApp No.:</span> <span class="field-value">${
      formData.whatsappNo
    }</span></div>
    <div class="field"><span class="field-label">TIN/Business Reg.:</span> <span class="field-value">${
      formData.tinBusinessReg
    }</span></div>
    <div class="field"><span class="field-label">General Phone:</span> <span class="field-value">${
      formData.generalPhone
    }</span></div>
    <div class="field"><span class="field-label">Date Issued:</span> <span class="field-value">${
      formData.dateIssued
    }</span></div>
    <div class="field"><span class="field-label">CEO/Manager Email:</span> <span class="field-value">${
      formData.ceoEmail
    }</span></div>
    <div class="field"><span class="field-label">Date Established:</span> <span class="field-value">${
      formData.dateEstablished
    }</span></div>
    <div class="field"><span class="field-label">Accounting Email:</span> <span class="field-value">${
      formData.accountingEmail
    }</span></div>
    <div class="field"><span class="field-label">P.O Box:</span> <span class="field-value">${
      formData.poBox
    }</span></div>
    <div class="field"><span class="field-label">General Office Email:</span> <span class="field-value">${
      formData.generalOfficeEmail
    }</span></div>
  </div>

  <div class="section">
    <h2>BUSINESS INFORMATION</h2>
    <div class="field"><span class="field-label">Ownership:</span> <span class="field-value">${
      formData.ownership
    }</span></div>
    <div class="field"><span class="field-label">Legal Status:</span> <span class="field-value">${
      formData.legalStatus
    }</span></div>
    <div class="field"><span class="field-label">Trading Items:</span> <span class="field-value">${
      formData.tradingItems
    }</span></div>
    <div class="field"><span class="field-label">Manufacturing:</span> <span class="field-value">${
      formData.manufacturingItems
    }</span></div>
    <div class="field"><span class="field-label">Service Types:</span> <span class="field-value">${
      formData.serviceTypes
    }</span></div>
    <div class="field"><span class="field-label">Other Information:</span> <span class="field-value">${
      formData.otherInfo
    }</span></div>
    <div class="field"><span class="field-label">Bankers:</span> <span class="field-value">${
      formData.bankers
    }</span></div>
    <div class="field"><span class="field-label">Business Sectors:</span> <span class="field-value">${formData.businessSectors.join(
      ", "
    )}</span></div>
    <div class="field"><span class="field-label">Total Employees:</span> <span class="field-value">${
      formData.totalEmployees
    }</span></div>
    <div class="field"><span class="field-label">Female Employees:</span> <span class="field-value">${
      formData.femaleEmployees
    }</span></div>
    <div class="field"><span class="field-label">Male Employees:</span> <span class="field-value">${
      formData.maleEmployees
    }</span></div>
    <div class="field"><span class="field-label">Permanent Employees:</span> <span class="field-value">${
      formData.permanentEmployees
    }</span></div>
    <div class="field"><span class="field-label">Non-Permanent Employees:</span> <span class="field-value">${
      formData.nonPermanentEmployees
    }</span></div>
  </div>

  <div class="section">
    <h2>MEMBERSHIP INFORMATION</h2>
    <div class="field"><span class="field-label">Category:</span> <span class="field-value">${
      formData.membershipCategory
    } - ${category ? category.type : ""}</span></div>
    <div class="field"><span class="field-label">Membership Fee:</span> <span class="field-value">D${
      category ? category.fee.toLocaleString() : "0"
    }</span></div>
    <div class="field"><span class="field-label">Voting Rights:</span> <span class="field-value">${
      category ? category.votes : ""
    }</span></div>
    <div class="field"><span class="field-label">Membership Status:</span> <span class="field-value">${
      formData.membershipStatus
    }</span></div>
    <div class="field"><span class="field-label">Type of Member:</span> <span class="field-value">${
      formData.typeOfMember
    }</span></div>
    <div class="field"><span class="field-label">Recruitment Source:</span> <span class="field-value">${formData.recruitmentSource.join(
      ", "
    )}</span></div>
    <div class="field"><span class="field-label">Woman Entrepreneur:</span> <span class="field-value">${
      formData.womanEntrepreneur
    }</span></div>
    <div class="field"><span class="field-label">Youth Entrepreneur:</span> <span class="field-value">${
      formData.youthEntrepreneur
    }</span></div>
    <div class="field"><span class="field-label">Proprietor Name:</span> <span class="field-value">${
      formData.proprietorName
    }</span></div>
    <div class="field"><span class="field-label">Partners:</span> <span class="field-value">${
      formData.partners
    }</span></div>
    <div class="field"><span class="field-label">Directors:</span> <span class="field-value">${
      formData.directors
    }</span></div>
  </div>

  <div class="section">
    <h2>SUBMITTER INFORMATION</h2>
    <div class="field"><span class="field-label">Name:</span> <span class="field-value">${
      formData.submitterName
    }</span></div>
    <div class="field"><span class="field-label">Position:</span> <span class="field-value">${
      formData.submitterPosition
    }</span></div>
    <div class="field"><span class="field-label">Email:</span> <span class="field-value">${
      formData.submitterEmail
    }</span></div>
    <div class="field"><span class="field-label">Phone:</span> <span class="field-value">${
      formData.submitterPhone
    }</span></div>
    <div class="field"><span class="field-label">Registration Date:</span> <span class="field-value">${
      formData.registrationDate
    }</span></div>
  </div>

  <div class="signature-area">
    <div class="signature-box">
      <div class="signature-line">Signature / Stamp</div>
    </div>
    <div class="signature-box">
      <div class="signature-line">Approved by CEO</div>
    </div>
  </div>

  <div class="footer">
    <p>This is an official registration document for GCCI Membership</p>
    <p>Please sign and stamp before submission</p>
  </div>
</body>
</html>
    `;

    // Create blob and download
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `GCCI_Registration_${formData.companyName.replace(
      /\s+/g,
      "_"
    )}_${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    // Show instructions
    alert(
      'Download complete! \n\nTo convert to PDF:\n1. Open the downloaded HTML file in your browser\n2. Press Ctrl+P (or Cmd+P on Mac)\n3. Select "Save as PDF" as the printer\n4. Click Save\n\nYour professional PDF is ready!'
    );
  };

  const processModemPayPayment = async () => {
    setIsProcessingPayment(true);

    try {
      const amount = getSelectedCategoryFee();
      const category = membershipCategories.find(
        (cat) => cat.name === formData.membershipCategory
      );

      if (!amount || amount <= 0) {
        alert(
          "Invalid membership fee. Please select a valid membership category."
        );
        return;
      }

      // Create payment intent using ModemPay (based on working reference)
      const paymentIntentData = {
        amount: amount, // Amount in GMD (not cents)
        currency: "GMD",
        metadata: {
          company_name: formData.companyName,
          membership_category: formData.membershipCategory,
          membership_status: formData.membershipStatus,
          registration_date: formData.registrationDate,
          reference: `GCCI-${Date.now()}`,
          customer_name: formData.submitterName,
          customer_email: formData.submitterEmail,
          customer_phone: formData.submitterPhone,
          description: `GCCI Membership - ${category.name} (${category.type})`,
        },
        return_url: `${window.location.origin}/payment/success`,
      };

      console.log("Creating payment intent with data:", paymentIntentData);

      const intent = await modemPay.paymentIntents.create(paymentIntentData);

      console.log(
        "Payment intent created successfully:",
        intent.data.payment_intent_id
      );

      const paymentIntent = {
        payment_url: intent.data.payment_link,
        intentId: intent.data.payment_intent_id,
      };

      if (paymentIntent && paymentIntent.payment_url) {
        // Redirect to ModemPay payment page
        window.location.href = paymentIntent.payment_url;
      } else {
        throw new Error("Failed to create payment intent");
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      alert(
        `Payment Error: ${
          error.message || "Failed to process payment. Please try again."
        }`
      );
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(4)) {
      setShowPayment(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-t-2xl shadow-lg p-6 border-b-4 border-blue-900">
          <h1 className="text-3xl font-bold text-blue-900 text-center">
            GCCI Membership Registration
          </h1>
          <p className="text-center text-gray-600 mt-2">
            Gambia Chamber of Commerce & Industry
          </p>
        </div>

        <div className="bg-white shadow-lg px-6 py-4">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        currentStep >= step.number
                          ? "bg-blue-900 text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {currentStep > step.number ? (
                        <Check size={20} />
                      ) : (
                        <Icon size={20} />
                      )}
                    </div>
                    <span
                      className={`text-xs mt-2 font-medium ${
                        currentStep >= step.number
                          ? "text-blue-900"
                          : "text-gray-400"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 transition-all ${
                        currentStep > step.number
                          ? "bg-blue-900"
                          : "bg-gray-200"
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-b-2xl shadow-lg p-8"
        >
          {Object.keys(errors).length > 0 && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex items-start">
                <AlertCircle className="text-red-500 mt-1 mr-3" size={20} />
                <div>
                  <h3 className="text-red-800 font-semibold">
                    Please fix errors:
                  </h3>
                  <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                    {Object.values(errors).map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.companyName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.address ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Region
                  </label>
                  <input
                    type="text"
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    WhatsApp No.
                  </label>
                  <input
                    type="tel"
                    name="whatsappNo"
                    value={formData.whatsappNo}
                    onChange={handleInputChange}
                    placeholder="+220..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    TIN/Business Reg.
                  </label>
                  <input
                    type="text"
                    name="tinBusinessReg"
                    value={formData.tinBusinessReg}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    General Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="generalPhone"
                    value={formData.generalPhone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.generalPhone ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date Issued
                  </label>
                  <input
                    type="date"
                    name="dateIssued"
                    value={formData.dateIssued}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    CEO/Manager Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="ceoEmail"
                    value={formData.ceoEmail}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.ceoEmail ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date Established
                  </label>
                  <input
                    type="date"
                    name="dateEstablished"
                    value={formData.dateEstablished}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Accounting Email
                  </label>
                  <input
                    type="email"
                    name="accountingEmail"
                    value={formData.accountingEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    P.O Box
                  </label>
                  <input
                    type="text"
                    name="poBox"
                    value={formData.poBox}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    General Office Email
                  </label>
                  <input
                    type="email"
                    name="generalOfficeEmail"
                    value={formData.generalOfficeEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">
                Business Details
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Ownership <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      "100% National-owned",
                      "100% Foreign-owned",
                      "Half/half",
                      "Mainly national-owned",
                      "Mainly Foreign-owned",
                      "Others",
                    ].map((option) => (
                      <label
                        key={option}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="ownership"
                          value={option}
                          checked={formData.ownership === option}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Legal Status <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      "Ltd. Liability Co.",
                      "Partnership",
                      "NGO",
                      "Sole Proprietorship",
                      "State Owned Corp.",
                      "Association",
                      "Partly state-owned company",
                      "Public Corporation",
                      "Private Corporation",
                    ].map((option) => (
                      <label
                        key={option}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="legalStatus"
                          value={option}
                          checked={formData.legalStatus === option}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Trading Items
                  </label>
                  <textarea
                    name="tradingItems"
                    value={formData.tradingItems}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Manufacturing Items
                  </label>
                  <textarea
                    name="manufacturingItems"
                    value={formData.manufacturingItems}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Service Types
                  </label>
                  <textarea
                    name="serviceTypes"
                    value={formData.serviceTypes}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bankers
                  </label>
                  <input
                    type="text"
                    name="bankers"
                    value={formData.bankers}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Business Sectors
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-4 border border-gray-200 rounded-lg">
                    {businessSectorOptions.map((sector) => (
                      <label
                        key={sector}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          name="businessSectors"
                          value={sector}
                          checked={formData.businessSectors.includes(sector)}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-700">{sector}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-4">
                    Employees
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
                        Total
                      </label>
                      <input
                        type="number"
                        name="totalEmployees"
                        value={formData.totalEmployees}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
                        Female
                      </label>
                      <input
                        type="number"
                        name="femaleEmployees"
                        value={formData.femaleEmployees}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
                        Male
                      </label>
                      <input
                        type="number"
                        name="maleEmployees"
                        value={formData.maleEmployees}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
                        Permanent
                      </label>
                      <input
                        type="number"
                        name="permanentEmployees"
                        value={formData.permanentEmployees}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
                        Non-Permanent
                      </label>
                      <input
                        type="number"
                        name="nonPermanentEmployees"
                        value={formData.nonPermanentEmployees}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">
                Membership Information
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Membership Category <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    {membershipCategories.map((cat) => (
                      <label
                        key={cat.name}
                        className="flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-blue-50 transition"
                      >
                        <input
                          type="radio"
                          name="membershipCategory"
                          value={cat.name}
                          checked={formData.membershipCategory === cat.name}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-blue-600 mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-semibold text-gray-900">
                                {cat.name}
                              </span>
                              <span className="text-gray-600 ml-2">
                                - {cat.type}
                              </span>
                            </div>
                            <span className="font-bold text-blue-900">
                              D{cat.fee.toLocaleString()}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {cat.votes}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {["New", "Renewal"].map((option) => (
                        <label
                          key={option}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="membershipStatus"
                            value={option}
                            checked={formData.membershipStatus === option}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Type
                    </label>
                    <div className="space-y-2">
                      {["Direct Member", "Association", "Indirect Member"].map(
                        (option) => (
                          <label
                            key={option}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="typeOfMember"
                              value={option}
                              checked={formData.typeOfMember === option}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm text-gray-700">
                              {option}
                            </span>
                          </label>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    How did you hear about GCCI?
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      "Website/Social Media",
                      "Advertisement",
                      "Conference",
                      "Existing member",
                      "Referrals",
                      "Calls",
                    ].map((option) => (
                      <label
                        key={option}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          name="recruitmentSource"
                          value={option}
                          checked={formData.recruitmentSource.includes(option)}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Woman Entrepreneur
                    </label>
                    <div className="flex space-x-4">
                      {["Yes", "No"].map((option) => (
                        <label
                          key={option}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="womanEntrepreneur"
                            value={option}
                            checked={formData.womanEntrepreneur === option}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Youth Entrepreneur (15-35)
                    </label>
                    <div className="flex space-x-4">
                      {["Yes", "No"].map((option) => (
                        <label
                          key={option}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="youthEntrepreneur"
                            value={option}
                            checked={formData.youthEntrepreneur === option}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Proprietor Name
                  </label>
                  <input
                    type="text"
                    name="proprietorName"
                    value={formData.proprietorName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Partners
                  </label>
                  <textarea
                    name="partners"
                    value={formData.partners}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Directors
                  </label>
                  <textarea
                    name="directors"
                    value={formData.directors}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">
                Review & Payment
              </h2>

              {!showPayment ? (
                <>
                  <div className="bg-blue-50 border-l-4 border-blue-900 p-6 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-4">
                      Submitter Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="submitterName"
                          value={formData.submitterName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            errors.submitterName
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Position <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="submitterPosition"
                          value={formData.submitterPosition}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            errors.submitterPosition
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="submitterEmail"
                          value={formData.submitterEmail}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            errors.submitterEmail
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="submitterPhone"
                          value={formData.submitterPhone}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            errors.submitterPhone
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="font-semibold text-green-900 mb-3">
                      Registration Summary
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Company:</span>
                        <span className="font-semibold text-gray-900">
                          {formData.companyName || "Not provided"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-semibold text-gray-900">
                          {formData.membershipCategory || "Not selected"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-semibold text-gray-900">
                          {formData.membershipStatus || "Not selected"}
                        </span>
                      </div>
                      <div className="border-t border-green-300 mt-4 pt-4 flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">
                          Membership Fee:
                        </span>
                        <span className="text-2xl font-bold text-green-700">
                          D{getSelectedCategoryFee().toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      type="button"
                      onClick={downloadFormData}
                      className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-800 transition"
                    >
                      <Download size={20} />
                      <span>Download Hard Copy</span>
                    </button>

                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                    >
                      <CreditCard size={20} />
                      <span>Proceed to Payment</span>
                    </button>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                    <p className="text-sm text-gray-700">
                      <strong>Note:</strong> Download a copy for your records or
                      to submit a hard copy if needed. Complete payment to
                      finalize your membership registration.
                    </p>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-lg">
                    <h3 className="text-2xl font-bold mb-2">Payment Details</h3>
                    <p className="text-blue-100">
                      Complete your payment via ModemPay
                    </p>
                  </div>

                  <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          GCCI Membership Fee
                        </h4>
                        <p className="text-sm text-gray-600">
                          {formData.membershipCategory} -{" "}
                          {
                            membershipCategories.find(
                              (c) => c.name === formData.membershipCategory
                            )?.type
                          }
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-blue-900">
                          D{getSelectedCategoryFee().toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">GMD</p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Customer Name:</span>
                        <span className="font-medium">
                          {formData.submitterName}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">
                          {formData.submitterEmail}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">
                          {formData.submitterPhone}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Reference:</span>
                        <span className="font-medium font-mono">
                          GCCI-{Date.now()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <button
                      type="button"
                      onClick={processModemPayPayment}
                      disabled={isProcessingPayment}
                      className={`w-full flex items-center justify-center space-x-3 px-8 py-4 rounded-lg font-bold text-lg transition shadow-lg ${
                        isProcessingPayment
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                      }`}
                    >
                      <CreditCard size={24} />
                      <span>
                        {isProcessingPayment
                          ? "Processing Payment..."
                          : "Pay with ModemPay"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowPayment(false)}
                      className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                    >
                      Back to Review
                    </button>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      Payment Information
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Secure payment processing via ModemPay</li>
                      <li>• Supports Mobile Money, Bank Transfer, and Cards</li>
                      <li>• You will receive a payment confirmation email</li>
                      <li>• Membership activated upon successful payment</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition ${
                currentStep === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <ChevronLeft size={20} />
              <span>Previous</span>
            </button>

            {currentStep < 4 && (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition"
              >
                <span>Next</span>
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
