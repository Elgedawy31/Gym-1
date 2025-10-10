"use client"

import * as React from "react"
import {
  IconDashboard,
  IconHelp,
  IconListDetails,
  IconMenuOrder,
  IconSearch,
  IconSettings,
  IconSubscript,
  IconUsers,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { useAuthStore } from "@/features/auth/store/authStore"

const data = {
  navMain: [
    {
      title: "Stats",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Products",
      url: "/dashboard/products",
      icon: IconListDetails,
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: IconUsers,
    },
    {
      title: "Orders",
      url: "/dashboard/orders",
      icon: IconMenuOrder,
    },
    {
      title: "Subscriptions",
      url: "/dashboard/subscriptions",
      icon: IconSubscript,
    },    
    {
      title: "Subscriptions For Trainer",
      url: "/dashboard/subscriptions-trainers",
      icon: IconSubscript,
    },
  ],

  //   },
  //   {
  //     title: "Proposal",
  //     icon: IconFileDescription,
  //     url: "#",
  //     items: [
  //       {
  //         title: "Active Proposals",
  //         url: "#",
  //       },
  //       {
  //         title: "Archived",
  //         url: "#",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Prompts",
  //     icon: IconFileAi,
  //     url: "#",
  //     items: [
  //       {
  //         title: "Active Proposals",
  //         url: "#",
  //       },
  //       {
  //         title: "Archived",
  //         url: "#",
  //       },
  //     ],
  //   },
  // ],
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore();
  return (
    <Sidebar collapsible="offcanvas" {...props} className="top-19">
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="mb-20">
        {user &&
        <NavUser user={user} />
        }
      </SidebarFooter>
    </Sidebar>
  )
}
