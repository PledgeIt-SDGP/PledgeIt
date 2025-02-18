import { BadgeInfo, ImagePlus } from "lucide-react";
import React, { useState } from "react";
import { Link, Routes, Route, Outlet, useNavigate } from "react-router-dom";
import OrgType from "./orgType";


const OrgSignUp2= () => {
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    orgName: "",
    websiteUrl: "",
    orgType: "Private Business",
    about: "",
    email: "",
    phoneNo: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-orange-700">PlegeIt</h1>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-700 pb-5">Create an Organization Account</h2>
      </div>

      <div className="w-160 bg-gray-50 rounded-lg px-10 py-8 border border-gray-300 border-opacity-50">
        <Routes>
          {/* Step 1 Route */}
          <Route
            path=""
            element={
              <Step1
                formData={formData}
                setFormData={setFormData}
                handleInputChange={handleInputChange}
                handleImageChange={handleImageChange}
                navigate={navigate}
              />
            }
          />

          {/* Step 2 Route */}
          <Route
            path="step2"
            element={
              <Step2
                formData={formData}
                setFormData={setFormData}
                handleInputChange={handleInputChange}
              />
            }
          />
        </Routes>
      </div>

      <span className="mt-5">Already have an account?</span>
      <a href="/logIn" className="font-bold text-red-400">Sign In</a>
    </div>
  );
};

export default OrgSignUp2;

// Step 1 Component
const Step1 = ({ formData, setFormData, handleInputChange, handleImageChange, navigate }) => (
  <form encType="multipart/form-data" className="space-y-4">
    <div className="flex items-center space-x-4">
      <div className="relative w-25 h-25 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center bg-gray-200 overflow-hidden cursor-pointer">
        {formData.image ? (
          <img src={formData.image} alt="Profile" className="w-full h-full object-cover rounded-full" />
        ) : (
          <span className="text-3xl text-gray-600">
            <ImagePlus />
          </span>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="absolute opacity-0 w-full h-full cursor-pointer"
          name="profileImage"
        />
      </div>
      <div>
        <p className="font-bold">ORGANIZATION LOGO</p>
        <label className="block text-gray-600 mb-1">Upload here*</label>
      </div>
    </div>

    <div>
      <p className="font-bold mt-10">ORGANIZATION DETAILS</p>
      <label className="block text-gray-600 mb-1">Organization Name *</label>
      <input
        type="text"
        name="orgName"
        placeholder="Organization Name"
        value={formData.orgName}
        onChange={handleInputChange}
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
        required
      />
    </div>

    <div>
      <label className="block text-gray-600 mb-1">Website URL *</label>
      <input
        type="url"
        name="websiteUrl"
        value={formData.websiteUrl}
        onChange={handleInputChange}
        placeholder="e.g., https://example.org"
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
        required
      />
    </div>

    <div>
      <label className="block text-gray-600 mb-3">Organization Type *</label>
      <OrgType
        orgType={formData.orgType}
        setOrgType={(value) => setFormData({ ...formData, orgType: value })}
        required
      />
    </div>

    <div>
      <label className="block text-gray-600 mb-1">About Your Organization *</label>
      <textarea
        rows="1"
        name="about"
        value={formData.about}
        onChange={handleInputChange}
        placeholder="Write your mission and impact..."
        className="block w-full text-sm text-black-900 border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 resize-none"
      />
      <div className="flex items-center gap-2">
        <BadgeInfo />
        <p className="text-sm block text-gray-500 mt-1">
          Write 1-2 paragraphs to share your mission, describe your work, and highlight your impact.
        </p>
      </div>
    </div>

    <button
      type="button"
      className="w-full mt-5 bg-red-600 text-white text-center py-2 rounded-lg hover:bg-red-700"
      onClick={() => navigate("step2")}
    >
      Next
    </button>
  </form>
);

// Step 2 Component
const Step2 = ({ formData, handleInputChange }) => (
  <form className="space-y-4">
    <div>
      <label className="block text-gray-600 mb-1">Contact Email Address *</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Email Address"
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
        required
      />
    </div>

    <div>
      <label className="block text-gray-600 mb-1">Contact Number *</label>
      <input
        type="tel"
        name="phoneNo"
        value={formData.phoneNo}
        onChange={handleInputChange}
        placeholder="Contact Number"
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
        required
      />
    </div>
  </form>
);
