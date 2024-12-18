
import { MdLocationCity, MdOutlineHome, MdWorkOutline } from "react-icons/md";
import { HiOutlineUserGroup } from "react-icons/hi";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";


// Menu items.
const items = [
  {
    title: "Tableau de bord",
    url: "/dashboard",
    icon: MdOutlineHome,
  },
  {
    title: "Sites",
    url: "/sites",
    icon: MdLocationCity,
  },
  {
    title: "Postes",
    url: "/postes",
    icon: MdWorkOutline,
  },
  {
    title: "Employés",
    url: "/employes",
    icon: HiOutlineUserGroup,
  },
]

export function AppSidebar() {
  return (
    <Sidebar >
      <SidebarHeader className="bg-blue-500 text-white text-center py-4">
        <span className="text-xl font-medium uppercase">Signaletique</span>
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel></SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                    <item.icon className="text-blue-600 mr-3" />
                    <span className="text-base text-gray-800 font-semibold">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>

        </SidebarGroup>
      </SidebarContent>

    </Sidebar>
  )
}
