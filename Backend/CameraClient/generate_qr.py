import qrcode
import re

# read the config file
with open("config.js", "r") as f:
    config = f.read()

# extract SERVER_URL
match = re.search(r'https?://[^\s"]+', config)

if not match:
    raise Exception("SERVER_URL not found in config.js")

SERVER_URL = match.group(0)


cameras = [
    "main_entrance",
    "parking",
    "corridor",
    "library",
    "food_court",
    "platform"
]

for cam in cameras:

    url = f"{SERVER_URL}/camera/camera.html?camera_id={cam}"

    img = qrcode.make(url)
    img.save(f"{cam}.png")

    print("Generated:", url)