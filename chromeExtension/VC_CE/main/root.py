from hand_tracking_module import handDectector
import cvzone
from datetime import datetime
import numpy as np
import math
import cv2
import os

camera_width, camera_height = [640, 480]
cap = cv2.VideoCapture(0)
cap.set(3, camera_width)
cap.set(4, camera_height)
volume_min = 0
volume_max = 100
current_volume = volume_min
os.system(f"osascript -e 'set volume output volume {current_volume}'")
if not cap.isOpened():
    print("Error: Could not open camera.")
else:
    detector = cvzone.HandTrackingModule.HandDetector(maxHands=1,detectionCon=0.7)
    landmark_detector = handDectector(max_hands=1, detection_confidence=0.3)
    while True:
        previous_timestamp = datetime.now()
        success, img = cap.read()
        img = detector.findHands(img, draw=False)
        landmark_list = landmark_detector.find_position(img, draw=False)
        print(landmark_list)
        if landmark_list:
            x1, y1 = landmark_list[4][1], landmark_list[4][2]
            x2, y2 = landmark_list[8][1], landmark_list[8][2]
            center_x, center_y = (x1 + x2) // 2, (y1 + y2) // 2
            cv2.circle(img, (x1, y1), 10, (255, 0, 255), cv2.FILLED)
            cv2.circle(img, (x2, y2), 10, (255, 0, 255), cv2.FILLED)
            cv2.line(img, (x1, y1), (x2, y2), (255, 0, 255), 3)
            cv2.circle(img, (center_x, center_y), 10, (255, 0, 255), cv2.FILLED)
            length = math.hypot(x2 - x1, y2 - y1)
            # Recognizes my hand as a right triangle and calculates the distance between each landmark in pixels. 
            # Landmark[4] = x1,y1 and landmark[8] = x2,y2
            # The hypotenuse is the distance between both landmarks
            # The threshold point is in the middle when the distance passes 40 pixels
            print("\n", length)
            if length < 40:  # 40 pixels
                cv2.circle(img, (center_x, center_y), 10, (0, 255, 0), cv2.FILLED)
            # Adjust the volume smoothly based on finger distance
            target_volume = np.interp(length, [40, 200], [volume_min, volume_max])  # 40 pixels to 200 pixels
            step = 60
            # This step integer determines the smoothness 
            # of the change in volume and the actual volume knob object. 
            # The volume knob that I am reffering to is the volume on the 
            # macbook pro touch bar. 
            if current_volume < target_volume:
                current_volume = min(current_volume + step, target_volume)
            elif current_volume > target_volume:
                current_volume = max(current_volume - step, target_volume)
            os.system(f"osascript -e 'set volume output volume {int(current_volume)}'")
            print(f'Volume set to {int(current_volume)}')
            # Draw a red circle for landmark[0]
            x0, y0 = landmark_list[0][1], landmark_list[0][2]
            cv2.circle(img, (x0, y0), 10, (255, 0, 0), cv2.FILLED)
        current_timestamp = datetime.now()
        time_difference = current_timestamp - previous_timestamp
        fps = 1 / time_difference.total_seconds()
        previous_timestamp = current_timestamp
        cv2.putText(img, f'FPS: {int(fps)}', (50, 70), cv2.FONT_HERSHEY_COMPLEX, 1, (255, 0, 0), 3)
        cv2.imshow('image', img)
        cv2.waitKey(1)
        if not success:
            print("Error: Failed to read frame from the camera.")
            break
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break