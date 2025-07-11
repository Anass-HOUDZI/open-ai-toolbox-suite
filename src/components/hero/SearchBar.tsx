
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Command } from "lucide-react";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Implement search functionality
      console.log("Searching for:", query);
    }
  };

  return (
    <motion.form
      onSubmit={handleSearch}
      className="max-w-2xl mx-auto"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="relative">
        <motion.div
          className={`glass-premium rounded-full p-4 transition-all duration-300 ${
            isFocused ? "ring-2 ring-white/30" : ""
          }`}
          animate={{
            boxShadow: isFocused 
              ? "0 20px 40px rgba(0, 0, 0, 0.15)" 
              : "0 8px 32px rgba(0, 0, 0, 0.12)"
          }}
        >
          <div className="flex items-center space-x-4">
            <Search className="w-6 h-6 text-white/70 flex-shrink-0" />
            <input
              type="text"
              placeholder="Rechercher un outil... (Ctrl+K)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="flex-1 bg-transparent text-white placeholder-white/60 outline-none text-lg font-medium"
            />
            <div className="flex items-center space-x-2 text-white/50 text-sm">
              <Command className="w-4 h-4" />
              <span>K</span>
            </div>
          </div>
        </motion.div>
        
        {/* Animated border */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 opacity-0 -z-10"
          animate={{
            opacity: isFocused ? 0.6 : 0,
            scale: isFocused ? 1.02 : 1,
          }}
          transition={{ duration: 0.3 }}
          style={{ padding: "2px" }}
        />
      </div>
    </motion.form>
  );
};

export default SearchBar;
