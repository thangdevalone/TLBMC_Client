import React from 'react';
import {
    Command,
    CommandList,
    CommandItem,
    CommandGroup,
    CommandEmpty,
} from '@/components/ui/command';
import { type Tag as TagType } from './tag-input';
import { ScrollArea } from './scroll-area';
import { useAppSelector } from '@/app/hooks';

type AutocompleteProps = {
    tags: TagType[];
    setTags: React.Dispatch<React.SetStateAction<TagType[]>>;
    autocompleteOptions: TagType[];
    maxTags?: number;
    onTagAdd?: (tag: string) => void;
    allowDuplicates: boolean;
    children: React.ReactNode;

};

export const Autocomplete: React.FC<AutocompleteProps> = ({
    tags,
    setTags,
    autocompleteOptions,
    maxTags,
    onTagAdd,
    allowDuplicates,
    children,
}) => {
    const {commandHide}=useAppSelector(state=>state.app)
    return (
        <Command className="border relative">
            {children}
            {!commandHide && (
                <CommandList className="">
                    <ScrollArea className="h-[150px]">
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="Suggestions">
                            {autocompleteOptions.map((option) => (
                                <CommandItem key={option.id}>
                                    <div
                                        className="w-full cursor-pointer"
                                        onClick={() => {
                                            if (maxTags && tags.length >= maxTags) return;
                                            if (
                                                !allowDuplicates &&
                                                tags.some((tag) => tag.text.toLowerCase() === option.text.toLowerCase() )
                                            )
                                                return;
                                            setTags([...tags, option]);
                                            onTagAdd?.(option.text);
                                        }}
                                    >
                                        {option.text}
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </ScrollArea>
                </CommandList>
            )}
        </Command>
    );
};
