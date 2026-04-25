from supabase import create_client
from datetime import datetime
import cv2
import time
import requests

SUPABASE_URL = "https://etnxtifhohnchbbafjgj.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0bnh0aWZob2huY2hiYmFmamdqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzE1OTI3OSwiZXhwIjoyMDg4NzM1Mjc5fQ.51poGDxKoLnHM61aDrI7O-kSXSF7-Q6iSrpHmw6p_IU"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def save_incident(camera, probability, frame):

    filename = f"event_{int(time.time())}.jpg"

    # convert frame to jpeg bytes
    success, buffer = cv2.imencode(".jpg", frame)

    if not success:
        print("❌ Failed to encode image")
        return

    image_bytes = buffer.tobytes()

    # upload to supabase storage
    supabase.storage.from_("events").upload(
        filename,
        image_bytes,
        {"content-type": "image/jpeg"}
    )

    image_url = f"{SUPABASE_URL}/storage/v1/object/public/events/{filename}"

    data = {
        "camera": camera,
        "probability": probability,
        "image_url": image_url,
        "timestamp": datetime.utcnow().isoformat(),
        "status": "active"
    }

    # insert into database
    supabase.table("incidents").insert(data).execute()

    # notify dashboard
    try:
        requests.post(
            "http://127.0.0.1:8000/alert",
            json=data
        )
    except:
        pass