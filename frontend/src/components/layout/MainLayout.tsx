import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import AuditPage from "../../pages/AuditPage";
import SOPPage from "../../pages/SOPPage";

export default function MainLayout() {
  const [currentPage, setCurrentPage] = useState<"audit" | "sop">("audit");

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8">
          {currentPage === "audit" ? <AuditPage /> : <SOPPage />}
        </main>
      </div>
    </div>
  );
}
