'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Bold, Italic, Underline, Strikethrough, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Link2, Quote, RemoveFormatting, Heading2, Heading3, Indent, Outdent } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ value, onChange, placeholder, className = '' }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, []); // Only set initial value once to avoid cursor jumping

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const exec = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    handleInput();
    if (editorRef.current) editorRef.current.focus();
  };

  const insertLink = () => {
    const url = prompt('Enter the link URL (must include https:// or http://):');
    if (url) {
      exec('createLink', url);
    }
  };

  const ToolbarButton = ({ icon: Icon, action, title }: { icon: any, action: () => void, title: string }) => (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); action(); }}
      title={title}
      className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  return (
    <div className={`flex flex-col border rounded-md bg-white overflow-hidden transition-colors ${isFocused ? 'border-blue-600 ring-1 ring-blue-600' : 'border-gray-300'} ${className}`}>
      <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50/50">
        <ToolbarButton icon={Bold} action={() => exec('bold')} title="Bold (Ctrl+B)" />
        <ToolbarButton icon={Italic} action={() => exec('italic')} title="Italic (Ctrl+I)" />
        <ToolbarButton icon={Underline} action={() => exec('underline')} title="Underline (Ctrl+U)" />
        <ToolbarButton icon={Strikethrough} action={() => exec('strikeThrough')} title="Strikethrough" />
        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
        <ToolbarButton icon={Heading2} action={() => exec('formatBlock', 'H2')} title="Heading 2" />
        <ToolbarButton icon={Heading3} action={() => exec('formatBlock', 'H3')} title="Heading 3" />
        <ToolbarButton icon={Quote} action={() => exec('formatBlock', 'BLOCKQUOTE')} title="Blockquote" />
        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
        <ToolbarButton icon={List} action={() => exec('insertUnorderedList')} title="Bulleted List" />
        <ToolbarButton icon={ListOrdered} action={() => exec('insertOrderedList')} title="Numbered List" />
        <ToolbarButton icon={Outdent} action={() => exec('outdent')} title="Decrease Indent" />
        <ToolbarButton icon={Indent} action={() => exec('indent')} title="Increase Indent" />
        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
        <ToolbarButton icon={AlignLeft} action={() => exec('justifyLeft')} title="Align Left" />
        <ToolbarButton icon={AlignCenter} action={() => exec('justifyCenter')} title="Align Center" />
        <ToolbarButton icon={AlignRight} action={() => exec('justifyRight')} title="Align Right" />
        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
        <ToolbarButton icon={Link2} action={insertLink} title="Insert Link" />
        <ToolbarButton icon={RemoveFormatting} action={() => exec('removeFormat')} title="Clear Formatting" />
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="p-4 min-h-[200px] outline-none prose prose-sm max-w-none text-sm text-gray-900"
        data-placeholder={placeholder}
      />
      <style dangerouslySetInnerHTML={{
        __html: `
        div[contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          display: block;
        }
      `}} />
    </div>
  );
}