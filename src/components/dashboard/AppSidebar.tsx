import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { Users, FileText, Music } from "lucide-react"; // icons of your choice
type TabType = "users" | "posts" | "musicians" | "add";

export function AppSidebar({
  activeTab,
  setActiveTab
}: {
  activeTab: TabType;
  setActiveTab: React.Dispatch<React.SetStateAction<TabType>>;
}) {
  return (
    <div className="">

    <Sidebar className="top-16 absolute border-none bg-white ">
      <SidebarContent className="bg-white ">
        <SidebarGroup>
          
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={activeTab === "users"}>
                  <button onClick={() => setActiveTab("users")}><Users /><span>Users</span></button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={activeTab === "posts"}>
                  <button onClick={() => setActiveTab("posts")}><FileText /><span>Posts</span></button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={activeTab === "musicians"}>
                  <button onClick={() => setActiveTab("musicians")}><Music /><span>Musicians</span></button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={activeTab === "add"}>
                  <button onClick={() => setActiveTab("add")}><Music /><span>Add Musician</span></button>
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
