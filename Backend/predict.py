import tensorflow as tf
import numpy as np
import cv2

# Load model
model = tf.keras.models.load_model("models/violence_detection_model.h5")

def predict_frame(frame):

    # resize to model input size
    img = cv2.resize(frame, (224, 224))

    img = img / 255.0
    img = np.expand_dims(img, axis=0)

    prediction = model.predict(img)[0][0]

    violence = prediction > 0.5

    return violence, float(prediction)