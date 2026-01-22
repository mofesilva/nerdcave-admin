"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TipTapLink from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { useCallback, useState, useEffect, useRef } from 'react';
import { TiptapContent, EMPTY_TIPTAP_CONTENT, extractTextFromTiptap } from '@/types/TiptapContent.types';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Code,
    Heading2,
    List,
    Quote,
    Link as LinkIcon,
    Image as ImageIcon,
    Code2,
    Minus,
} from 'lucide-react';

const lowlight = createLowlight(common);

interface MediumStyleEditorProps {
    content: TiptapContent | null;
    onChange: (content: TiptapContent) => void;
    onInsertImage?: (callback: (url: string, alt: string) => void) => void;
    placeholder?: string;
}

export default function MediumStyleEditor({
    content,
    onChange,
    onInsertImage,
    placeholder = "Conte sua história..."
}: MediumStyleEditorProps) {
    const [showBubbleMenu, setShowBubbleMenu] = useState(false);
    const [showFloatingMenu, setShowFloatingMenu] = useState(false);
    const [bubbleMenuPosition, setBubbleMenuPosition] = useState({ top: 0, left: 0 });
    const [floatingMenuPosition, setFloatingMenuPosition] = useState({ top: 0, left: 0 });
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const editorRef = useRef<HTMLDivElement>(null);

    const initialContent = content ?? EMPTY_TIPTAP_CONTENT;

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
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
                    class: 'text-primary underline cursor-pointer',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full my-8 mx-auto',
                },
            }),
            Placeholder.configure({
                placeholder,
                emptyEditorClass: 'is-editor-empty',
            }),
            CodeBlockLowlight.configure({
                lowlight,
            }),
        ],
        content: initialContent,
        onUpdate: ({ editor }) => {
            onChange(editor.getJSON() as TiptapContent);
        },
        onSelectionUpdate: ({ editor }) => {
            const { from, to, empty } = editor.state.selection;

            // Bubble menu: aparece quando há texto selecionado
            if (!empty && from !== to) {
                const { view } = editor;
                const start = view.coordsAtPos(from);
                const end = view.coordsAtPos(to);

                if (editorRef.current) {
                    const editorRect = editorRef.current.getBoundingClientRect();
                    setBubbleMenuPosition({
                        top: start.top - editorRect.top - 50,
                        left: (start.left + end.left) / 2 - editorRect.left,
                    });
                }
                setShowBubbleMenu(true);
                setShowFloatingMenu(false);
            } else {
                setShowBubbleMenu(false);

                // Floating menu: aparece em linhas vazias
                const { $anchor } = editor.state.selection;
                const isEmptyLine = $anchor.parent.content.size === 0;
                const isTopLevel = $anchor.depth === 1;

                if (isEmptyLine && isTopLevel) {
                    const { view } = editor;
                    const pos = view.coordsAtPos($anchor.pos);

                    if (editorRef.current) {
                        const editorRect = editorRef.current.getBoundingClientRect();
                        setFloatingMenuPosition({
                            top: pos.top - editorRect.top - 5,
                            left: -50,
                        });
                    }
                    setShowFloatingMenu(true);
                } else {
                    setShowFloatingMenu(false);
                }
            }
        },
        editorProps: {
            attributes: {
                class: 'medium-editor max-w-none min-h-[60vh] focus:outline-none',
            },
        },
    });

    useEffect(() => {
        if (!editor) return;
        const currentJson = JSON.stringify(editor.getJSON());
        const newJson = JSON.stringify(content ?? EMPTY_TIPTAP_CONTENT);
        if (content && currentJson !== newJson) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    const setLink = useCallback(() => {
        if (!editor) return;
        if (linkUrl === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
        } else {
            editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
        }
        setShowLinkInput(false);
        setLinkUrl('');
    }, [editor, linkUrl]);

    if (!editor) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-muted-foreground">Carregando editor...</div>
            </div>
        );
    }

    const ToolbarButton = ({
        onClick,
        isActive = false,
        children,
        title,
        variant = 'bubble'
    }: {
        onClick: () => void;
        isActive?: boolean;
        children: React.ReactNode;
        title?: string;
        variant?: 'bubble' | 'floating';
    }) => {
        if (variant === 'bubble') {
            return (
                <button
                    type="button"
                    onClick={onClick}
                    title={title}
                    className={`p-2 rounded-md transition-colors ${isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-foreground hover:bg-muted'
                        }`}
                >
                    {children}
                </button>
            );
        }

        return (
            <button
                type="button"
                onClick={onClick}
                title={title}
                className={`p-2 rounded-md transition-colors ${isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
            >
                {children}
            </button>
        );
    };

    return (
        <div className="medium-style-editor relative" ref={editorRef}>
            {/* Bubble Menu - aparece ao selecionar texto */}
            {showBubbleMenu && (
                <div
                    className="absolute z-50 bg-card rounded-lg shadow-xl border border-border flex items-center gap-0.5 p-1.5 animate-in fade-in duration-150"
                    style={{
                        top: bubbleMenuPosition.top,
                        left: bubbleMenuPosition.left,
                        transform: 'translateX(-50%)',
                    }}
                >
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                        variant="bubble"
                        title="Negrito"
                    >
                        <Bold className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                        variant="bubble"
                        title="Itálico"
                    >
                        <Italic className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        isActive={editor.isActive('underline')}
                        variant="bubble"
                        title="Sublinhado"
                    >
                        <UnderlineIcon className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        isActive={editor.isActive('strike')}
                        variant="bubble"
                        title="Riscado"
                    >
                        <Strikethrough className="w-4 h-4" />
                    </ToolbarButton>

                    <div className="w-px h-5 bg-border mx-1" />

                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        isActive={editor.isActive('code')}
                        variant="bubble"
                        title="Código"
                    >
                        <Code className="w-4 h-4" />
                    </ToolbarButton>

                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHighlight().run()}
                        isActive={editor.isActive('highlight')}
                        variant="bubble"
                        title="Destacar"
                    >
                        <span className="w-4 h-4 flex items-center justify-center text-xs font-bold">H</span>
                    </ToolbarButton>

                    <div className="w-px h-5 bg-border mx-1" />

                    {/* Link */}
                    <div className="relative">
                        <ToolbarButton
                            onClick={() => {
                                if (editor.isActive('link')) {
                                    editor.chain().focus().unsetLink().run();
                                } else {
                                    setShowLinkInput(!showLinkInput);
                                }
                            }}
                            isActive={editor.isActive('link')}
                            variant="bubble"
                            title="Link"
                        >
                            <LinkIcon className="w-4 h-4" />
                        </ToolbarButton>
                        {showLinkInput && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 bg-card border border-border rounded-lg p-2 flex gap-2 shadow-xl">
                                <input
                                    type="url"
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="bg-background border border-border rounded-md px-3 py-1.5 text-sm w-56 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') setLink();
                                        if (e.key === 'Escape') setShowLinkInput(false);
                                    }}
                                />
                                <button
                                    onClick={setLink}
                                    className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                                >
                                    OK
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Floating Menu - aparece em linhas vazias */}
            {showFloatingMenu && (
                <div
                    className="absolute z-50 flex items-center gap-1 animate-in fade-in slide-in-from-left-2 duration-150"
                    style={{
                        top: floatingMenuPosition.top,
                        left: floatingMenuPosition.left,
                    }}
                >
                    <div className="bg-card border border-border rounded-lg shadow-lg flex items-center gap-0.5 p-1">
                        <ToolbarButton
                            onClick={() => { editor.chain().focus().toggleHeading({ level: 2 }).run(); setShowFloatingMenu(false); }}
                            variant="floating"
                            title="Título"
                        >
                            <Heading2 className="w-4 h-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => { editor.chain().focus().toggleBulletList().run(); setShowFloatingMenu(false); }}
                            variant="floating"
                            title="Lista"
                        >
                            <List className="w-4 h-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => { editor.chain().focus().toggleBlockquote().run(); setShowFloatingMenu(false); }}
                            variant="floating"
                            title="Citação"
                        >
                            <Quote className="w-4 h-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => { editor.chain().focus().toggleCodeBlock().run(); setShowFloatingMenu(false); }}
                            variant="floating"
                            title="Código"
                        >
                            <Code2 className="w-4 h-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => { editor.chain().focus().setHorizontalRule().run(); setShowFloatingMenu(false); }}
                            variant="floating"
                            title="Divisor"
                        >
                            <Minus className="w-4 h-4" />
                        </ToolbarButton>
                        {onInsertImage && (
                            <ToolbarButton
                                onClick={() => {
                                    setShowFloatingMenu(false);
                                    onInsertImage((url: string, alt: string) => {
                                        editor.chain().focus().setImage({ src: url, alt }).run();
                                    });
                                }}
                                variant="floating"
                                title="Imagem"
                            >
                                <ImageIcon className="w-4 h-4" />
                            </ToolbarButton>
                        )}
                    </div>
                </div>
            )}

            {/* Editor Content */}
            <div
                className="medium-editor-wrapper"
                style={{
                    fontFamily: 'Charter, "Bitstream Charter", "Sitka Text", Cambria, serif',
                    fontSize: '1.25rem',
                    lineHeight: '1.8',
                }}
            >
                <style>{`
                    .medium-editor-wrapper .ProseMirror * {
                        font-family: inherit;
                    }
                    .medium-editor-wrapper .ProseMirror h1,
                    .medium-editor-wrapper .ProseMirror h2,
                    .medium-editor-wrapper .ProseMirror h3,
                    .medium-editor-wrapper .ProseMirror h4,
                    .medium-editor-wrapper .ProseMirror h5,
                    .medium-editor-wrapper .ProseMirror h6 {
                        font-family: inherit;
                        font-weight: 700;
                        line-height: 1.3;
                        margin-top: 1.5em;
                        margin-bottom: 0.5em;
                    }
                    .medium-editor-wrapper .ProseMirror h1 { font-size: 2rem; }
                    .medium-editor-wrapper .ProseMirror h2 { font-size: 1.5rem; }
                    .medium-editor-wrapper .ProseMirror h3 { font-size: 1.25rem; }
                    .medium-editor-wrapper .ProseMirror p {
                        margin-bottom: 1.25em;
                    }
                    .medium-editor-wrapper .ProseMirror blockquote {
                        font-family: inherit;
                        font-style: italic;
                        border-left: 3px solid var(--primary);
                        padding-left: 1.5em;
                        margin-left: 0;
                        color: var(--muted-foreground);
                    }
                    .medium-editor-wrapper .ProseMirror ul,
                    .medium-editor-wrapper .ProseMirror ol {
                        padding-left: 1.5em;
                        margin-bottom: 1.25em;
                    }
                    .medium-editor-wrapper .ProseMirror li {
                        margin-bottom: 0.5em;
                    }
                    .medium-editor-wrapper .ProseMirror code {
                        font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
                        background: var(--muted);
                        padding: 0.2em 0.4em;
                        border-radius: 4px;
                        font-size: 0.9em;
                    }
                    .medium-editor-wrapper .ProseMirror pre {
                        font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
                        background: var(--muted);
                        padding: 1em;
                        border-radius: 8px;
                        overflow-x: auto;
                    }
                    .medium-editor-wrapper .ProseMirror hr {
                        border: none;
                        text-align: center;
                        margin: 2em 0;
                    }
                    .medium-editor-wrapper .ProseMirror hr::before {
                        content: '• • •';
                        color: var(--muted-foreground);
                        font-size: 1.5em;
                        letter-spacing: 1em;
                    }
                    .medium-editor-wrapper .ProseMirror p.is-editor-empty:first-child::before {
                        content: attr(data-placeholder);
                        float: left;
                        color: var(--muted-foreground);
                        pointer-events: none;
                        height: 0;
                        font-style: italic;
                    }
                `}</style>
                <EditorContent editor={editor} />
            </div>

            {/* Footer com contagem de palavras */}
            <div className="mt-8 pt-4 border-t border-border/50 text-sm text-muted-foreground flex justify-center gap-6">
                <span>{extractTextFromTiptap(editor.getJSON() as TiptapContent).split(/\s+/).filter(Boolean).length} palavras</span>
                <span>·</span>
                <span>{Math.max(1, Math.ceil(extractTextFromTiptap(editor.getJSON() as TiptapContent).split(/\s+/).filter(Boolean).length / 200))} min de leitura</span>
            </div>
        </div>
    );
}
