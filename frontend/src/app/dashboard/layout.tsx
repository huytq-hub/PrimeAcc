import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar />
        <div className="flex flex-1 flex-col lg:pl-64">
          <Navbar />
          <main className="flex-1 p-4 sm:p-6 lg:p-10 pb-24 md:pb-6">
            {children}
          </main>
          <MobileBottomNav />
        </div>
      </div>
    </ProtectedRoute>
  );
}
