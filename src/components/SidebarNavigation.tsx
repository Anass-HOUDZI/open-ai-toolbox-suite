
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Palette, FileText, Wrench, Image as ImageIcon, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  { name: "Création Visuelle", icon: <Palette className="text-pink-500" />, path: "/visual" },
  { name: "Traitement de Texte", icon: <FileText className="text-blue-500" />, path: "/text" },
  { name: "Outils Développement", icon: <Wrench className="text-green-500" />, path: "/dev" },
  { name: "Audio & Image", icon: <ImageIcon className="text-yellow-500" />, path: "/media" },
  { name: "Sécurité", icon: <Lock className="text-red-500" />, path: "/security" },
];

export default function SidebarNavigation() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Catégories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((cat) => (
                <SidebarMenuItem key={cat.name}>
                  <SidebarMenuButton asChild>
                    <Link to={cat.path} className="flex items-center gap-2">
                      {cat.icon}
                      <span>{cat.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
