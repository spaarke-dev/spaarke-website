"""Put a Spaarke screenshot on the monitor in Stocksy clip 5864216.

Deferred to the next website version (see notes/review-notes.md, "Next
version: hero video with the Spaarke screen"). Needs opencv-python-headless,
numpy and imageio-ffmpeg (pip install --user). Run with -P so no stray file in
the working folder shadows the standard library:

python -P screen-composite.py <clip.mp4> <screenshot.png> <out.mp4> [frames_dir]

Never commit the clip or the output: the repository is public.

Geometry was measured on frame 0 of the 1280x720 comp: the monitor face is
nearly square to the camera, with horizontal lines converging slowly to the
right (horizon near y 204, about 8.1e-5 per px). The display's right edge is
about 55 px inside the glass edge at x 934; its bottom about 50 px above the
chin. Camera drift is tracked with ECC (affine) on the screen area.
"""
import subprocess, sys, os
import cv2
import numpy as np

FFMPEG = r"C:/Users/RalphSchroeder/AppData/Roaming/Python/Python313/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v9.0.2.exe"
src, shot_path, out_path = sys.argv[1:4]
frames_dir = sys.argv[4] if len(sys.argv) > 4 else None

cap = cv2.VideoCapture(src)
fps = cap.get(cv2.CAP_PROP_FPS) or 25
frames = []
while True:
    ok, f = cap.read()
    if not ok:
        break
    frames.append(f)
H, W = frames[0].shape[:2]
sx, sy = W / 1280, H / 720  # geometry below is in 1280x720 units

# --- display quad in frame 0 -------------------------------------------------
HOR, K = 204.0, 8.1e-5
def y_at(x, y0):  # a horizontal screen line through (0, y0)
    return HOR + (y0 - HOR) * (1 - x * K)
XL, XR = -12.0, 879.0
YB0 = 636.0                      # display bottom at x = 0
YT0 = -26.0                      # top edge stays above the frame, even at the right (about -10)
quad = np.float32([
    [XL, y_at(XL, YT0)], [XR, y_at(XR, YT0)],
    [XR, y_at(XR, YB0)], [XL, y_at(XL, YB0)],
]) * np.float32([sx, sy])

# --- screenshot: pad top and left so the logo clears the frame edge ---------
shot = cv2.imread(shot_path, cv2.IMREAD_COLOR)
top_c = [int(c) for c in shot[4, 700]]
left_c = [int(c) for c in shot[600, 4]]
shot = cv2.copyMakeBorder(shot, 0, 0, 70, 0, cv2.BORDER_CONSTANT, value=left_c)
shot = cv2.copyMakeBorder(shot, 155, 0, 0, 0, cv2.BORDER_CONSTANT, value=top_c)
# crop width to the display's aspect at its left edge
disp_w = np.linalg.norm(quad[1] - quad[0])
disp_h = np.linalg.norm(quad[3] - quad[0])
cw = int(round(shot.shape[0] * disp_w / disp_h))
shot = shot[:, :min(cw, shot.shape[1])]
# pre-shrink close to the final size so the warp stays near 1:1
tw = int(disp_w)
th = int(round(shot.shape[0] * tw / shot.shape[1]))
shot = cv2.resize(shot, (tw, th), interpolation=cv2.INTER_AREA)
sh, sw = shot.shape[:2]
H0 = cv2.getPerspectiveTransform(
    np.float32([[0, 0], [sw, 0], [sw, sh], [0, sh]]), quad)
ones = np.full((sh, sw), 255, np.uint8)

# --- tracking ----------------------------------------------------------------
DS = 0.5
def prep(f):
    g = cv2.cvtColor(f, cv2.COLOR_BGR2GRAY)
    g = cv2.resize(g, None, fx=DS, fy=DS, interpolation=cv2.INTER_AREA)
    return g.astype(np.float32)
