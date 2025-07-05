import Breadcrumb from "@/component/Admin/Breadcrumb";
import ChatAdminLayout from "@/Layout/Admin/chatadminlayout";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ChatAdminLayout>
      <Breadcrumb/>
      {children}
    </ChatAdminLayout>
  );
}
