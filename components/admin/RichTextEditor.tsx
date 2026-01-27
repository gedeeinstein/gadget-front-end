import React, { useEffect, useRef } from 'react';
import { 
  Bold, Italic, Underline, Strikethrough, 
  List, ListOrdered, Link as LinkIcon, 
  AlignLeft, AlignCenter, AlignRight, 
  Undo, Redo, Heading1, Heading2 
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const exec = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (contentRef.current) onChange(contentRef.current.innerHTML);
  };

  useEffect(() => {
    if (contentRef.current && contentRef.current.innerHTML !== value) {
      // Prevent cursor jumping by only updating if content is different and not focused
      if (document.activeElement !== contentRef.current) {
          contentRef.current.innerHTML = value;
      }
    }
  }, [value]);

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white w-full">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 bg-slate-50">
        {/* History */}
        <button type="button" onClick={() => exec('undo')} className="p-1.5 hover:bg-slate-200 rounded text-slate-600" title="Undo">
          <Undo size={16} />
        </button>
        <button type="button" onClick={() => exec('redo')} className="p-1.5 hover:bg-slate-200 rounded text-slate-600" title="Redo">
          <Redo size={16} />
        </button>
        
        <div className="w-px h-6 bg-slate-300 mx-1"></div>
        
        {/* Headings */}
        <button type="button" onClick={() => exec('formatBlock', 'H2')} className="p-1.5 hover:bg-slate-200 rounded text-slate-600" title="Heading Large">
          <Heading1 size={16} />
        </button>
        <button type="button" onClick={() => exec('formatBlock', 'H3')} className="p-1.5 hover:bg-slate-200 rounded text-slate-600" title="Heading Medium">
          <Heading2 size={16} />
        </button>
        
        <div className="w-px h-6 bg-slate-300 mx-1"></div>

        {/* Text Style */}
        <button type="button" onClick={() => exec('bold')} className="p-1.5 hover:bg-slate-200 rounded text-slate-600" title="Bold">
          <Bold size={16} />
        </button>
        <button type="button" onClick={() => exec('italic')} className="p-1.5 hover:bg-slate-200 rounded text-slate-600" title="Italic">
          <Italic size={16} />
        </button>
        <button type="button" onClick={() => exec('underline')} className="p-1.5 hover:bg-slate-200 rounded text-slate-600" title="Underline">
          <Underline size={16} />
        </button>
        <button type="button" onClick={() => exec('strikeThrough')} className="p-1.5 hover:bg-slate-200 rounded text-slate-600" title="Strikethrough">
          <Strikethrough size={16} />
        </button>
        
        <div className="w-px h-6 bg-slate-300 mx-1"></div>
        
        {/* Alignment */}
        <button type="button" onClick={() => exec('justifyLeft')} className="p-1.5 hover:bg-slate-200 rounded text-slate-600" title="Align Left">
          <AlignLeft size={16} />
        </button>
        <button type="button" onClick={() => exec('justifyCenter')} className="p-1.5 hover:bg-slate-200 rounded text-slate-600" title="Align Center">
          <AlignCenter size={16} />
        </button>
        <button type="button" onClick={() => exec('justifyRight')} className="p-1.5 hover:bg-slate-200 rounded text-slate-600" title="Align Right">
          <AlignRight size={16} />
        </button>

        <div className="w-px h-6 bg-slate-300 mx-1"></div>

        {/* Lists & Link */}
        <button type="button" onClick={() => exec('insertUnorderedList')} className="p-1.5 hover:bg-slate-200 rounded text-slate-600" title="Bullet List">
          <List size={16} />
        </button>
        <button type="button" onClick={() => exec('insertOrderedList')} className="p-1.5 hover:bg-slate-200 rounded text-slate-600" title="Numbered List">
          <ListOrdered size={16} />
        </button>
        <button type="button" onClick={() => {
            const url = prompt('Enter URL:');
            if (url) exec('createLink', url);
        }} className="p-1.5 hover:bg-slate-200 rounded text-slate-600" title="Link">
          <LinkIcon size={16} />
        </button>
      </div>
      <div
        ref={contentRef}
        contentEditable
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        onBlur={(e) => onChange(e.currentTarget.innerHTML)}
        className="p-4 min-h-[200px] outline-none text-slate-700 
          [&_ul]:list-disc [&_ul]:pl-5 
          [&_ol]:list-decimal [&_ol]:pl-5 
          [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-2 [&_h2]:mb-1
          [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-2 [&_h3]:mb-1
          [&_a]:text-blue-600 [&_a]:underline [&_a]:cursor-pointer
          [&_blockquote]:border-l-4 [&_blockquote]:border-slate-300 [&_blockquote]:pl-4 [&_blockquote]:italic
        "
      />
    </div>
  );
};
