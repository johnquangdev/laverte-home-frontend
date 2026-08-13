"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/utils/common";

import styles from "@/styles/autocomplete.module.css";

// Root component - manages open/close state and value
type AutocompleteContextValue = {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchText: string;
  onSearchChange: (text: string) => void;
  disabled?: boolean;
  getDisplayValue?: (value: string) => string;
  containerRef: React.RefObject<HTMLDivElement | null>;
};

const AutocompleteContext = React.createContext<
  AutocompleteContextValue | undefined
>(undefined);

function useAutocompleteContext() {
  const context = React.useContext(AutocompleteContext);
  if (!context) {
    throw new Error("Autocomplete components must be used within Autocomplete");
  }
  return context;
}

type AutocompleteProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  getDisplayValue?: (value: string) => string;
};

function Autocomplete({
  value: controlledValue,
  onValueChange,
  disabled = false,
  children,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  getDisplayValue,
}: AutocompleteProps) {
  const [internalValue, setInternalValue] = useState("");
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [searchText, setSearchText] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const value = controlledValue ?? internalValue;
  const open = controlledOpen ?? internalOpen;
  const onValueChangeHandler =
    onValueChange ??
    ((newValue: string) => {
      setInternalValue(newValue);
    });
  const onOpenChangeHandler =
    controlledOnOpenChange ??
    ((newOpen: boolean) => {
      setInternalOpen(newOpen);
    });

  const contextValue: AutocompleteContextValue = {
    value,
    onValueChange: onValueChangeHandler,
    open,
    onOpenChange: onOpenChangeHandler,
    searchText,
    onSearchChange: setSearchText,
    disabled,
    getDisplayValue,
    containerRef,
  };

  return (
    <AutocompleteContext.Provider value={contextValue}>
      <div ref={containerRef} className="relative" data-slot="autocomplete">
        {children}
      </div>
    </AutocompleteContext.Provider>
  );
}

// Trigger component - input field for search
type AutocompleteTriggerProps = Omit<
  React.ComponentProps<typeof Input>,
  "value" | "onChange" | "onFocus" | "onBlur" | "onKeyDown" | "size"
> & {
  placeholder?: string;
  size?: "sm" | "default";
};

function AutocompleteTrigger({
  className,
  size = "default",
  placeholder,
  ...props
}: AutocompleteTriggerProps) {
  const {
    open,
    onOpenChange,
    searchText,
    onSearchChange,
    value,
    disabled,
    getDisplayValue,
  } = useAutocompleteContext();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Reset search text when closing if value exists
  useEffect(() => {
    if (!open && value && searchText) {
      onSearchChange("");
    }
  }, [open, value, searchText, onSearchChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
    if (!open) {
      onOpenChange(true);
    }
  };

  const handleFocus = () => {
    if (!disabled) {
      onOpenChange(true);
      // Clear search text when focusing if we have a value
      if (value) {
        onSearchChange("");
      }
    }
  };

  const handleBlur = () => {
    // Don't close on blur, let click outside handle it
    // This prevents closing when clicking on an item
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      onOpenChange(false);
      onSearchChange("");
    }
  };

  // Display value when closed, search text when open
  const displayValue = open
    ? searchText
    : value && getDisplayValue
      ? getDisplayValue(value)
      : value || "";

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="text"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "font-montserrat w-full pr-8",
          size === "default" && "h-9",
          size === "sm" && "h-8",
          className
        )}
        {...props}
      />
      <ChevronDownIcon
        className={cn(
          "pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 opacity-50 transition-transform",
          open && "rotate-180"
        )}
      />
    </div>
  );
}

// Content component - dropdown container
type AutocompleteContentProps = {
  className?: string;
  children: React.ReactNode;
  position?: "popper" | "item-aligned";
  align?: "start" | "center" | "end";
};

