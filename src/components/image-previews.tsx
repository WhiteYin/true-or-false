"use client";

import { Icon } from "./icons";

export type LocalImage = { id: string; name: string; url: string };

export function ImagePreviews({ images, onRemove }: { images: LocalImage[]; onRemove: (id: string) => void }) {
  if (!images.length) return null;
  return (
    <ul className="image-previews" aria-label="已添加的截图">
      {images.map((image) => (
        <li className="image-preview" key={image.id}>
          <div className="thumbnail">
            {/* Local object URLs preserve the entire screenshot without uploading it. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.url} alt={`截图预览：${image.name}`} />
            <button type="button" className="icon-button remove-image" aria-label={`移除截图 ${image.name}`} onClick={() => onRemove(image.id)}><Icon name="close" /></button>
          </div>
          <span className="image-name" title={image.name}>{image.name}</span>
        </li>
      ))}
    </ul>
  );
}
