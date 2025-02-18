import React, { useState } from "react";

import { Building2, ChevronRight, Grid2X2Check } from "lucide-react";
import OrgSignUp from "../../components/forms/orgRegistration/OrgSignUp";
import OrgSignUp2 from "../../components/forms/orgRegistration/OrgSignUp2";



const OrgSignUpPage = () => {
    const [step, setStep] = useState(1);
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

    // Validate if all required fields are filled in the first step
    const validateStep1 = () => {
        const { orgName, websiteUrl, email, phoneNo, address } = formData;
        return orgName && websiteUrl && email && phoneNo && address; // Check all required fields
    };

    const handleNext = () => {
        if (step === 1 && !validateStep1()) {
            alert("Please fill out all required fields on the first step.");
            return; // Prevent moving to the next step if validation fails
        }
        setStep((prev) => prev + 1);
    };

    const handleBack = () => setStep((prev) => prev - 1);

    return (
        <div className="p-6 ">
            {/* Header Section */}
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold  text-orange-700 ">PlegeIt</h1>


                {/* Title and Info Section */}

                <h2 className="text-2xl font-bold text-gray-700 pb-5 mt-2">Create an Oganization account</h2>

            </div>

            <div className="flex items-center mb-6 justify-center">
                <span className={`border-2 rounded-full p-3 ${step === 1 ? "border-orange-500 bg-orange-100 text-orange-600" : "border-gray-400 bg-gray-50 text-gray-400"}`}><Building2 /></span>
                <span className={`flex items-center p-3 rounded-xl ${step === 1 ? "text-orange-500 font-bold" : "text-black"} mr-2`}> Oragnization Details </span>
                <span className="m-5 text-gray-600"><ChevronRight /> </span>
                <span className={`border-2 rounded-full p-3 ${step === 2 ? "border-orange-500 bg-orange-100 text-orange-600" : "border-gray-400 bg-gray-50 text-gray-400"}`}><Grid2X2Check /></span>
                <span className={`flex items-center p-3 rounded-xl ${step === 2 ? "text-orange-500 font-bold" : "text-black"} mr-2`}> Causes</span>
            </div>

            <div>
                {step === 1 && <OrgSignUp formData={formData} setFormData={setFormData}/>}
                {step === 2 && <OrgSignUp2 />}
            </div>

            <div className="flex justify-center">
                {step > 1 && <button onClick={handleBack} className="px-12 py-2 bg-red-600 text-white text-center py-2 rounded-lg hover:bg-red-700 mr-3">Back</button>}
                {step < 2 && <button onClick={handleNext} className="px-12 py-2 bg-red-600 text-white text-center py-2 rounded-lg hover:bg-red-700">Next</button>}
                {step === 2 && <button type="submit" className="px-10 py-2 bg-red-600 text-white text-center py-2 rounded-lg hover:bg-red-700">Submit</button>}
            </div>

            <div className="flex justify-center mt-5">
                <span className="mr-2"> Already have an account?</span>
                <a href="/logIn" className="font-bold text-red-400">Sign In</a>
            </div>


        </div>

    );

}
export default OrgSignUpPage