"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ExpandableSearchProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  handleSearch: (query: string) => void;
}

const ExpandableSearch: React.FC<ExpandableSearchProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  return (
    <div className="relative" ref={searchRef}>
      <form onSubmit={handleSubmit} className="flex items-center">
        <div
          className={`flex items-center overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? "w-64" : "w-10"
          }`}
        >
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`pl-10 pr-4 py-2 w-full transition-all duration-300 ease-in-out ${
              isExpanded ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute left-0 top-0 h-full"
          onClick={() => {
            if (!isExpanded) {
              setIsExpanded(true);
            } else {
              handleSearch(searchQuery);
            }
          }}
        >
          <Search className="h-4 w-4" />
          <span className="sr-only">
            {isExpanded ? "Submit search" : "Expand search"}
          </span>
        </Button>
      </form>
    </div>
  );
};

export default ExpandableSearch;
