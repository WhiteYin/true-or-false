"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";
import { Icon } from "./icons";

export function ReadyDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  function keepFocusInDialog(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;
    const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not(:disabled)");
    const first = buttons[0];
    const last = buttons[buttons.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  return (
    <dialog ref={dialogRef} className="ready-dialog" aria-labelledby="ready-title" aria-describedby="ready-description" onClose={onClose} onCancel={onClose} onKeyDown={keepFocusInDialog}>
      <button type="button" className="icon-button dialog-close" aria-label="关闭提示" onClick={onClose}><Icon name="close" /></button>
      <h2 id="ready-title">内容已准备好</h2>
      <p id="ready-description">核查服务尚未接通，目前无法生成真假判断。你可以继续修改文字或截图。</p>
      <button type="button" className="primary-button dialog-action" onClick={onClose} autoFocus>继续编辑</button>
    </dialog>
  );
}
