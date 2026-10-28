"use client";

import { useCallback, useEffect, useRef, useState, type DragEvent, type FormEvent } from "react";
import { ACCEPTED_IMAGE_TYPES, EXAMPLE_QUESTIONS, MAX_IMAGES, MAX_TEXT_LENGTH, imageFileError } from "@/lib/check-input";
import { Brand } from "./brand";
import { Icon } from "./icons";
import { ImagePreviews, type LocalImage } from "./image-previews";
import { ReadyDialog } from "./ready-dialog";

export function CheckHome() {
  const [text, setText] = useState("");
  const [images, setImages] = useState<LocalImage[]>([]);
  const [error, setError] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [dragging, setDragging] = useState(false);
  const [reading, setReading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pickerRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const imageListRef = useRef<LocalImage[]>([]);
  const objectUrls = useRef(new Set<string>());
  const readLock = useRef(false);
  const mounted = useRef(true);
  const dragDepth = useRef(0);

  const resizeTextarea = useCallback(() => {
    const element = textareaRef.current;
    if (!element) return;
    element.style.height = "auto";
    const maxHeight = window.innerWidth < 768 ? 280 : 360;
    element.style.height = `${Math.min(element.scrollHeight, maxHeight)}px`;
    element.style.overflowY = element.scrollHeight > maxHeight ? "auto" : "hidden";
  }, []);

  useEffect(() => { resizeTextarea(); }, [text, resizeTextarea]);
  useEffect(() => {
    window.addEventListener("resize", resizeTextarea);
    return () => window.removeEventListener("resize", resizeTextarea);
  }, [resizeTextarea]);

  useEffect(() => {
    mounted.current = true;
    const urls = objectUrls.current;
    return () => {
      mounted.current = false;
      urls.forEach((url) => URL.revokeObjectURL(url));
      urls.clear();
    };
  }, []);

  async function addImages(files: File[]) {
    if (readLock.current || !files.length) return;
    readLock.current = true;
    setReading(true);
    setError("");
    const errors: string[] = [];
    let addedCount = 0;
    try {
      for (const file of files) {
        if (imageListRef.current.length >= MAX_IMAGES) {
          errors.push("最多添加 3 张截图，请先移除已有截图");
          break;
        }
        const validationError = imageFileError(file);
        if (validationError) { errors.push(validationError); continue; }
        const url = URL.createObjectURL(file);
        objectUrls.current.add(url);
        try {
          const image = new Image();
          image.src = url;
          await image.decode();
          if (!mounted.current) { URL.revokeObjectURL(url); objectUrls.current.delete(url); break; }
          const preview = { id: crypto.randomUUID(), name: file.name, url };
          imageListRef.current = [...imageListRef.current, preview];
          setImages(imageListRef.current);
          addedCount += 1;
        } catch {
          URL.revokeObjectURL(url);
          objectUrls.current.delete(url);
          errors.push("图片无法读取，请选择有效的 JPEG、PNG 或 WebP 图片");
        }
      }
      if (mounted.current) {
        setError([...new Set(errors)].join("；"));
        if (addedCount) setAnnouncement(`已添加 ${addedCount} 张截图，共 ${imageListRef.current.length} 张。截图仅在当前浏览器预览。`);
      }
    } finally {
      readLock.current = false;
      if (mounted.current) setReading(false);
    }
  }

  function removeImage(id: string) {
    const image = imageListRef.current.find((item) => item.id === id);
    if (!image) return;
    imageListRef.current = imageListRef.current.filter((item) => item.id !== id);
    setImages(imageListRef.current);
    URL.revokeObjectURL(image.url);
    objectUrls.current.delete(image.url);
    setError("");
    setAnnouncement(`已移除截图 ${image.name}`);
    document.getElementById("add-screenshot")?.focus();
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (reading) return;
    if (!text.trim() && images.length === 0) {
      setError("请输入待核查内容，或添加截图");
      textareaRef.current?.focus();
      return;
    }
    setError("");
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    requestAnimationFrame(() => submitRef.current?.focus());
  }

  function isFileDrag(event: DragEvent<HTMLElement>) {
    return Array.from(event.dataTransfer.types).includes("Files");
  }

  return (
    <div className="site-shell">
      <a className="skip-link" href="#check-input">跳到输入框</a>
      <main className="home-main">
        <Brand />
        <form className="check-form" onSubmit={onSubmit} noValidate>
          <div
            className={`input-panel${dragging ? " is-dragging" : ""}`}
            onDragEnter={(event) => { if (!isFileDrag(event)) return; event.preventDefault(); dragDepth.current += 1; setDragging(true); }}
            onDragOver={(event) => { if (isFileDrag(event)) { event.preventDefault(); event.dataTransfer.dropEffect = "copy"; } }}
            onDragLeave={(event) => { if (!isFileDrag(event)) return; event.preventDefault(); dragDepth.current = Math.max(0, dragDepth.current - 1); if (!dragDepth.current) setDragging(false); }}
            onDrop={(event) => { if (!isFileDrag(event)) return; event.preventDefault(); dragDepth.current = 0; setDragging(false); void addImages(Array.from(event.dataTransfer.files)); }}
          >
            <label className="sr-only" htmlFor="check-input">待核查内容</label>
            <textarea
              ref={textareaRef}
              id="check-input"
              name="content"
              rows={4}
              maxLength={MAX_TEXT_LENGTH}
              value={text}
              onChange={(event) => { setText(event.target.value); setError(""); }}
              placeholder={"粘贴一条新闻、一段传言或原文链接……\n也可以添加截图，补充你想核实的内容。"}
              aria-describedby={`input-help character-count${error ? " input-error" : ""}`}
              aria-invalid={error.startsWith("请输入") || undefined}
              spellCheck={false}
            />
            <ImagePreviews images={images} onRemove={removeImage} />
            <div className="input-toolbar">
              <button id="add-screenshot" type="button" className="add-image" disabled={reading} onClick={() => pickerRef.current?.click()} aria-describedby="input-help"><Icon name="image" width="18" height="18" />{reading ? "正在读取截图…" : "添加截图"}</button>
              <span id="character-count" className="character-count">{text.length.toLocaleString("en-US")} / 2000</span>
              <input ref={pickerRef} type="file" className="sr-only" tabIndex={-1} aria-label="选择截图文件" accept={ACCEPTED_IMAGE_TYPES.join(",")} multiple onChange={(event) => { const files = Array.from(event.target.files ?? []); event.target.value = ""; void addImages(files); }} />
            </div>
            {dragging && <div className="drop-indicator" aria-hidden="true"><Icon name="image" /><span>松开以添加截图</span></div>}
          </div>
          <p id="input-help" className="input-help">JPEG、PNG、WebP · 最多 3 张，每张 10MB · 仅本地预览</p>
          <div aria-live="polite" aria-atomic="true">{error && <p id="input-error" className="input-error"><Icon name="alert" width="16" height="16" /><span>{error}</span></p>}</div>
          <button ref={submitRef} type="submit" className="primary-button submit-button" disabled={reading}><span>{reading ? "正在读取截图，请稍候" : "辨真假"}</span><Icon className="button-arrow" name="arrow" /></button>
        </form>
        <section className="examples" aria-labelledby="examples-title">
          <h2 id="examples-title">没想好查什么？试试这些示例</h2>
          <div className="example-list">
            {EXAMPLE_QUESTIONS.map((question) => <button type="button" className="example-button" key={question} onClick={() => { setText(question); setError(""); textareaRef.current?.focus(); }}><Icon name="diagonal" width="16" height="16" /><span>{question}</span></button>)}
          </div>
        </section>
        <p className="prototype-note">首页体验版，核查服务尚未接通。</p>
      </main>
      <footer className="site-footer"><p>核查基于可获取的公开资料，结论可能随新证据更新。</p><p className="footer-emphasis">查不到，不等于假。</p></footer>
      <p className="sr-only" role="status" aria-live="polite">{announcement}</p>
      <ReadyDialog open={dialogOpen} onClose={closeDialog} />
    </div>
  );
}
