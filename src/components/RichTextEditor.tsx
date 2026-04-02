import React, { useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Heading3, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Link as LinkIcon 
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const ToolbarButton = ({ icon: Icon, command, value = '' }: { icon: any, command: string, value?: string }) => (
    <button
      type="button"
      onClick={() => execCommand(command, value)}
      className="p-2 rounded hover:bg-aquire-grey-light text-aquire-grey-med hover:text-aquire-primary transition-all"
    >
      <Icon size={16} />
    </button>
  );

  return (
    <div className="input-field rounded-2xl overflow-hidden flex flex-col p-0">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-aquire-border bg-aquire-grey-light/50">
        <ToolbarButton icon={Heading1} command="formatBlock" value="H1" />
        <ToolbarButton icon={Heading2} command="formatBlock" value="H2" />
        <ToolbarButton icon={Heading3} command="formatBlock" value="H3" />
        <div className="w-px h-4 bg-aquire-border mx-1" />
        <ToolbarButton icon={Bold} command="bold" />
        <ToolbarButton icon={Italic} command="italic" />
        <ToolbarButton icon={Underline} command="underline" />
        <div className="w-px h-4 bg-aquire-border mx-1" />
        <ToolbarButton icon={List} command="insertUnorderedList" />
        <ToolbarButton icon={ListOrdered} command="insertOrderedList" />
        <div className="w-px h-4 bg-aquire-border mx-1" />
        <ToolbarButton icon={AlignLeft} command="justifyLeft" />
        <ToolbarButton icon={AlignCenter} command="justifyCenter" />
        <ToolbarButton icon={AlignRight} command="justifyRight" />
        <div className="w-px h-4 bg-aquire-border mx-1" />
        <ToolbarButton icon={LinkIcon} command="createLink" value={window.prompt('Enter URL') || ''} />
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="rich-editor custom-scrollbar overflow-y-auto max-h-[300px] p-4 text-aquire-black"
        data-placeholder={placeholder}
      />
    </div>
  );
}
