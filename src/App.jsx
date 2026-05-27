import React, { useEffect, useMemo, useRef, useState } from "react";
import { Camera, Package, Ruler, RotateCcw, Save, Trash2 } from "lucide-react";

const inputStyle = {
  width: "100%",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  padding: "10px",
  fontSize: "14px",
  boxSizing: "border-box",
};

const STOCK_BOXES = [
  { name: "6 x 4 x 4", l: 6, w: 4, h: 4 },
  { name: "8 x 6 x 4", l: 8, w: 6, h: 4 },
  { name: "10 x 8 x 6", l: 10, w: 8, h: 6 },
  { name: "12 x 9 x 6", l: 12, w: 9, h: 6 },
  { name: "14 x 10 x 8", l: 14, w: 10, h: 8 },
  { name: "16 x 12 x 10", l: 16, w: 12, h: 10 },
  { name: "18 x 14 x 12", l: 18, w: 14, h: 12 },
  { name: "20 x 16 x 14", l: 20, w: 16, h: 14 },
  { name: "24 x 18 x 18", l: 24, w: 18, h: 18 },
];

function fitBox(items, padding) {
  if (!items.length) return null;
  const totalL = Math.max(...items.map((i) => i.length || 0)) + padding * 2;
  const totalW = Math.max(...items.map((i) => i.width || 0)) + padding * 2;
  const totalH = items.reduce((sum, i) => sum + (i.height || 0), 0) + padding * 2;
  const dims = [totalL, totalW, totalH].sort((a, b) => b - a);

  return (
    STOCK_BOXES
      .map((b) => ({ ...b, volume: b.l * b.w * b.h }))
      .filter((b) => {
        const boxDims = [b.l, b.w, b.h].sort((a, b) => b - a);
        return dims.every((d, idx) => d <= boxDims[idx]);
      })
      .sort((a, b) => a.volume - b.volume)[0] || null
  );
}

/*
PRINTABLE CAMERA MEASUREMENT TEMPLATE

Print at 100% scale with NO page scaling.

Recommended:
- Letter size paper (8.5 x 11)
- Matte white cardstock if possible
- Place all items fully inside the outer border
- Keep phone camera parallel to the page

The app should detect:
- Outer calibration border
- 1 inch grid spacing
- Corner fiducial markers

SAVE AS: printable_measurement_template.svg

<svg width="8.5in" height="11in" viewBox="0 0 850 1100" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="10" width="830" height="1080" fill="white" stroke="black" stroke-width="6"/>

  <!-- 1 inch grid -->
  <g stroke="#cccccc" stroke-width="1">
    <line x1="100" y1="0" x2="100" y2="1100"/>
    <line x1="200" y1="0" x2="200" y2="1100"/>
    <line x1="300" y1="0" x2="300" y2="1100"/>
    <line x1="400" y1="0" x2="400" y2="1100"/>
    <line x1="500" y1="0" x2="500" y2="1100"/>
    <line x1="600" y1="0" x2="600" y2="1100"/>
    <line x1="700" y1="0" x2="700" y2="1100"/>
    <line x1="800" y1="0" x2="800" y2="1100"/>

    <line x1="0" y1="100" x2="850" y2="100"/>
    <line x1="0" y1="200" x2="850" y2="200"/>
    <line x1="0" y1="300" x2="850" y2="300"/>
    <line x1="0" y1="400" x2="850" y2="400"/>
    <line x1="0" y1="500" x2="850" y2="500"/>
    <line x1="0" y1="600" x2="850" y2="600"/>
    <line x1="0" y1="700" x2="850" y2="700"/>
    <line x1="0" y1="800" x2="850" y2="800"/>
    <line x1="0" y1="900" x2="850" y2="900"/>
    <line x1="0" y1="1000" x2="850" y2="1000"/>
  </g>

  <!-- Fiducial corner markers -->
  <g fill="black">
    <rect x="25" y="25" width="60" height="60"/>
    <rect x="765" y="25" width="60" height="60"/>
    <rect x="25" y="1015" width="60" height="60"/>
    <rect x="765" y="1015" width="60" height="60"/>
  </g>

  <!-- Center placement area -->
  <rect x="125" y="175" width="600" height="700" rx="20" fill="none" stroke="#000000" stroke-width="4" stroke-dasharray="18 10"/>

  <text x="425" y="120" text-anchor="middle" font-size="28" font-family="Arial" font-weight="bold">
    ITEM PLACEMENT AREA
  </text>

  <text x="425" y="910" text-anchor="middle" font-size="18" font-family="Arial">
    Place all items flat inside the dashed box
  </text>

  <text x="425" y="950" text-anchor="middle" font-size="18" font-family="Arial">
    Print at 100% scale - Do NOT fit to page
  </text>

  <!-- Measurement labels -->
  <g font-family="Arial" font-size="12" fill="#555555">
    <text x="95" y="95">1in</text>
    <text x="195" y="95">2in</text>
    <text x="295" y="95">3in</text>
    <text x="395" y="95">4in</text>
    <text x="495" y="95">5in</text>
    <text x="595" y="95">6in</text>
    <text x="695" y="95">7in</text>
  </g>
</svg>
*/

