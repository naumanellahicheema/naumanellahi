import { useState, KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function TagInput({ value = [], onChange, placeholder = "Add tag...", className = "" }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInputValue("");
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  return (
    <div className={`admin-input min-h-[42px] flex flex-wrap gap-2 p-2 ${className}`}>
      {value.map((tag, index) => (
        <span
          key={index}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md"
          style={{ 
            background: "hsl(var(--admin-accent))", 
            color: "hsl(var(--admin-accent-fg))" 
          }}
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(index)}
            className="hover:opacity-70 transition-opacity"
          >
            <X size={12} />
          </button>
        </span>
      ))}
      <div className="flex-1 flex items-center min-w-[120px]">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => inputValue && addTag(inputValue)}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 bg-transparent border-none outline-none text-sm p-0"
          style={{ color: "hsl(var(--admin-fg))" }}
        />
        {inputValue && (
          <button
            type="button"
            onClick={() => addTag(inputValue)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Plus size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
