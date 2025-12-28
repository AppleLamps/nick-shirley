'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { useCallback, useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto',
        },
      }),
    ],
    content: content || '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[200px] p-3 focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('Image URL');

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return (
      <div className="border border-gray-300 min-h-[250px] flex items-center justify-center">
        <span className="text-gray-400 text-sm">Loading editor...</span>
      </div>
    );
  }

  return (
    <div className="border border-gray-300">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 text-xs font-sans border ${
            editor.isActive('bold') ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'
          }`}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 text-xs font-sans border ${
            editor.isActive('italic') ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'
          }`}
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-2 py-1 text-xs font-sans border ${
            editor.isActive('strike') ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'
          }`}
        >
          Strike
        </button>
        <span className="border-l border-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-2 py-1 text-xs font-sans border ${
            editor.isActive('heading', { level: 1 }) ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'
          }`}
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 text-xs font-sans border ${
            editor.isActive('heading', { level: 2 }) ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'
          }`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-2 py-1 text-xs font-sans border ${
            editor.isActive('heading', { level: 3 }) ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'
          }`}
        >
          H3
        </button>
        <span className="border-l border-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 text-xs font-sans border ${
            editor.isActive('bulletList') ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'
          }`}
        >
          Bullet
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 text-xs font-sans border ${
            editor.isActive('orderedList') ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'
          }`}
        >
          Number
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-2 py-1 text-xs font-sans border ${
            editor.isActive('blockquote') ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'
          }`}
        >
          Quote
        </button>
        <span className="border-l border-gray-300 mx-1" />
        <button
          type="button"
          onClick={setLink}
          className={`px-2 py-1 text-xs font-sans border ${
            editor.isActive('link') ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'
          }`}
        >
          Link
        </button>
        <button
          type="button"
          onClick={addImage}
          className="px-2 py-1 text-xs font-sans border bg-white hover:bg-gray-100"
        >
          Image
        </button>
        <span className="border-l border-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="px-2 py-1 text-xs font-sans border bg-white hover:bg-gray-100 disabled:opacity-50"
        >
          Undo
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="px-2 py-1 text-xs font-sans border bg-white hover:bg-gray-100 disabled:opacity-50"
        >
          Redo
        </button>
      </div>

      {/* Editor Content */}
      <div className="bg-white">
        <EditorContent editor={editor} />
        {!content && placeholder && (
          <div className="absolute top-0 left-0 p-3 text-gray-400 pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
}
