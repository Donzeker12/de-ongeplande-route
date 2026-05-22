import ReactCrop, { centerCrop, makeAspectCrop, type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useCallback, useEffect, useRef, useState } from 'react';

interface Props {
    /** New file selected from device */
    file?: File;
    /** Existing image URL (e.g. already in editor) */
    src?: string;
    onSave: (file: File) => void;
    onCancel: () => void;
}

const ASPECTS: [string, number | undefined][] = [
    ['Vrij', undefined],
    ['1:1', 1],
    ['4:3', 4 / 3],
    ['3:2', 3 / 2],
    ['16:9', 16 / 9],
];

export default function ImageEditorModal({ file, src, onSave, onCancel }: Props) {
    const imgRef = useRef<HTMLImageElement>(null);
    const [imgSrc, setImgSrc] = useState('');
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [aspect, setAspect] = useState<number | undefined>(undefined);
    const [quality, setQuality] = useState(85);
    const [maxWidth, setMaxWidth] = useState(2000);
    const [naturalW, setNaturalW] = useState(0);
    const [saving, setSaving] = useState(false);
    const objectUrlRef = useRef<string | null>(null);

    useEffect(() => {
        let active = true;

        const setUrl = (url: string) => {
            if (!active) return;
            if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
            objectUrlRef.current = url;
            setImgSrc(url);
        };

        if (file) {
            setUrl(URL.createObjectURL(file));
        } else if (src) {
            fetch(src)
                .then((r) => r.blob())
                .then((blob) => setUrl(URL.createObjectURL(blob)))
                .catch(() => {
                    if (active) setImgSrc(src);
                });
        }

        return () => {
            active = false;
            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current);
                objectUrlRef.current = null;
            }
        };
    }, [file, src]);

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
        setNaturalW(w);
        setMaxWidth(Math.min(w, 2000));
        setCrop({ unit: '%', x: 0, y: 0, width: 100, height: 100 });
    };

    const handleAspect = (a: number | undefined) => {
        setAspect(a);
        if (!imgRef.current) return;
        const { naturalWidth: w, naturalHeight: h } = imgRef.current;
        if (a !== undefined) {
            setCrop(centerCrop(makeAspectCrop({ unit: '%', width: 90 }, a, w, h), w, h));
        } else {
            setCrop({ unit: '%', x: 0, y: 0, width: 100, height: 100 });
        }
    };

    const handleSave = useCallback(async () => {
        if (!imgRef.current) return;
        setSaving(true);
        const img = imgRef.current;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            setSaving(false);
            return;
        }

        let cropX = 0;
        let cropY = 0;
        let cropW = img.naturalWidth;
        let cropH = img.naturalHeight;

        if (completedCrop && completedCrop.width > 0 && completedCrop.height > 0) {
            const scaleX = img.naturalWidth / img.width;
            const scaleY = img.naturalHeight / img.height;
            cropX = completedCrop.x * scaleX;
            cropY = completedCrop.y * scaleY;
            cropW = completedCrop.width * scaleX;
            cropH = completedCrop.height * scaleY;
        }

        let outW = Math.round(cropW);
        let outH = Math.round(cropH);
        if (maxWidth > 0 && outW > maxWidth) {
            outH = Math.round(outH * (maxWidth / outW));
            outW = maxWidth;
        }

        canvas.width = outW;
        canvas.height = outH;
        ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, outW, outH);

        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    setSaving(false);
                    return;
                }
                const name = (file?.name ?? 'afbeelding.jpg').replace(/\.[^.]+$/, '') + '.jpg';
                setSaving(false);
                onSave(new File([blob], name, { type: 'image/jpeg' }));
            },
            'image/jpeg',
            quality / 100,
        );
    }, [completedCrop, maxWidth, quality, file, onSave]);

    const estimateW = (() => {
        if (completedCrop && completedCrop.width > 0 && imgRef.current) {
            const scaleX = imgRef.current.naturalWidth / (imgRef.current.width || 1);
            return Math.min(Math.round(completedCrop.width * scaleX), maxWidth);
        }
        return Math.min(naturalW, maxWidth);
    })();

    return (
        <div
            className="fixed inset-0 z-[60] flex flex-col bg-[#0d0f14]"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 shrink-0">
                <h3 className="text-white font-semibold text-sm">Afbeelding bewerken</h3>
                <button
                    type="button"
                    onClick={onCancel}
                    className="text-gray-400 hover:text-white text-2xl leading-none transition"
                >
                    ×
                </button>
            </div>

            {/* Crop area */}
            <div className="flex-1 min-h-0 overflow-auto flex items-center justify-center bg-black/50 p-4">
                {imgSrc && (
                    <ReactCrop
                        crop={crop}
                        onChange={(c) => setCrop(c)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={aspect}
                        ruleOfThirds
                    >
                        <img
                            ref={imgRef}
                            src={imgSrc}
                            onLoad={onImageLoad}
                            style={{ maxWidth: '100%', maxHeight: 'calc(100vh - 280px)', display: 'block' }}
                            alt=""
                        />
                    </ReactCrop>
                )}
            </div>

            {/* Controls */}
            <div className="shrink-0 border-t border-gray-800 bg-[#16181f] p-4 space-y-4">
                {/* Aspect ratio */}
                <div>
                    <p className="text-xs text-gray-500 mb-2">Verhouding</p>
                    <div className="flex gap-2 flex-wrap">
                        {ASPECTS.map(([label, a]) => (
                            <button
                                key={String(label)}
                                type="button"
                                onClick={() => handleAspect(a)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                                    aspect === a
                                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sliders */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-xs text-gray-500">Kwaliteit</span>
                            <span className="text-xs text-amber-400 font-medium">{quality}%</span>
                        </div>
                        <input
                            type="range"
                            min={40}
                            max={100}
                            step={5}
                            value={quality}
                            onChange={(e) => setQuality(Number(e.target.value))}
                            className="w-full accent-emerald-500"
                        />
                    </div>
                    {naturalW > 0 && (
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-xs text-gray-500">Max breedte</span>
                                <span className="text-xs text-amber-400 font-medium">{maxWidth}px</span>
                            </div>
                            <input
                                type="range"
                                min={400}
                                max={naturalW}
                                step={100}
                                value={maxWidth}
                                onChange={(e) => setMaxWidth(Number(e.target.value))}
                                className="w-full accent-emerald-500"
                            />
                        </div>
                    )}
                </div>

                {estimateW > 0 && (
                    <p className="text-xs text-gray-600">→ uitvoer: ~{estimateW}px breed</p>
                )}

                {/* Action buttons */}
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-300 text-sm font-medium hover:bg-gray-700 transition"
                    >
                        Overslaan
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white text-sm font-semibold transition"
                    >
                        {saving ? 'Opslaan...' : '✓ Opslaan'}
                    </button>
                </div>
            </div>
        </div>
    );
}
