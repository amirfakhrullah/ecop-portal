import { SidebarLink } from "@/components/SidebarItems";
import { Cog, Globe, HomeIcon } from "lucide-react";

type AdditionalLinks = {
  title: string;
  links: SidebarLink[];
};

export const defaultLinks: SidebarLink[] = [
  { href: "/dashboard", title: "Home", icon: HomeIcon },
  { href: "/account", title: "Account", icon: Cog },
  { href: "/settings", title: "Settings", icon: Cog },
];

export const additionalLinks: AdditionalLinks[] = [
  {
    title: "Entities",
    links: [
      {
        href: "/liaison-requests",
        title: "Liaison Requests",
        icon: Globe,
      },
      {
        href: "/client-requests",
        title: "Client Requests",
        icon: Globe,
      },
      {
        href: "/teams",
        title: "Teams",
        icon: Globe,
      },
      {
        href: "/companies",
        title: "Companies",
        icon: Globe,
      },
    ],
  },

];

