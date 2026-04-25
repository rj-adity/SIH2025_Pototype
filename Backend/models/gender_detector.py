import cv2

GENDER_PROTO = "Backend/models/deploy_gender.prototxt"
GENDER_MODEL = "Backend/models/gender_net.caffemodel"

gender_net = cv2.dnn.readNet(GENDER_MODEL, GENDER_PROTO)

GENDER_LIST = ["Male", "Female"]

face_detector = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)


def detect_gender(face):

    blob = cv2.dnn.blobFromImage(
        face,
        1.0,
        (227, 227),
        (78.4263377603, 87.7689143744, 114.895847746),
        swapRB=False
    )

    gender_net.setInput(blob)

    preds = gender_net.forward()

    gender = GENDER_LIST[preds[0].argmax()]

    return gender


def count_gender(frame):

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    faces = face_detector.detectMultiScale(gray, 1.3, 5)

    male = 0
    female = 0

    for (x, y, w, h) in faces:

        face = frame[y:y+h, x:x+w]

        gender = detect_gender(face)

        if gender == "Male":
            male += 1
        else:
            female += 1

    return male, female