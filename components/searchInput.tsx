import { Button } from "@/components/ui/button"; // ShadCN Button
import { Input } from "@/components/ui/input"; // ShadCN Input
import React from "react";
import {  FaTimes } from "react-icons/fa";

interface SearchInputProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative w-full sm:max-w-[20%]">
      {/* Search Icon */}
      {/* <div className="absolute inset-y-0 left-0 flex items-center pl-3">
        <FaSearch className="text-gray-500" />
      </div> */}

      {/* Input Field */}
      <Input
        type="text"
        placeholder="Recherche..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 pr-10 bg-white h-10" // Add consistent height for alignment
      />

      {/* Clear Button */}
      {searchTerm && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          onClick={() => setSearchTerm("")}
        >
          <FaTimes className="text-gray-500" />
        </Button>
      )}
    </div>
  );
};

export default SearchInput;
