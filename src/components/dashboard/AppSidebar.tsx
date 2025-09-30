import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Users, FileText, Music, Plus, Clock } from "lucide-react"; // Added Plus and Clock icons

type TabType = "users" | "posts" | "musicians" | "add" | "requests"; // Added "requests"

export function AppSidebar({
  activeTab,
  setActiveTab,
}: {
  activeTab: TabType;
  setActiveTab: React.Dispatch<React.SetStateAction<TabType>>;
}) {
  return (
   <div className="">
  <Sidebar className="fixed top-16 border-none bg-sidebar h-screen  ">
    <SidebarContent className="bg-sidebar">
      <SidebarGroup  >
        <SidebarGroupContent   >
          <SidebarMenu>
            <SidebarMenuItem  >
              <SidebarMenuButton asChild isActive={activeTab === "users"}>
                <button className="cursor-pointer" onClick={() => setActiveTab("users")}>
                  <Users />
                  <span>Users</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={activeTab === "posts"}>
                <button className="cursor-pointer" onClick={() => setActiveTab("posts")}>
                  <FileText />
                  <span>Posts</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={activeTab === "musicians"}
              >
                <button className="cursor-pointer" onClick={() => setActiveTab("musicians")}>
                  <Music />
                  <span>Musicians</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={activeTab === "add"}>
                <button className="cursor-pointer" onClick={() => setActiveTab("add")}>
                  <Plus />
                  <span>Add Musician</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={activeTab === "requests"}
              >
                <button className="cursor-pointer" onClick={() => setActiveTab("requests")}>
                  <Clock />
                  <span>Requests</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</div>
  );
}
