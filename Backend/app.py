print("🚀 BACKEND CAMERA SERVER STARTED")

from fastapi import FastAPI, UploadFile, File, WebSocket, Request, Body
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client

import numpy as np
import cv2
import os
import json
import time
import base64

# -------------------------
# SUPABASE CONFIG
# -------------------------

SUPABASE_URL = "https://etnxtifhohnchbbafjgj.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0bnh0aWZob2huY2hiYmFmamdqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzE1OTI3OSwiZXhwIjoyMDg4NzM1Mjc5fQ.51poGDxKoLnHM61aDrI7O-kSXSF7-Q6iSrpHmw6p_IU"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# -------------------------
# FASTAPI APP
# -------------------------

app = FastAPI()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# serve camera client
app.mount("/camera", StaticFiles(directory="CameraClient", html=True), name="camera")

# -------------------------
# CORS
# -------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# LOAD FACE + GENDER MODELS
# -------------------------

FACE_PROTO = os.path.join(BASE_DIR, "models", "deploy.prototxt")
FACE_MODEL = os.path.join(BASE_DIR, "models", "res10_300x300_ssd_iter_140000.caffemodel")

GENDER_PROTO = os.path.join(BASE_DIR, "models", "deploy_gender.prototxt")
GENDER_MODEL = os.path.join(BASE_DIR, "models", "gender_net.caffemodel")

face_net = cv2.dnn.readNetFromCaffe(FACE_PROTO, FACE_MODEL)
gender_net = cv2.dnn.readNetFromCaffe(GENDER_PROTO, GENDER_MODEL)

gender_list = ["Male", "Female"]

# -------------------------
# CAMERA FRAME MEMORY
# -------------------------

latest_frames = {}

# -------------------------
# GENDER DETECTION
# -------------------------

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

            return gender

    return "Unknown"

# -------------------------
# HOME
# -------------------------

@app.get("/")
def home():
    return {"message": "Women Security AI Backend Running"}

# -------------------------
# RECEIVE CAMERA FRAME
# -------------------------

@app.post("/frame/{camera_id}")
async def receive_frame(camera_id: str, file: UploadFile = File(...)):

    contents = await file.read()

    nparr = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if frame is None:
        return {"error": "Invalid frame"}

    # detect gender
    gender = detect_gender(frame)

    # encode frame to hex
    _, buffer = cv2.imencode(".jpg", frame)
    frame_hex = buffer.tobytes().hex()

    latest_frames[camera_id] = {
        "frame": frame_hex,
        "timestamp": time.time(),
        "gender": gender
    }

    return {"status": "frame received", "camera": camera_id}

# -------------------------
# CAMERA FRAME MEMORY
# -------------------------

latest_frames = {}

CAMERA_TIMEOUT = 3  # seconds before camera is considered offline

# -------------------------
# GET LATEST CAMERA FRAME
# -------------------------

@app.get("/camera_feed/{camera_id}")
def camera_feed(camera_id: str):

    if camera_id not in latest_frames:
        return {
            "camera": camera_id,
            "status": "waiting"
        }

    frame_data = latest_frames[camera_id]

    # check camera timeout
    now = time.time()
    last_seen = frame_data["timestamp"]

    if now - last_seen > CAMERA_TIMEOUT:
        return {
            "camera": camera_id,
            "status": "offline"
        }

    frame_hex = frame_data["frame"]
    frame_bytes = bytes.fromhex(frame_hex)

    frame_base64 = base64.b64encode(frame_bytes).decode("utf-8")

    return {
        "camera": camera_id,
        "frame": frame_base64,
        "gender": frame_data["gender"],
        "timestamp": last_seen,
        "status": "online"
    }

# -------------------------
# INCIDENT API
# -------------------------

@app.get("/incidents")
def get_incidents():

    response = supabase.table("incidents") \
        .select("*") \
        .order("id", desc=True) \
        .execute()

    incidents = []

    for r in response.data:

        try:
            prob = float(r["probability"])
        except:
            prob = 0.0

        incidents.append({
            "id": r["id"],
            "camera": r["camera"],
            "probability": prob,
            "image_url": r["image_url"],
            "timestamp": r["timestamp"],
            "status": r.get("status", "active")
        })

    return {"incidents": incidents}

