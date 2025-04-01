import Sidebar from "../../components/vol-dash/VolSidebar";

const VolunteerDashboard = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto bg-gray-100">{children}</main>
    </div>
  );
};

export default VolunteerDashboard;