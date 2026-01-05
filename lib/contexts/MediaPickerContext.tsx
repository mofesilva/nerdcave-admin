"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import MediaPickerModal from "@/components/MediaPickerModal";
import { Media } from "@/lib/medias/Media.model";

interface MediaPickerContextType {
    openPicker: (options?: MediaPickerOptions) => Promise<Media | Media[] | null>;
}

interface MediaPickerOptions {
    multiple?: boolean;
}

const MediaPickerContext = createContext<MediaPickerContextType | null>(null);

export function useMediaPicker() {
    const context = useContext(MediaPickerContext);
    if (!context) {
        throw new Error("useMediaPicker must be used within MediaPickerProvider");
    }
    return context;
}

interface MediaPickerProviderProps {
    children: ReactNode;
}

export function MediaPickerProvider({ children }: MediaPickerProviderProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [multiple, setMultiple] = useState(false);
    const [resolveRef, setResolveRef] = useState<((value: Media | Media[] | null) => void) | null>(null);

    const openPicker = useCallback((options?: MediaPickerOptions): Promise<Media | Media[] | null> => {
        setMultiple(options?.multiple ?? false);
        setIsOpen(true);

        return new Promise((resolve) => {
            setResolveRef(() => resolve);
        });
    }, []);

    const handleSelect = useCallback((media: Media) => {
        if (resolveRef) {
            resolveRef(media);
        }
        setIsOpen(false);
        setResolveRef(null);
    }, [resolveRef]);

    const handleSelectMultiple = useCallback((media: Media[]) => {
        if (resolveRef) {
            resolveRef(media);
        }
        setIsOpen(false);
        setResolveRef(null);
    }, [resolveRef]);

    const handleClose = useCallback(() => {
        if (resolveRef) {
            resolveRef(null);
        }
        setIsOpen(false);
        setResolveRef(null);
    }, [resolveRef]);

    return (
        <MediaPickerContext.Provider value={{ openPicker }}>
            {children}
            {isOpen && (
                <MediaPickerModal
                    isOpen={isOpen}
                    onClose={handleClose}
                    onSelect={handleSelect}
                    multiple={multiple}
                    onSelectMultiple={handleSelectMultiple}
                />
            )}
        </MediaPickerContext.Provider>
    );
}
