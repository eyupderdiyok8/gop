"use client";

import { useState, useEffect, useMemo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo, 
  Heading1, 
  Heading2, 
  Heading3, 
  ImageIcon, 
  LinkIcon,
  Table as TableIcon,
  PlusSquare,
  MinusSquare,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const extensions = useMemo(() => [
    StarterKit,
    Image.configure({
      HTMLAttributes: {
        class: "rounded-lg max-w-full h-auto my-4",
      },
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: "text-brand-aqua underline cursor-pointer",
      },
    }),
    Table.configure({
      resizable: true,
      HTMLAttributes: {
        class: 'w-full border-collapse border border-slate-300 my-4 table-auto',
      },
    }),
    TableRow.configure({
      HTMLAttributes: {
        class: 'border-b border-slate-200',
      },
    }),
    TableHeader.configure({
      HTMLAttributes: {
        class: 'bg-slate-50 border border-slate-300 p-2 font-bold text-left min-w-[100px]',
      },
    }),
    TableCell.configure({
      HTMLAttributes: {
        class: 'border border-slate-200 p-2 min-w-[100px]',
      },
    }),
  ], []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-slate max-w-none min-h-[300px] h-[500px] max-h-[500px] overflow-y-auto p-4 focus:outline-none text-slate-900 [&_p]:text-slate-700 [&_h1]:text-slate-900 [&_h2]:text-slate-900 [&_h3]:text-slate-900 [&_li]:text-slate-700 [&_strong]:text-slate-900 [&_ul]:text-slate-700 [&_ol]:text-slate-700 [&_td]:text-slate-800 [&_th]:text-slate-900",
      },
    },
  });

  useEffect(() => {
    if (editor && content && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const addImage = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        try {
          const res = await fetch("/api/admin/upload", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          if (data.url) {
            const altText = prompt("Görsel için açıklama (Alt Tag) giriniz:", file.name);
            editor.chain().focus().setImage({ src: data.url, alt: altText || "" }).run();
          }
        } catch (error) {
          console.error("Görsel yükleme hatası:", error);
          alert("Görsel yüklenirken bir hata oluştu.");
        }
      }
    };
    input.click();
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL giriniz:", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 bg-slate-50">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(editor.isActive("bold") ? "bg-brand-aqua/10 text-brand-aqua" : "text-slate-500")}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(editor.isActive("italic") ? "bg-brand-aqua/10 text-brand-aqua" : "text-slate-500")}
        >
          <Italic className="w-4 h-4" />
        </Button>
        <div className="w-px h-4 bg-slate-200 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn(editor.isActive("heading", { level: 1 }) ? "bg-brand-aqua/10 text-brand-aqua" : "text-slate-500")}
        >
          <Heading1 className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(editor.isActive("heading", { level: 2 }) ? "bg-brand-aqua/10 text-brand-aqua" : "text-slate-500")}
        >
          <Heading2 className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={cn(editor.isActive("heading", { level: 3 }) ? "bg-brand-aqua/10 text-brand-aqua" : "text-slate-500")}
        >
          <Heading3 className="w-4 h-4" />
        </Button>
        <div className="w-px h-4 bg-slate-200 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(editor.isActive("bulletList") ? "bg-brand-aqua/10 text-brand-aqua" : "text-slate-500")}
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(editor.isActive("orderedList") ? "bg-brand-aqua/10 text-brand-aqua" : "text-slate-500")}
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(editor.isActive("blockquote") ? "bg-brand-aqua/10 text-brand-aqua" : "text-slate-500")}
        >
          <Quote className="w-4 h-4" />
        </Button>
        <div className="w-px h-4 bg-slate-200 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={addImage}
          className="text-slate-500 hover:text-slate-900"
        >
          <ImageIcon className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={setLink}
          className={cn(editor.isActive("link") ? "bg-brand-aqua/10 text-brand-aqua" : "text-slate-500")}
        >
          <LinkIcon className="w-4 h-4" />
        </Button>
        <div className="w-px h-4 bg-slate-200 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => editor.chain().focus().undo().run()}
          className="text-slate-500 hover:text-slate-900"
        >
          <Undo className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => editor.chain().focus().redo().run()}
          className="text-slate-500 hover:text-slate-900"
        >
          <Redo className="w-4 h-4" />
        </Button>
        <div className="w-px h-4 bg-slate-200 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          title="Tablo Ekle"
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          className={cn(editor.isActive("table") ? "bg-brand-aqua/10 text-brand-aqua" : "text-slate-500")}
        >
          <TableIcon className="w-4 h-4" />
        </Button>
        {editor.isActive("table") && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              title="Satır Ekle (Aşağı)"
              onClick={() => editor.chain().focus().addRowAfter().run()}
              className="text-slate-500 hover:text-slate-900"
            >
              <PlusSquare className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              title="Sütun Ekle (Sağ)"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              className="text-slate-500 hover:text-slate-900"
            >
              <PlusSquare className="w-4 h-4 ml-1" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              title="Satır Sil"
              onClick={() => editor.chain().focus().deleteRow().run()}
              className="text-slate-500 hover:text-red-600"
            >
              <MinusSquare className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              title="Sütun Sil"
              onClick={() => editor.chain().focus().deleteColumn().run()}
              className="text-slate-500 hover:text-red-600"
            >
              <MinusSquare className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              title="Tabloyu Sil"
              onClick={() => editor.chain().focus().deleteTable().run()}
              className="text-slate-500 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
