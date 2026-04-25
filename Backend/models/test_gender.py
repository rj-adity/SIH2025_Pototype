import cv2
from gender_detector import count_gender

cap = cv2.VideoCapture(0)

while True:

    ret, frame = cap.read()

    male, female = count_gender(frame)

    text = f"Male: {male} Female: {female}"

    cv2.putText(frame, text, (20,40),
                cv2.FONT_HERSHEY_SIMPLEX, 1,
                (0,255,0), 2)

    cv2.imshow("Gender Detection", frame)

    if cv2.waitKey(1) == 27:
        break

cap.release()
cv2.destroyAllWindows()