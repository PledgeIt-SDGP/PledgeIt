import { BadgeInfo, ImagePlus } from "lucide-react";
import React from "react";
import { useState } from 'react';
import OrgType from "../../components/forms/organization/orgType";
import { Link } from 'react-router-dom';


const OrgSignUp = () => {
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    orgName: '',
    websiteUrl: '',
    orgType: 'Private Business',
    email: "",
    phoneNo: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  // Handle form field change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Create a URL for the selected file
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 pb-10">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold  text-orange-700 ">PlegeIt</h1>
      </div>

      {/* Title and Info Section */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-700 pb-5">Create an Oganization account</h2>

      </div>


      {/* Form Section */}
      <form
        // onSubmit={}
        className="space-y-4 w-160 bg-gray-50 rounded-lg px-10 py-8 border border-gray-300 border-opacity-50"
        encType="multipart/form-data"> {/*Required for sending files (e.g., images) with the form*/}

        <div className="flex items-center space-x-4">
          <div className="relative w-25 h-25 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center bg-gray-200 overflow-hidden cursor-pointer">
            {image ? (
              <img
                src={image}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-3xl text-gray-600"><ImagePlus /></span> // Placeholder when no image is uploaded
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


        {/* Form Fields */}
        <div>
          <p className="font-bold mt-10">ORGANIZATION DETAILS</p>
          <label className="block text-gray-600 mb-1">Oragnization Name *</label>
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
          <label className="block text-gray-600 mb-1">Website Url *</label>
          <input
            type="url"
            name="websiteUrl"
            value={formData.websiteUrl}
            onChange={handleInputChange}
            placeholder="ex: https://volunteers.org/"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
        </div>


        <div>
          <label className="block text-gray-600 mb-1">Email Address *</label>
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
          <label className="block text-gray-600 mb-3">Organization Type *</label>
          <OrgType orgType={formData.orgType} setOrgType={(value) => setFormData({ ...formData, orgType: value })} required />


        </div>


        <div>
          <label className="block text-gray-600 mb-1">About Your Organization *</label>
          <textarea rows="1" class="block p-2.5 w-full text-sm text-black-900 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 resize-none" placeholder="Write your thoughts here..."></textarea>
          <div className="flex items-center gap-2">
            <BadgeInfo /><p className="text-sm block text-gray-500 mt-1 ">Write 1-2 paragraphs to share your mission,describe the work you do, and highlight the impact you make </p>
          </div>
        </div>

        <div>
          <label className="block text-gray-600 mb-1">Contact Email Address *</label>
          <input
            type="email"
            name="email"
            // value={formData.email}
            // onChange={handleInputChange}
            placeholder="Email Address"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-1">Contact Number *</label>
          <input
            type="tel"
            name="PhoneNo"
            // value={formData.email}
            // onChange={handleInputChange}
            placeholder="+94"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-1">Address *</label>
          <input
            type=""
            name="email"
            // value={formData.email}
            // onChange={handleInputChange}
            placeholder="e.g.: "
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <p className="w-full mt-5 bg-red-600 text-white text-center py-2 rounded-lg hover:bg-red-700">
          <Link to="/OrgSignUp2">Next</Link>
        </p>


      </form>
      <span className="mt-5"> Already have an account?</span>
      <a href="/logIn" className="font-bold text-red-400">Sign In</a>
    </div>
  );
};

export default OrgSignUp;