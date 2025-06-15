
import { useState } from "react";
import { Menu, RefreshCcw, Download, Upload, User } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function UserMenuDropdown() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative ml-auto">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-full shadow hover:bg-gray-100 border border-gray-200"
      >
        <User className="mr-2" />
        Utilisateur
        <Menu className="ml-2" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-30 animate-fade-in">
          <button
            className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
            onClick={() => {
              setOpen(false);
              toast({ title: "Actualisé", description: "Les données ont été actualisées." });
            }}
          >
            <RefreshCcw className="w-4 h-4 mr-2" /> Actualiser
          </button>
          <button
            className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
            onClick={() => {
              setOpen(false);
              toast({ title: "Exportation réussie", description: "Les données ont été exportées !" });
            }}
          >
            <Download className="w-4 h-4 mr-2" /> Exporter
          </button>
          <button
            className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
            onClick={() => {
              setOpen(false);
              toast({ title: "Importation réussie", description: "Les données ont été importées." });
            }}
          >
            <Upload className="w-4 h-4 mr-2" /> Importer
          </button>
        </div>
      )}
    </div>
  );
}
