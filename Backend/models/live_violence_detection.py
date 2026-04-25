import sys
import os
import cv2
import time
import tensorflow as tf
import numpy as np
import requests
import base64

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from event_manager import save_incident

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# -----------------------------
# CAMERA LIST
# -----------------------------

CAMERAS = [
    "main_entrance",
    "parking",
    "corridor",
    "library",
    "food_court",
    "platform"
]

BACKEND_URL = "http://127.0.0.1:8000"

FRAME_TIMEOUT = 3

FRAME_W = 640
FRAME_H = 480

# -----------------------------
# LOAD VIOLENCE MODEL
# -----------------------------

MODEL_PATH = os.path.join(BASE_DIR, "models", "violence_detection_model.h5")

print("Loading violence model...")
model = tf.keras.models.load_model(MODEL_PATH)
print("Violence model loaded successfully")


# -----------------------------
# LOAD GENDER MODEL
# -----------------------------

GENDER_PROTO = os.path.join(BASE_DIR, "models", "deploy_gender.prototxt")
GENDER_MODEL = os.path.join(BASE_DIR, "models", "gender_net.caffemodel")

gender_net = cv2.dnn.readNetFromCaffe(GENDER_PROTO, GENDER_MODEL)
gender_list = ["Male", "Female"]

print("Gender model loaded")


# -----------------------------
# LOAD FACE DETECTOR
# -----------------------------

FACE_PROTO = os.path.join(BASE_DIR, "models", "deploy.prototxt")
FACE_MODEL = os.path.join(BASE_DIR, "models", "res10_300x300_ssd_iter_140000.caffemodel")

face_net = cv2.dnn.readNetFromCaffe(FACE_PROTO, FACE_MODEL)

print("Face detector loaded")


# -----------------------------
# PERFORMANCE CONTROL
# -----------------------------

last_prediction = {cam: 0 for cam in CAMERAS}
PREDICTION_INTERVAL = 1  # seconds

last_saved = {cam: 0 for cam in CAMERAS}
detected_gender = {cam: "Unknown" for cam in CAMERAS}

# -----------------------------
# DISCONNECTED FRAME
# -----------------------------

def disconnected_frame(camera_id):

    frame = np.zeros((FRAME_H, FRAME_W, 3), dtype=np.uint8)

    cv2.putText(frame, "Camera Disconnected", (80, FRAME_H//2-20),
                cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0,0,255), 2)

    cv2.putText(frame, camera_id, (180, FRAME_H//2+40),
                cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255,255,255), 2)

    return frame


latest_frames = {cam: disconnected_frame(cam) for cam in CAMERAS}

cv2.namedWindow("AI Surveillance System", cv2.WINDOW_NORMAL)
cv2.resizeWindow("AI Surveillance System", FRAME_W*3, FRAME_H*2)


# -----------------------------
# FACE + GENDER DETECTION
# -----------------------------

def detect_gender(frame):

    (h, w) = frame.shape[:2]

    blob = cv2.dnn.blobFromImage(
        cv2.resize(frame,(300,300)),
        1.0,
        (300,300),
        (104.0,177.0,123.0)
    )

    face_net.setInput(blob)
    detections = face_net.forward()

    for i in range(detections.shape[2]):

        confidence = detections[0,0,i,2]

        if confidence > 0.6:

            box = detections[0,0,i,3:7] * np.array([w,h,w,h])
            (startX,startY,endX,endY) = box.astype("int")

            face = frame[startY:endY, startX:endX]

            if face.size == 0:
                continue

            face_blob = cv2.dnn.blobFromImage(
                face,
                1.0,
                (227,227),
                (78.4263377603,87.7689143744,114.895847746),
                swapRB=False
            )

            gender_net.setInput(face_blob)
            preds = gender_net.forward()

            gender = gender_list[preds[0].argmax()]

            return gender, (startX,startY,endX,endY)

    return "Unknown", None


# -----------------------------
# MAIN LOOP
# -----------------------------