function AutocompleteContent({
  className,
  children,
  position = "popper",
  align: _align = "center",
}: AutocompleteContentProps) {
  const { open, onOpenChange, containerRef } = useAutocompleteContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const [placement, setPlacement] = useState<"top" | "bottom">("bottom");
  const [positionStyle, setPositionStyle] = useState<
    React.CSSProperties | undefined
  >(undefined);

  // Calculate position and auto-flip
  useEffect(() => {
    if (!open || !contentRef.current || !containerRef.current) return;

    const autocompleteContainer = containerRef.current;
    const input = autocompleteContainer.querySelector("input");
    if (!input) return;

    const triggerRect = input.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;
    const estimatedDropdownHeight = 320; // max-h-80 = 320px

    // Determine placement based on available space
    const shouldPlaceOnTop =
      spaceBelow < estimatedDropdownHeight && spaceAbove > spaceBelow;

    const newPlacement = shouldPlaceOnTop ? "top" : "bottom";

    // Calculate position
    const top = shouldPlaceOnTop
      ? triggerRect.top - estimatedDropdownHeight - 2 // 2px gap
      : triggerRect.bottom + 2; // 2px gap

    setPlacement(newPlacement);
    setPositionStyle({
      position: "fixed",
      top: shouldPlaceOnTop ? undefined : top,
      bottom: shouldPlaceOnTop
        ? viewportHeight - triggerRect.top + 2
        : undefined,
      left: triggerRect.left,
      width: triggerRect.width,
      minWidth: triggerRect.width,
    });

    // Update on scroll/resize
    const updatePosition = () => {
      const newTriggerRect = input.getBoundingClientRect();
      const newSpaceBelow = window.innerHeight - newTriggerRect.bottom;
      const newSpaceAbove = newTriggerRect.top;
      const newShouldPlaceOnTop =
        newSpaceBelow < estimatedDropdownHeight &&
        newSpaceAbove > newSpaceBelow;

      const newPlacement = newShouldPlaceOnTop ? "top" : "bottom";
      const newTop = newShouldPlaceOnTop
        ? newTriggerRect.top - estimatedDropdownHeight - 2
        : newTriggerRect.bottom + 2;

      setPlacement(newPlacement);
      setPositionStyle({
        position: "fixed",
        top: newShouldPlaceOnTop ? undefined : newTop,
        bottom: newShouldPlaceOnTop
          ? window.innerHeight - newTriggerRect.top + 2
          : undefined,
        left: newTriggerRect.left,
        width: newTriggerRect.width,
        minWidth: newTriggerRect.width,
      });
    };

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, containerRef]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (
        open &&
        contentRef.current &&
        containerRef.current &&
        !contentRef.current.contains(target) &&
        !containerRef.current.contains(target)
      ) {
        onOpenChange(false);
      }
    };

    if (open) {
      // Use setTimeout to avoid closing immediately when clicking trigger
      const timeoutId = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [open, onOpenChange, containerRef]);

  if (!open) return null;

  return (
    <div
      ref={contentRef}
      data-slot="autocomplete-content"
      data-side={placement}
      style={positionStyle}
      className={cn(
        "text-primary border-beige animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-80 w-full min-w-48 overflow-x-hidden overflow-y-auto rounded-none border bg-white shadow-md",
        styles.autocompleteContent,
        placement === "top" ? "origin-bottom" : "origin-top",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
    >
      {children}
    </div>
  );
}

// Viewport component - scrollable container
function AutocompleteViewport({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="autocomplete-viewport"
      className={cn("p-1", className)}
      {...props}
    >
      {children}
    </div>
  );
}

// Label component
function AutocompleteLabel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="autocomplete-label"
      className={cn("text-gray px-2 py-1.5 text-xs", className)}
      {...props}
    />
  );
}

// Item component
type AutocompleteItemProps = {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

function AutocompleteItem({
  value,
  children,
  className,
  disabled = false,
}: AutocompleteItemProps) {
  const {
    value: selectedValue,
    onValueChange,
    onOpenChange,
    onSearchChange,
  } = useAutocompleteContext();

  const handleClick = () => {
    if (!disabled) {
      onValueChange(value);
      onOpenChange(false);
      onSearchChange("");
    }
  };

  const isSelected = selectedValue === value;

  return (
    <button
      type="button"
      data-slot="autocomplete-item"
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "text-primary focus:bg-background-2 focus:text-primary [&_svg:not([class*='text-'])]:text-gray hover:bg-background-2 relative flex w-full cursor-default items-center gap-2 rounded-none py-1.5 pr-8 pl-2 text-sm outline-hidden select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        isSelected && "bg-background-2",
        className
      )}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        {isSelected && <CheckIcon className="size-4" />}
      </span>
      <span>{children}</span>
    </button>
  );
}

// Separator component
function AutocompleteSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="autocomplete-separator"
      className={cn("bg-beige pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

// Group component
function AutocompleteGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div data-slot="autocomplete-group" className={className} {...props} />
  );
}

// Empty state component
function AutocompleteEmpty({
  className,
  children = "Không tìm thấy kết quả",
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="autocomplete-empty"
      className={cn("text-gray px-2 py-4 text-center text-sm", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteItem,
  AutocompleteLabel,
  AutocompleteSeparator,
  AutocompleteTrigger,
  AutocompleteViewport,
  useAutocompleteContext,
};