tmpl = prep(frames[0])
tmask = np.zeros(tmpl.shape, np.uint8)
tmask[0:int(600 * sy * DS), 0:int(770 * sx * DS)] = 255
warp = np.eye(2, 3, dtype=np.float32)
crit = (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 100, 1e-5)
warps = []
for f in frames:
    try:
        _, warp = cv2.findTransformECC(tmpl, prep(f), warp, cv2.MOTION_AFFINE, crit, tmask, 5)
    except cv2.error:
        pass
    w = warp.copy()
    w[:, 2] /= DS
    warps.append(np.vstack([w, [0, 0, 1]]))
print("drift first->last:", warps[-1][:, 2].round(1), "scale", warps[-1][0, 0].round(4))

# --- per frame ---------------------------------------------------------------
os.makedirs(os.path.dirname(os.path.abspath(out_path)), exist_ok=True)
enc = subprocess.Popen([
    FFMPEG, "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "bgr24",
    "-s", f"{W}x{H}", "-r", str(fps), "-i", "-",
    "-c:v", "libx264", "-crf", "18", "-preset", "slow", "-pix_fmt", "yuv420p",
    "-movflags", "+faststart", out_path], stdin=subprocess.PIPE)

# the credit is static; the old screen behind it moves, so a temporal min isolates it
strip = (slice(int(460 * sy), H), slice(0, int(26 * sx)))
tmin = np.min(np.stack([cv2.cvtColor(f, cv2.COLOR_BGR2GRAY)[strip] for f in frames]), axis=0).astype(np.float32)
credit = np.clip((tmin - cv2.GaussianBlur(tmin, (0, 0), 6) - 6) / 15, 0, 1)
k_open = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (13, 13))
k_dil = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))
warm = np.float32([0.85, 1.0, 1.12])
for i, f in enumerate(frames):
    M = warps[i] @ H0
    scr = cv2.warpPerspective(shot, M, (W, H), flags=cv2.INTER_LINEAR)
    a = cv2.warpPerspective(ones, M, (W, H), flags=cv2.INTER_LINEAR).astype(np.float32) / 255
    scr = cv2.GaussianBlur(scr, (0, 0), 0.6).astype(np.float32)

    g = cv2.cvtColor(f, cv2.COLOR_BGR2GRAY)
    # glass reflection: broad shapes of the original (min filter drops UI text)
    # per-pixel min of B, G, R drops the colored UI (red and green bars)
    refl = cv2.erode(f.min(axis=2), np.ones((7, 7), np.uint8))
    refl = cv2.GaussianBlur(refl, (0, 0), 4).astype(np.float32)
    scr = scr + 0.17 * refl[..., None] * warm

    # person matte: large bright region connected to the right or bottom edge
    gb = cv2.GaussianBlur(g, (0, 0), 1.5)
    bright = cv2.morphologyEx((gb > 75).astype(np.uint8), cv2.MORPH_OPEN, k_open)
    n, lab, stats, _ = cv2.connectedComponentsWithStats(bright, 8)
    person = np.zeros_like(bright)
    for j in range(1, n):
        x, y, w_, h_, area = stats[j]
        if area > 5000 and (x + w_ >= W - 2):
            person[lab == j] = 1
    person = cv2.dilate(person, k_dil).astype(np.float32)
    pa = np.clip((gb.astype(np.float32) - 45) / 65, 0, 1) * person
    pa = cv2.GaussianBlur(pa, (0, 0), 1.0)

    of = f.astype(np.float32)
    comp = of * (1 - a[..., None]) + scr * a[..., None]
    comp = comp * (1 - pa[..., None]) + of * pa[..., None]

    # keep the Stocksy credit on the left edge legible (comp only)
    strip = (slice(int(460 * sy), H), slice(0, int(26 * sx)))
    txt = credit
    comp[strip] = comp[strip] * (1 - txt[..., None]) + of[strip] * txt[..., None]

    out = np.clip(comp, 0, 255).astype(np.uint8)
    enc.stdin.write(out.tobytes())
    if frames_dir and i in (0, len(frames) // 2, len(frames) - 1):
        cv2.imwrite(os.path.join(frames_dir, f"comp_{i:03d}.png"), out)
        cv2.imwrite(os.path.join(frames_dir, f"matte_{i:03d}.png"), (pa * 255).astype(np.uint8))
enc.stdin.close()
enc.wait()
print("frames", len(frames), "->", out_path)
