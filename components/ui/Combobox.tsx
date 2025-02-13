'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
    Command, 
    CommandEmpty, 
    CommandGroup, 
    CommandInput, 
    CommandItem, 
    CommandList 
} from '@/components/ui/command';
import { 
    Popover, 
    PopoverContent, 
    PopoverTrigger 
} from '@/components/ui/popover';

export interface ComboboxProps<T> {
    items: T[];
    onSelect: (item: T) => void;
    getOptionLabel?: (item: T) => string;
    getOptionValue?: (item: T) => string;
    placeholder?: string;
    disabled?: boolean;
}

export function Combobox<T>({ 
    items, 
    onSelect, 
    getOptionLabel = (item: T) => String(item),
    getOptionValue = (item: T) => String(item),
    placeholder = 'Select item...', 
    disabled = false 
}: ComboboxProps<T>) {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredItems = items.filter(
        (item) => getOptionLabel(item).toLowerCase().includes(inputValue.toLowerCase())
    );

    const handleSelect = (currentItem: T) => {
        onSelect(currentItem);
        setInputValue('');
        setOpen(false);
    };

    useEffect(() => {
        if (open && inputRef.current) {
            inputRef.current.focus();
        }
    }, [open]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={disabled}
                >
                    {inputValue
                        ? inputValue
                        : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput
                        ref={inputRef}
                        placeholder={placeholder}
                        value={inputValue}
                        onValueChange={setInputValue}
                    />
                    <CommandList>
                        <CommandEmpty>No items found.</CommandEmpty>
                        <CommandGroup>
                            {filteredItems.map((item) => (
                                <CommandItem
                                    key={getOptionValue(item)}
                                    value={getOptionLabel(item)}
                                    onSelect={() => handleSelect(item)}
                                >
                                    {getOptionLabel(item)}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}