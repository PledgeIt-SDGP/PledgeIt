

import Sidebar from "../components/Sidebar";

const VolunteerDashboard = ({ children }) => {

    return (
        <>
            <div className="flex">
                <Sidebar />
                <main className="flex-1">
                    {children}
                </main>
            </div>

        </>

    );

}
export default VolunteerDashboard;