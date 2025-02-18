import CauseType from "./CauseType";


const OrgSignUp2 = () => {

    return (
        <div className="flex flex-col items-center mb-5 bg-gray-50">

            {/* Form Section */}
            <form
                // onSubmit={}
                className="space-y-4 w-180 bg-gray-50 rounded-lg px-10 py-8 border border-gray-300 border-opacity-50"
                encType="multipart/form-data"> {/*Required for sending files (e.g., images) with the form*/}

                {/* Form Fields */}

                <div>
                    <p>Select causes that your organization supports.</p>
                    <div>
                        <CauseType/>
                    </div>
                </div>

            </form>

        </div>

    );



}
export default OrgSignUp2;