while True:

    current_time = time.time()

    for camera_id in CAMERAS:

        try:

            r = requests.get(f"{BACKEND_URL}/camera_feed/{camera_id}", timeout=3)

            if r.status_code != 200:
                latest_frames[camera_id] = disconnected_frame(camera_id)
                continue

            data = r.json()

            if "frame" not in data:
                latest_frames[camera_id] = disconnected_frame(camera_id)
                continue

            timestamp = data.get("timestamp",0)

            if time.time() - timestamp > FRAME_TIMEOUT:
                latest_frames[camera_id] = disconnected_frame(camera_id)
                continue

            frame_bytes = base64.b64decode(data["frame"])
            nparr = np.frombuffer(frame_bytes, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            if frame is None:
                latest_frames[camera_id] = disconnected_frame(camera_id)
                continue

        except Exception as e:
            print(f"Camera {camera_id} error:", e)
            latest_frames[camera_id] = disconnected_frame(camera_id)
            continue


        display_frame = cv2.resize(frame,(FRAME_W,FRAME_H))


        # -----------------------------
        # FACE + GENDER DETECTION
        # -----------------------------

        gender, face_box = detect_gender(display_frame)
        detected_gender[camera_id] = gender

        if face_box is not None:

            (x1,y1,x2,y2) = face_box

            cv2.rectangle(display_frame,(x1,y1),(x2,y2),(255,255,0),2)

            cv2.putText(display_frame,
                        gender,
                        (x1,y1-10),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.7,
                        (255,255,0),
                        2)


        # -----------------------------
        # VIOLENCE MODEL (THROTTLED)
        # -----------------------------

        prob = 0

        if current_time - last_prediction[camera_id] > PREDICTION_INTERVAL:

            img = cv2.resize(frame,(224,224))
            img = img.astype("float32")/255.0
            img = np.expand_dims(img,axis=0)

            prob = model.predict(img,verbose=0)[0][0]

            last_prediction[camera_id] = current_time


        label = "Violence" if prob>0.6 else "Normal"
        color = (0,0,255) if prob>0.6 else (0,255,0)

        cv2.putText(display_frame,
            camera_id,
            (20,35),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (255,255,255),
            2)

        cv2.putText(display_frame,
            f"{label}: {prob:.2f}",
            (20,70),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            color,
            2)


        # -----------------------------
        # VIOLENCE ALERT
        # -----------------------------

        if prob > 0.60:

            gender = detected_gender[camera_id]

            h,w,_ = display_frame.shape

            bx1=int(w*0.3)
            by1=int(h*0.2)
            bx2=int(w*0.7)
            by2=int(h*0.8)

            cv2.rectangle(display_frame,(bx1,by1),(bx2,by2),(0,0,255),4)

            cv2.putText(display_frame,
                        f"VIOLENCE {prob:.2f}",
                        (bx1,by1-20),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.9,
                        (0,0,255),
                        3)

            cv2.putText(display_frame,
                        f"GENDER: {gender}",
                        (bx1,by1-60),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.9,
                        (0,255,255),
                        3)

            if current_time-last_saved[camera_id]>5:

                print(f"🚨 Violence detected on {camera_id}")
                print(f"Detected gender: {gender}")

                try:
                    save_incident(camera_id,float(prob),display_frame)
                    print("☁ Uploaded to Supabase")
                    last_saved[camera_id]=current_time

                except Exception as e:
                    print("❌ Upload failed:",e)

        latest_frames[camera_id]=display_frame


    row1=np.hstack([
        latest_frames["main_entrance"],
        latest_frames["parking"],
        latest_frames["corridor"]
    ])

    row2=np.hstack([
        latest_frames["library"],
        latest_frames["food_court"],
        latest_frames["platform"]
    ])

    grid=np.vstack([row1,row2])

    cv2.imshow("AI Surveillance System",grid)

    if cv2.waitKey(1)&0xFF==ord("q"):
        break

cv2.destroyAllWindows()