function Button({ children, onClick, disabled = false, variant = "solid", style = {} }) {
  const baseStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    padding: "10px 14px",
    borderRadius: "12px",
    border: variant === "outline" ? "1px solid #cbd5e1" : "1px solid #2563eb",
    background: variant === "outline" ? "#ffffff" : "#2563eb",
    color: variant === "outline" ? "#0f172a" : "#ffffff",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.55 : 1,
    fontWeight: 600,
    ...style,
  };

  return (
    <button type="button" onClick={onClick} disabled={disabled} style={baseStyle}>
      {children}
    </button>
  );
}

function Card({ children, style = {} }) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "20px",
        boxShadow: "0 1px 4px rgba(15, 23, 42, 0.12)",
        border: "1px solid #e2e8f0",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function CardContent({ children, style = {} }) {
  return <div style={{ padding: "16px", ...style }}>{children}</div>;
}

export default function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [referenceInches, setReferenceInches] = useState(8.5);
  const [referencePixels, setReferencePixels] = useState(850);
  const [padding, setPadding] = useState(1);
  const [items, setItems] = useState([]);
  const [draft, setDraft] = useState({ name: "Item 1", pxLength: 600, pxWidth: 350, height: 3 });
  const [measureMode, setMeasureMode] = useState("template");
  const [tapPoints, setTapPoints] = useState({ template: [], length: [], width: [] });
  const [detectionResult, setDetectionResult] = useState("");
  const [opencvReady, set

  const scale = referencePixels > 0 ? referenceInches / referencePixels : 0;

  function distance(p1, p2) {
    if (!p1 || !p2) return 0;
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }

  function handlePhotoTap(e) {
    if (!photo) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const point = { x, y };

    setTapPoints((prev) => {
      const current = prev[measureMode] || [];
      const updatedModePoints = current.length >= 2 ? [point] : [...current, point];
      const next = { ...prev, [measureMode]: updatedModePoints };

      if (updatedModePoints.length === 2) {
        const px = distance(updatedModePoints[0], updatedModePoints[1]);
        if (measureMode === "template") {
          setReferencePixels(+px.toFixed(0));
          setMeasureMode("length");
        }
        if (measureMode === "length") {
          setDraft((d) => ({ ...d, pxLength: +px.toFixed(0) }));
          setMeasureMode("width");
        }
        if (measureMode === "width") {
          setDraft((d) => ({ ...d, pxWidth: +px.toFixed(0) }));
        }
      }

      return next;
    });
  }

  function clearTapMeasurements() {
    setTapPoints({ template: [], length: [], width: [] });
    setMeasureMode("template");
  }

  function getModeLabel() {
    if (measureMode === "template") return "Tap the LEFT and RIGHT edges of the 8.5 inch template width";
    if (measureMode === "length") return "Tap both ends of the item LENGTH";
    return "Tap both sides of the item WIDTH";
  }

  function getOpenCv() {
    return window.cv && window.cv.Mat ? window.cv : null;
  }

  function loadOpenCv() {
    if (getOpenCv()) {
      setOpencvReady(true);
      setDetectionResult("OpenCV is ready.");
      return;
    }

    if (document.getElementById("opencv-js")) {
      setDetectionResult("OpenCV is loading. Try Auto Detect again in a few seconds.");
      return;
    }

    const script = document.createElement("script");
    script.id = "opencv-js";
    script.async = true;
    script.src = "https://docs.opencv.org/4.x/opencv.js";
    script.onload = () => {
      const waitForCv = setInterval(() => {
        if (getOpenCv()) {
          clearInterval(waitForCv);
          setOpencvReady(true);
          setDetectionResult("OpenCV is ready. Capture a photo and tap Auto Detect Item.");
        }
      }, 250);
    };
    script.onerror = () => setDetectionResult("OpenCV failed to load. Check internet connection or use tap-to-measure backup.");
    document.body.appendChild(script);
    setDetectionResult("Loading OpenCV. This can take a few seconds on first load.");
  }

  function orderCorners(points) {
    const sorted = [...points].sort((a, b) => a.x + a.y - (b.x + b.y));
    const tl = sorted[0];
    const br = sorted[sorted.length - 1];
    const middle = sorted.slice(1, -1).sort((a, b) => a.x - a.y - (b.x - b.y));
    const bl = middle[0];
    const tr = middle[middle.length - 1];
    return [tl, tr, br, bl];
  }

  function autoDetectItem() {
    if (!photo) return;

    const cv = getOpenCv();
    if (!cv) {
      loadOpenCv();
      return;
    }

    const img = new Image();
    img.onload = () => {
      const srcCanvas = document.createElement("canvas");
      srcCanvas.width = img.naturalWidth;
      srcCanvas.height = img.naturalHeight;
      const srcCtx = srcCanvas.getContext("2d", { willReadFrequently: true });
      srcCtx.drawImage(img, 0, 0);

      let src;
      let gray;
      let blur;
      let edges;
      let contours;
      let hierarchy;
      let warped;
      let warpedGray;
      let thresh;
      let itemContours;
      let itemHierarchy;
      let M;
      let dsize;
      let srcTri;
      let dstTri;

      try {
        src = cv.imread(srcCanvas);
        gray = new cv.Mat();
        blur = new cv.Mat();
        edges = new cv.Mat();
        contours = new cv.MatVector();
        hierarchy = new cv.Mat();

        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
        cv.GaussianBlur(gray, blur, new cv.Size(5, 5), 0);
        cv.Canny(blur, edges, 50, 150);
        cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

        let bestQuad = null;
        let bestArea = 0;

        for (let i = 0; i < contours.size(); i++) {
          const cnt = contours.get(i);
          const peri = cv.arcLength(cnt, true);
          const approx = new cv.Mat();
          cv.approxPolyDP(cnt, approx, 0.02 * peri, true);
          const area = Math.abs(cv.contourArea(approx));

          if (approx.rows === 4 && area > bestArea) {
            const rect = cv.boundingRect(approx);
            const aspect = rect.width / rect.height;
            if (aspect > 0.55 && aspect < 0.95 && area > src.cols * src.rows * 0.1) {
              bestArea = area;
              bestQuad = [];
              for (let j = 0; j < 4; j++) {
                bestQuad.push({ x: approx.intPtr(j, 0)[0], y: approx.intPtr(j, 0)[1] });
              }
            }
          }
          approx.delete();
          cnt.delete();
        }

        if (!bestQuad) {
          setDetectionResult("OpenCV could not find the full template border. Keep all 4 page corners visible, improve lighting, and avoid shadows.");
          return;
        }

        const [tl, tr, br, bl] = orderCorners(bestQuad);
        const outputW = 850;
        const outputH = 1100;
        dsize = new cv.Size(outputW, outputH);
        srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [tl.x, tl.y, tr.x, tr.y, br.x, br.y, bl.x, bl.y]);
        dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, outputW, 0, outputW, outputH, 0, outputH]);
        M = cv.getPerspectiveTransform(srcTri, dstTri);
        warped = new cv.Mat();
        cv.warpPerspective(src, warped, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());

        warpedGray = new cv.Mat();
        thresh = new cv.Mat();
        itemContours = new cv.MatVector();
        itemHierarchy = new cv.Mat();

        cv.cvtColor(warped, warpedGray, cv.COLOR_RGBA2GRAY);

        // Crop INSIDE the dashed placement area, not on the dashed border itself.
        // The previous version included the dashed rectangle/background and could measure that instead of the item.
        const roiMargin = 45;
        const roiX = 125 + roiMargin;
        const roiY = 175 + roiMargin;
        const roiW = 600 - roiMargin * 2;
        const roiH = 700 - roiMargin * 2;
        const roi = warpedGray.roi(new cv.Rect(roiX, roiY, roiW, roiH));

        // Threshold darker objects against white template paper.
        cv.threshold(roi, thresh, 0, 255, cv.THRESH_BINARY_INV + cv.THRESH_OTSU);

        const kernel = cv.Mat.ones(5, 5, cv.CV_8U);
        cv.morphologyEx(thresh, thresh, cv.MORPH_OPEN, kernel);
        cv.morphologyEx(thresh, thresh, cv.MORPH_CLOSE, kernel);
        kernel.delete();

        cv.findContours(thresh, itemContours, itemHierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

        let bestItemRect = null;
        let bestItemArea = 0;

        for (let i = 0; i < itemContours.size(); i++) {
          const cnt = itemContours.get(i);
          const area = Math.abs(cv.contourArea(cnt));
          const rect = cv.boundingRect(cnt);

          // Ignore dashed guide lines, grid noise, shadows, and anything touching the crop edge.
          const touchesEdge = rect.x <= 4 || rect.y <= 4 || rect.x + rect.width >= roiW - 4 || rect.y + rect.height >= roiH - 4;
          const rectArea = rect.width * rect.height;
          const fillRatio = rectArea > 0 ? area / rectArea : 0;
          const aspectRatio = Math.max(rect.width, rect.height) / Math.max(1, Math.min(rect.width, rect.height));
          const tooThinLikeLine = aspectRatio > 10 || fillRatio < 0.08;
          const tooLargeLikeBackground = rectArea > roiW * roiH * 0.82;

          if (
            !touchesEdge &&
            !tooThinLikeLine &&
            !tooLargeLikeBackground &&
            area > bestItemArea &&
            area > 1200 &&
            rect.width > 25 &&
            rect.height > 25
          ) {
            bestItemArea = area;
            bestItemRect = rect;
          }
          cnt.delete();
        }

        roi.delete();

        if (!bestItemRect) {
          setDetectionResult("Template corrected, but no item contour was found. Move the item toward the center, avoid white/clear items, reduce shadows, and keep it away from the dashed border.");
          return;
        }

        const pixelsPerInch = outputW / 8.5;
        const itemLengthIn = Math.max(bestItemRect.width, bestItemRect.height) / pixelsPerInch;
        const itemWidthIn = Math.min(bestItemRect.width, bestItemRect.height) / pixelsPerInch;

        setReferenceInches(8.5);
        setReferencePixels(outputW);
        setDraft((d) => ({
          ...d,
          pxLength: Math.round(Math.max(bestItemRect.width, bestItemRect.height)),
          pxWidth: Math.round(Math.min(bestItemRect.width, bestItemRect.height)),
        }));

        setDetectionResult(`Detected corrected size: ${itemLengthIn.toFixed(2)} in x ${itemWidthIn.toFixed(2)} in. Enter height, then Add Item.`);
      } catch (err) {
        console.error(err);
        setDetectionResult("Auto detect failed. Use tap-to-measure backup or retake the photo with better lighting.");
      } finally {
        [src, gray, blur, edges, contours, hierarchy, warped, warpedGray, thresh, itemContours, itemHierarchy, M, srcTri, dstTri].forEach((m) => {
          if (m && typeof m.delete === "function") m.delete();
        });
      }
    };

    img.src = photo;
  }

  const measuredDraft = useMemo(() => ({
    name: draft.name,
    length: +(draft.pxLength * scale).toFixed(2),
    width: +(draft.pxWidth * scale).toFixed(2),
    height: +Number(draft.height || 0).toFixed(2),
  }), [draft, scale]);

  const recommendedBox = useMemo(() => fitBox(items, Number(padding || 0)), [items, padding]);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch (err) {
      alert("Camera access failed. Open this app over HTTPS and allow camera permissions.");
    }
  }

  function stopCamera() {
    const stream = videoRef.current?.srcObject;
    stream?.getTracks?.().forEach((track) => track.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraActive(false);
  }

  function capturePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    setPhoto(canvas.toDataURL("image/jpeg", 0.9));
  }

  function addItem() {
    setItems((prev) => [...prev, { ...measuredDraft, id: crypto.randomUUID() }]);
    setDraft((d) => ({ ...d, name: `Item ${items.length + 2}` }));
  }

  function resetAll() {
    setPhoto(null);
    setItems([]);
    setDraft({ name: "Item 1", pxLength: 600, pxWidth: 350, height: 3 });
    clearTapMeasurements();
  }

  useEffect(() => () => stopCamera(), []);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", color: "#0f172a", padding: "16px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: "1152px", margin: "0 auto", display: "grid", gap: "16px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", justifyContent: "space-between", background: "#ffffff", padding: "20px", borderRadius: "20px", boxShadow: "0 1px 4px rgba(15,23,42,0.12)" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: 800, margin: "0 0 6px" }}>Camera Box Size Calculator</h1>
            <p style={{ fontSize: "14px", color: "#475569", margin: 0 }}>Take a phone camera photo, scale it with a printable template, then calculate the box needed.</p>
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <Button onClick={startCamera}><Camera size={16} />Start Camera</Button>
            <Button variant="outline" onClick={capturePhoto} disabled={!cameraActive}>Capture</Button>
            <Button variant="outline" onClick={resetAll}><RotateCcw size={16} />Reset</Button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
          <Card>
            <CardContent style={{ display: "grid", gap: "12px" }}>
              <h2 style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "20px", margin: 0 }}><Camera size={20} />Photo</h2>
              <div style={{ aspectRatio: "16 / 9", overflow: "hidden", borderRadius: "20px", background: "#000000", position: "relative" }} onClick={handlePhotoTap}>
                {photo ? (
                  <>
                    <img src={photo} alt="Captured items" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
                    {Object.entries(tapPoints).flatMap(([mode, points]) =>
                      points.map((p, idx) => (
                        <div
                          key={`${mode}-${idx}`}
                          style={{
                            position: "absolute",
                            left: p.x - 7,
                            top: p.y - 7,
                            width: 14,
                            height: 14,
                            borderRadius: "50%",
                            background: mode === "template" ? "#22c55e" : mode === "length" ? "#2563eb" : "#f97316",
                            border: "2px solid white",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
                          }}
                        />
                      ))
                    )}
                  </>
                ) : (
                  <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                )}
              </div>
              {photo && (
                <div style={{ display: "grid", gap: "8px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "14px", padding: "12px" }}>
                  <b>Tap-to-measure</b>
                  <span style={{ fontSize: "14px" }}>{getModeLabel()}</span>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <Button variant={measureMode === "template" ? "solid" : "outline"} onClick={() => setMeasureMode("template")}>Template</Button>
                    <Button variant={measureMode === "length" ? "solid" : "outline"} onClick={() => setMeasureMode("length")}>Length</Button>
                    <Button variant={measureMode === "width" ? "solid" : "outline"} onClick={() => setMeasureMode("width")}>Width</Button>
                    <Button variant="outline" onClick={clearTapMeasurements}>Clear Taps</Button>
                    <Button onClick={autoDetectItem}>Auto Detect Item</Button>
                  </div>
                  <span style={{ fontSize: "12px", color: "#475569" }}>Tip: use Auto Detect first. If it misses, use tap-to-measure as a backup.</span>
                  {detectionResult && <span style={{ fontSize: "13px", color: "#0f172a", fontWeight: 600 }}>{detectionResult}</span>}
                </div>
              )}
              <canvas ref={canvasRef} style={{ display: "none" }} />
              <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>Best results: print the template at 100%, place items flat inside the dashed box, and keep the phone camera parallel to the page.</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent style={{ display: "grid", gap: "16px" }}>
              <h2 style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "20px", margin: 0 }}><Ruler size={20} />Calibration & Measurement</h2>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
                <label style={{ display: "grid", gap: "6px", fontSize: "14px" }}>Reference actual length, inches
                  <input style={inputStyle} type="number" step="0.01" value={referenceInches} onChange={(e) => setReferenceInches(+e.target.value)} />
                </label>
                <label style={{ display: "grid", gap: "6px", fontSize: "14px" }}>Reference length in photo, pixels
                  <input style={inputStyle} type="number" value={referencePixels} onChange={(e) => setReferencePixels(+e.target.value)} />
                </label>
              </div>

              <div style={{ borderRadius: "12px", background: "#f1f5f9", padding: "12px", fontSize: "14px" }}>Current scale: <b>{scale.toFixed(5)}</b> inches per pixel</div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px" }}>
                <label style={{ display: "grid", gap: "6px", fontSize: "14px" }}>Item name
                  <input style={inputStyle} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
                </label>
                <label style={{ display: "grid", gap: "6px", fontSize: "14px" }}>Length px
                  <input style={inputStyle} type="number" value={draft.pxLength} onChange={(e) => setDraft({ ...draft, pxLength: +e.target.value })} />
                </label>
                <label style={{ display: "grid", gap: "6px", fontSize: "14px" }}>Width px
                  <input style={inputStyle} type="number" value={draft.pxWidth} onChange={(e) => setDraft({ ...draft, pxWidth: +e.target.value })} />
                </label>
                <label style={{ display: "grid", gap: "6px", fontSize: "14px" }}>Height inches
                  <input style={inputStyle} type="number" step="0.01" value={draft.height} onChange={(e) => setDraft({ ...draft, height: +e.target.value })} />
                </label>
                <label style={{ display: "grid", gap: "6px", fontSize: "14px" }}>Packing padding inches
                  <input style={inputStyle} type="number" step="0.25" value={padding} onChange={(e) => setPadding(+e.target.value)} />
                </label>
              </div>

              <div style={{ borderRadius: "12px", border: "1px solid #e2e8f0", padding: "12px", fontSize: "14px" }}>
                Draft item size: <b>{measuredDraft.length}" L x {measuredDraft.width}" W x {measuredDraft.height}" H</b>
              </div>

              <Button onClick={addItem} style={{ width: "fit-content" }}><Save size={16} />Add Item</Button>
            </CardContent>
          </Card>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
          <Card>
            <CardContent>
              <h2 style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "20px", marginTop: 0 }}><Package size={20} />Items in Photo</h2>
              {items.length === 0 ? (
                <p style={{ fontSize: "14px", color: "#64748b" }}>No items added yet.</p>
              ) : (
                <div style={{ display: "grid", gap: "8px" }}>
                  {items.map((item) => (
                    <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "#ffffff", padding: "12px", fontSize: "14px" }}>
                      <span><b>{item.name}</b> — {item.length}" x {item.width}" x {item.height}"</span>
                      <button type="button" style={{ border: 0, background: "transparent", cursor: "pointer", padding: "8px" }} onClick={() => setItems(items.filter((i) => i.id !== item.id))}><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent style={{ display: "grid", gap: "12px" }}>
              <h2 style={{ fontSize: "20px", margin: 0 }}>Recommended Box</h2>
              {recommendedBox ? (
                <div style={{ borderRadius: "20px", background: "#dcfce7", padding: "20px" }}>
                  <p style={{ fontSize: "32px", fontWeight: 800, margin: "0 0 6px" }}>{recommendedBox.name}</p>
                  <p style={{ fontSize: "14px", color: "#475569", margin: 0 }}>Smallest stock box that fits the calculated item envelope plus padding.</p>
                </div>
              ) : (
                <div style={{ borderRadius: "20px", background: "#fef3c7", padding: "20px" }}>
                  <p style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 6px" }}>No stock box selected yet</p>
                  <p style={{ fontSize: "14px", color: "#475569", margin: 0 }}>Add items, or add larger stock box sizes.</p>
                </div>
              )}
              <div style={{ fontSize: "12px", color: "#64748b" }}>MVP assumption: items are stacked vertically. A production version should use a 3D packing optimizer to test rotations and multiple arrangements.</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
