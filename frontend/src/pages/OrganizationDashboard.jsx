

import Sidebar from "../components/Sidebar";

const OrganizationDashboard = ({ children }) => {

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
export default OrganizationDashboard