from flask import Flask, Response
from flask_cors import CORS
import cv2
from ultralytics import YOLO

app = Flask(__name__)
CORS(app)

# Load YOLO face model
model = YOLO("yolov8n-face.pt")

# Open webcam
cap = cv2.VideoCapture(0)

def generate_frames():
    while True:
        success, frame = cap.read()
        if not success:
            break

        # Face detection
        results = model.predict(frame, conf=0.15, imgsz=960, verbose=False)

        for r in results:
            for box in r.boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])

                shrink = 0.02
                w = x2 - x1
                h = y2 - y1

                x1 += int(w * shrink)
                y1 += int(h * shrink)
                x2 -= int(w * shrink)
                y2 -= int(h * shrink)

                x1 = max(0, x1)
                y1 = max(0, y1)
                x2 = min(frame.shape[1], x2)
                y2 = min(frame.shape[0], y2)

                face = frame[y1:y2, x1:x2]
                if face.size == 0:
                    continue

                blur_strength = max(31, (x2 - x1) // 2 * 2 + 1)
                face_blur = cv2.GaussianBlur(face, (blur_strength, blur_strength), 20)
                frame[y1:y2, x1:x2] = face_blur

        # Encode frame as JPEG
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()

        # Stream frame
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/ai-camera')
def video_feed():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    app.run(port=5001, debug=True)