# -------------------------
# DASHBOARD STATS API
# -------------------------


@app.get("/dashboard_stats")
def dashboard_stats():

    try:
        male = 0
        female = 0

        now = time.time()
        CAMERA_TIMEOUT = 3

        cameras_active = 0

        # -------------------------
        # LOCAL CAMERA DATA
        # -------------------------
        for cam in latest_frames.values():

            if now - cam["timestamp"] < CAMERA_TIMEOUT:
                cameras_active += 1

            gender = cam.get("gender")

            if gender == "Male":
                male += 1
            elif gender == "Female":
                female += 1

        population = male + female

        # -------------------------
        # RATIOS
        # -------------------------
        if population > 0:
            female_ratio = round((female / population) * 100)
            male_ratio = 100 - female_ratio
        else:
            female_ratio = 0
            male_ratio = 0

        # -------------------------
        # SUPABASE SAFE CALL
        # -------------------------
        alerts = 0

        try:
            response = supabase.table("incidents").select("*").execute()
            data = response.data if response and response.data else []
        except Exception as e:
            print("❌ Supabase error:", e)
            data = []

        # -------------------------
        # COUNT ALERTS
        # -------------------------
        for incident in data:
            status = str(incident.get("status", "")).lower()
            if status != "resolved":
                alerts += 1

        # -------------------------
        # SAFETY SCORE
        # -------------------------
        safety_score = max(0, 100 - alerts * 10)

        return {
            "population": population,
            "male": male,
            "female": female,
            "female_ratio": female_ratio,
            "male_ratio": male_ratio,
            "alerts": alerts,
            "safety_score": safety_score,
            "cameras_active": cameras_active,
            "timestamp": int(now)
        }

    except Exception as e:
        print("❌ CRITICAL dashboard error:", e)

        # fallback response (IMPORTANT)
        return {
            "population": 0,
            "male": 0,
            "female": 0,
            "female_ratio": 0,
            "male_ratio": 0,
            "alerts": 0,
            "safety_score": 100,
            "cameras_active": 0,
            "timestamp": int(time.time())
        }

    male = 0
    female = 0

    now = time.time()
    CAMERA_TIMEOUT = 3

    cameras_active = 0

    for cam in latest_frames.values():

        # check camera activity
        if now - cam["timestamp"] < CAMERA_TIMEOUT:
            cameras_active += 1

        gender = cam.get("gender")

        if gender == "Male":
            male += 1

        elif gender == "Female":
            female += 1

    population = male + female

    # ratio
    if population > 0:
        female_ratio = round((female / population) * 100)
        male_ratio = 100 - female_ratio
    else:
        female_ratio = 0
        male_ratio = 0

    # get incidents
    response = supabase.table("incidents") \
        .select("*") \
        .execute()

    alerts = 0

    for incident in response.data:

        status = incident.get("status", "").lower()

        if status != "resolved":
            alerts += 1

    # safety score
    safety_score = max(0, 100 - alerts * 10)

    return {
        "population": population,
        "male": male,
        "female": female,
        "female_ratio": female_ratio,
        "male_ratio": male_ratio,
        "alerts": alerts,
        "safety_score": safety_score,
        "cameras_active": cameras_active,
        "timestamp": int(now)
    }

# -------------------------
# UPDATE INCIDENT STATUS
# -------------------------

@app.post("/update_incident_status/{incident_id}")
async def update_incident_status(incident_id: int, data: dict = Body(...)):

    status = data.get("status", "active")

    supabase.table("incidents") \
        .update({"status": status}) \
        .eq("id", incident_id) \
        .execute()

    return {"success": True, "status": status}

# -------------------------
# REALTIME ALERT SYSTEM
# -------------------------

connections = []

@app.websocket("/ws/alerts")
async def websocket_endpoint(websocket: WebSocket):

    await websocket.accept()
    connections.append(websocket)

    try:
        while True:
            await websocket.receive_text()
    except:
        connections.remove(websocket)

async def send_alert(data):

    for connection in connections:
        await connection.send_text(json.dumps(data))

# detection script calls this
@app.post("/alert")
async def alert(request: Request):

    data = await request.json()

    await send_alert(data)

    return {"status": "alert sent"}