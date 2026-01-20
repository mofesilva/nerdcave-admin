"use client";

import { generateHTML } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TipTapLink from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { TiptapContent } from '@/types/TiptapContent.types';

const lowlight = createLowlight(common);

/**
 * Extensões do Tiptap usadas no editor.
 * Necessário para serialização consistente.
 */
const extensions = [
    StarterKit.configure({
        codeBlock: false,
    }),
    Underline,
    Highlight.configure({
        multicolor: true,
    }),
    TextAlign.configure({
        types: ['heading', 'paragraph'],
    }),
    TipTapLink.configure({
        openOnClick: false,
        HTMLAttributes: {
            class: 'text-primary underline',
        },
    }),
    Image.configure({
        HTMLAttributes: {
            class: 'rounded-md max-w-full',
        },
    }),
    CodeBlockLowlight.configure({
        lowlight,
    }),
];

/**
 * Converte conteúdo Tiptap JSON para HTML.
 * Útil para renderizar conteúdo no frontend público.
 */
export function tiptapToHtml(content: TiptapContent | null): string {
    if (!content) return '';

    try {
        return generateHTML(content, extensions);
    } catch (error) {
        console.error('Erro ao converter Tiptap para HTML:', error);
        return '';
    }
}
