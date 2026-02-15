import cv2
import numpy as np
from keras.models import model_from_json
from flask import Flask, Response
from flask_cors import CORS
import logging
import time
from collections import deque
import signal
import sys

# 🔇 Hide flask logs
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

app = Flask(__name__)
CORS(app)

# ---------------- LOAD MODEL ----------------
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model_json_path = os.path.join(BASE_DIR, "facialemotionmodel.json")
model_weights_path = os.path.join(BASE_DIR, "facialemotionmodel.weights.h5")

with open(model_json_path, "r") as json_file:
    model_json = json_file.read()

model = model_from_json(model_json)
model.load_weights(model_weights_path)


face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
)

def extract_features(image):
    image = np.array(image)
    image = image.reshape(1,64,64,1)
    return image / 255.0

# ⭐ webcam (Windows fix)
webcam = cv2.VideoCapture(0, cv2.CAP_DSHOW)

# ⭐⭐⭐ VERY IMPORTANT — graceful shutdown for Node
def shutdown_handler(signum, frame):
    print("Stopping Emotion AI and releasing camera...")
    webcam.release()
    sys.exit(0)

signal.signal(signal.SIGTERM, shutdown_handler)
signal.signal(signal.SIGINT, shutdown_handler)

# ⭐ smoothing buffer
emotion_buffer = deque(maxlen=15)
last_emotion = "Detecting..."

# ---------------- STREAM FRAMES ----------------
def generate_frames():
    global last_emotion

    while True:
        success, frame = webcam.read()
        if not success:
            continue

        frame = cv2.flip(frame, 1)
        frame = cv2.resize(frame, None, fx=1.3, fy=1.3)

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        faces = face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=3,
            minSize=(30,30)
        )

        for (x,y,w,h) in faces:
            pad = 20
            x1 = max(0, x-pad)
            y1 = max(0, y-pad)
            x2 = x+w+pad
            y2 = y+h+pad

            face = gray[y1:y2, x1:x2]
            face = cv2.resize(face,(64,64))

            img = extract_features(face)
            pred = model.predict(img, verbose=0)

            angry    = pred[0][0] * 1.2
            disgust  = pred[0][1] * 1.1
            fear     = pred[0][2] * 1.2
            happy    = pred[0][3] * 1.0
            sad      = pred[0][5] * 1.4
            surprise = pred[0][6] * 0.7

            happy_score = happy + surprise
            sad_score   = angry + disgust + fear + sad

            confidence = abs(happy_score - sad_score)
            if confidence < 0.15:
                continue

            if happy_score > sad_score:
                current_emotion = "Happy"
            else:
                current_emotion = "Sad"

            emotion_buffer.append(current_emotion)
            last_emotion = max(set(emotion_buffer), key=emotion_buffer.count)

            cv2.rectangle(frame,(x1,y1),(x2,y2),(255,0,0),2)
            cv2.putText(frame, last_emotion,
                        (x1,y1-10),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        1,(0,0,255),2)

        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

        time.sleep(0.05)

@app.route('/video')
def video():
    return Response(generate_frames(),
        mimetype='multipart/x-mixed-replace; boundary=frame')

# ---------------- START SERVER ----------------
if __name__ == "__main__":
    print("Emotion AI running at http://localhost:8001/video")
    app.run(host="0.0.0.0", port=8001, debug=False, use_reloader=False)
