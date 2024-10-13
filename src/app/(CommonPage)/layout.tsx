
import UserDashboard from "@/components/UI/UserDashboard";



export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <UserDashboard />
      <main>{children}</main>
    </div>
  );
}
