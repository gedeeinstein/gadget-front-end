import React, { useEffect, useRef } from 'react';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const exec = (command: string) => {
    document.execCommand(command, false);
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
      <div className="flex items-center gap-1 p-2 border-b border-slate-200 bg-slate-50">
        <button type="button" onClick={() => exec('bold')} className="p-1.5 hover:bg-slate-200 rounded text-slate-600 hover:text-slate-900" title="Bold">
          <Bold size={18} />
        </button>
        <button type="button" onClick={() => exec('italic')} className="p-1.5 hover:bg-slate-200 rounded text-slate-600 hover:text-slate-900" title="Italic">
          <Italic size={18} />
        </button>
        <div className="w-px h-6 bg-slate-300 mx-1"></div>
        <button type="button" onClick={() => exec('insertUnorderedList')} className="p-1.5 hover:bg-slate-200 rounded text-slate-600 hover:text-slate-900" title="Bullet List">
          <List size={18} />
        </button>
        <button type="button" onClick={() => exec('insertOrderedList')} className="p-1.5 hover:bg-slate-200 rounded text-slate-600 hover:text-slate-900" title="Numbered List">
          <ListOrdered size={18} />
        </button>
      </div>
      <div
        ref={contentRef}
        contentEditable
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        onBlur={(e) => onChange(e.currentTarget.innerHTML)}
        className="p-4 min-h-[200px] outline-none text-slate-700 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
      />
    </div>
  );
};
