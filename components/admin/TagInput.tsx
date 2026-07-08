"use client";

import { useState, KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  label?: string;
  placeholder?: string;
}

export default function TagInput({
  tags,
  onChange,
  label = "Tags",
  placeholder = "Add a tag and press Enter",
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const addTag = () => {
    const newTag = inputValue.trim().replace(/,$/, ""); // Remove trailing comma if they typed one
    if (newTag && !tags.includes(newTag)) {
      onChange([...tags, newTag]);
      setInputValue("");
    }
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-content-dim">
          {label}
        </label>
      )}

      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-violet/10 text-violet rounded-lg text-sm font-medium"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="hover:text-red-500 hover:bg-red-500/10 rounded-full p-0.5 transition-colors"
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>

      <div className="relative flex items-center">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          className="w-full pl-4 pr-10 py-3 bg-[var(--input-bg)] border border-subtle rounded-xl text-content placeholder:text-content-dim/40 focus:border-violet/40 focus:outline-none transition-all duration-300"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={addTag}
          className="absolute right-2 p-1.5 text-content-dim hover:text-violet hover:bg-violet/10 rounded-lg transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>
      <p className="text-xs text-content-dim/70 mt-1">
        Press Enter or comma to add
      </p>
    </div>
  );
}
