import signal
import sys
import warnings
warnings.filterwarnings("ignore")
import cv2
import numpy as np
from ultralytics import YOLO
import time
from flask import Flask, Response
from flask_cors import CORS
import logging

# Hide flask logs
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

app = Flask(__name__)
CORS(app)

print("Starting TrustBus HyperMovement AI Web Stream...")

model = YOLO("yolov8n.pt", verbose=False)
cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)

# ⭐ GRACEFUL EXIT HANDLER (VERY IMPORTANT)
def shutdown_handler(signum, frame):
    print("Shutting down HyperMovement AI...")
    cap.release()
    cv2.destroyAllWindows()
    sys.exit(0)

signal.signal(signal.SIGTERM, shutdown_handler)
signal.signal(signal.SIGINT, shutdown_handler)

prev_positions = {}

HYPER_THRESHOLD = 50
ALERT_DURATION = 5
alert_until_time = 0

standing_frames = 0
sitting_frames = 0
STANDING_CONFIRM_FRAMES = 5

def get_center(box):
    x1,y1,x2,y2 = box
    return int((x1+x2)/2), int((y1+y2)/2)

# ⭐ THIS replaces your while True loop
def generate_frames():
    global alert_until_time, standing_frames, sitting_frames

    while True:
        ret, frame = cap.read()
        if not ret:
            continue

        standing_detected_this_frame = False

        results = model.track(frame, persist=True, classes=[0], verbose=False)

        if results[0].boxes.id is not None:
            boxes = results[0].boxes.xyxy.cpu().numpy()
            ids = results[0].boxes.id.cpu().numpy()

            for box, id in zip(boxes, ids):
                x1,y1,x2,y2 = map(int, box)
                cx, cy = get_center(box)

                cv2.rectangle(frame,(x1,y1),(x2,y2),(0,255,0),2)

                height = y2 - y1
                width  = x2 - x1
                ratio = height / width

                if ratio > 2.2:
                    standing_detected_this_frame = True
                    cv2.putText(frame,"STANDING!",
                                (x1,y2+25),
                                cv2.FONT_HERSHEY_SIMPLEX,0.7,(0,0,255),2)

                if id in prev_positions:
                    px, py = prev_positions[id]
                    distance = np.sqrt((cx-px)**2 + (cy-py)**2)

                    if distance > HYPER_THRESHOLD:
                        alert_until_time = time.time() + ALERT_DURATION
                        cv2.putText(frame,"HYPER MOVEMENT!",
                                    (x1,y1-10),
                                    cv2.FONT_HERSHEY_SIMPLEX,0.7,(0,0,255),2)

                prev_positions[id] = (cx, cy)

        # Standing stability logic
        if standing_detected_this_frame:
            standing_frames += 1
            sitting_frames = 0
        else:
            sitting_frames += 1
            if sitting_frames > STANDING_CONFIRM_FRAMES:
                standing_frames = 0

        if time.time() < alert_until_time:
            cv2.putText(frame,"ALERT: Suspicious Activity",
                        (50,50),
                        cv2.FONT_HERSHEY_SIMPLEX,1,(0,0,255),3)

        if standing_frames >= STANDING_CONFIRM_FRAMES:
            cv2.putText(frame,"ALERT: STUDENT STANDING",
                        (50,100),
                        cv2.FONT_HERSHEY_SIMPLEX,1,(0,0,255),3)

        # ⭐ Convert frame → stream (ONLY NEW PART)
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

# Flask route
@app.route('/video')
def video():
    return Response(generate_frames(),
        mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    print("HyperMovement running at http://localhost:8000/video")
    app.run(host="0.0.0.0", port=8000, debug=False, use_reloader=False)
