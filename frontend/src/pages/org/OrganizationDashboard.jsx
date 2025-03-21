

import Sidebar from "../../components/org-dash/OrgSidebar";

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