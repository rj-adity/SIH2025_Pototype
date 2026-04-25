import sys
import os
import cv2
import time
import tensorflow as tf
import numpy as np
import requests

# Allow importing from parent directory
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from event_manager import save_incident


# -----------------------------
# PATH SETUP
# -----------------------------

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# -----------------------------
# LOAD AI MODEL
# -----------------------------

MODEL_PATH = os.path.join(BASE_DIR, "models", "violence_detection_model.h5")

print("Loading model...")
model = tf.keras.models.load_model(MODEL_PATH)
print("Model loaded successfully")


# -----------------------------
# BACKEND URL
# -----------------------------

BACKEND_URL = "http://127.0.0.1:8000"

# -----------------------------
# CAMERA IDS
# -----------------------------

CAMERAS = [
    "main_entrance",
    "parking",
    "corridor",
    "library",
    "food_court",
    "platform"
]

# cooldown per camera
last_saved = {cam: 0 for cam in CAMERAS}

# frame counter per camera
frame_ids = {cam: 0 for cam in CAMERAS}

# create windows
for cam in CAMERAS:
    cv2.namedWindow(cam, cv2.WINDOW_NORMAL)
    cv2.resizeWindow(cam, 640, 480)


# -----------------------------
# MAIN LOOP
# -----------------------------

while True:

    for camera_id in CAMERAS:

        try:
            r = requests.get(f"{BACKEND_URL}/camera_feed/{camera_id}", timeout=1)

            if r.status_code != 200:
                continue

            data = r.json()

            if "frame" not in data:
                continue

            frame_bytes = bytes.fromhex(data["frame"])
            nparr = np.frombuffer(frame_bytes, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            if frame is None:
                continue

        except:
            continue


        # -----------------------------
        # FRAME SKIPPING
        # -----------------------------

        frame_ids[camera_id] += 1

        if frame_ids[camera_id] % 5 != 0:
            continue


        display_frame = frame.copy()


        # -----------------------------
        # MODEL PREPROCESSING
        # -----------------------------

        img = cv2.resize(frame, (224, 224))
        img = img.astype("float32") / 255.0
        img = np.expand_dims(img, axis=0)


        # -----------------------------
        # MODEL PREDICTION
        # -----------------------------

        prob = model.predict(img, verbose=0)[0][0]

        label = "Violence" if prob > 0.6 else "Normal"
        color = (0,0,255) if prob > 0.6 else (0,255,0)

        text = f"{camera_id} | {label}: {prob:.2f}"

        cv2.putText(
            display_frame,
            text,
            (20,40),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            color,
            2
        )


        # -----------------------------
        # VIOLENCE DETECTION
        # -----------------------------

        current_time = time.time()

        if prob > 0.60:

            h,w,_ = display_frame.shape

            x1 = int(w*0.3)
            y1 = int(h*0.2)
            x2 = int(w*0.7)
            y2 = int(h*0.8)

            cv2.rectangle(display_frame,(x1,y1),(x2,y2),(0,0,255),3)

            cv2.putText(
                display_frame,
                f"VIOLENCE {prob:.2f}",
                (x1,y1-10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (0,0,255),
                2
            )

            # cooldown check
            if current_time - last_saved[camera_id] > 5:

                print(f"🚨 Violence detected on {camera_id}")

                try:

                    save_incident(camera_id, float(prob), display_frame)

                    print("☁ Uploaded to Supabase")

                    last_saved[camera_id] = current_time

                except Exception as e:

                    print("❌ Upload failed:", e)


        # -----------------------------
        # SHOW CAMERA WINDOW
        # -----------------------------

        cv2.imshow(camera_id, display_frame)


    # exit key
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break


# -----------------------------
# CLEANUP
# -----------------------------

cv2.destroyAllWindows()