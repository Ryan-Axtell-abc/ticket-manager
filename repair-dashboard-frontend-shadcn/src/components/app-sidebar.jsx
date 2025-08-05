import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  ChevronsUpDown,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebarRef,
} from "@/components/ui/sidebar"
import { IconCamera, IconChartBar, IconDashboard, IconDatabase, IconFileAi, IconFileDescription, IconFileWord, IconFolder, IconHelp, IconInnerShadowTop, IconInvoice, IconListDetails, IconReport, IconSearch, IconSettings, IconTicket, IconUsers } from "@tabler/icons-react"
import { NavSecondary } from "./nav-secondary"

import { useSidebar } from '@/components/ui/sidebar';
import { useEffect } from "react"


// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: IconDashboard,
    },
    {
      title: "Tickets",
      url: "/tickets",
      icon: IconTicket,
    },
    {
      title: "Customers",
      url: "/customers",
      icon: IconUsers,
    },
    {
      title: "Invoices",
      url: "/invoices",
      icon: IconInvoice,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
}

export function AppSidebar({
  ...props
}) {

  const sidebarRef = useSidebarRef(); 

  return (
    <Sidebar ref={sidebarRef} collapsible="icon" {...props}>

      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <a href="#"><div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                
                <IconInnerShadowTop className="!size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">PCI Business</span>
                <span className="truncate text-xs">Enterprise</span>
              </div>
              </a>
            </SidebarMenuButton>

          </SidebarMenuItem>
          
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>

      <SidebarRail />

    </Sidebar>
  );
}
