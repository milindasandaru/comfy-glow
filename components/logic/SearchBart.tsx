import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search cities..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="glass-card h-12 rounded-xl border-0 pl-11 pr-4 text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary"
      />
    </div>
  );
};

export default SearchBar;
