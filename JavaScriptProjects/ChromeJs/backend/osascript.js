/*
class HandDetector {
    constructor(staticMode = false, maxHands = 2, modelComplexity = 1, detectionCon = 0.5, minTrackCon = 0.5) {
        this.staticMode = staticMode;
        this.maxHands = maxHands;
        this.modelComplexity = modelComplexity;
        this.detectionCon = detectionCon;
        this.minTrackCon = minTrackCon;
        this.mpHands = new cv.Hands({
            static_image_mode: this.staticMode,
            max_num_hands: this.maxHands,
            model_complexity: this.modelComplexity,
            min_detection_confidence: this.detectionCon,
            min_tracking_confidence: this.minTrackCon
        });
        this.mpDraw = new cv.DrawingUtils();
        this.tipIds = [4, 8, 12, 16, 20];
        this.fingers = [];
        this.lmList = [];
    }

    findHands(img, draw = true, flipType = true) {
        const imgRGB = new cv.Mat();
        cv.cvtColor(img, imgRGB, cv.COLOR_BGR2RGB);
        this.results = this.mpHands.process(imgRGB);
        const allHands = [];
        const h = img.rows;
        const w = img.cols;
        if (this.results.multiHandLandmarks) {
            for (const [handType, handLms] of zip(this.results.multiHandedness, this.results.multiHandLandmarks)) {
                const myHand = {};
                const mylmList = [];
                const xList = [];
                const yList = [];
                for (const [id, lm] of enumerate(handLms.landmark)) {
                    const px = Math.round(lm.x * w);
                    const py = Math.round(lm.y * h);
                    const pz = Math.round(lm.z * w);
                    mylmList.push([px, py, pz]);
                    xList.push(px);
                    yList.push(py);
                }
                const xmin = Math.min(...xList);
                const xmax = Math.max(...xList);
                const ymin = Math.min(...yList);
                const ymax = Math.max(...yList);
                const boxW = xmax - xmin;
                const boxH = ymax - ymin;
                const bbox = [xmin, ymin, boxW, boxH];
                const cx = bbox[0] + (bbox[2] / 2);
                const cy = bbox[1] + (bbox[3] / 2);

                myHand.lmList = mylmList;
                myHand.bbox = bbox;
                myHand.center = [cx, cy];

                if (flipType) {
                    myHand.type = handType.classification[0].label === "Right" ? "Left" : "Right";
                } else {
                    myHand.type = handType.classification[0].label;
                }
                allHands.push(myHand);

                if (draw) {
                    this.mpDraw.drawLandmarks(img, handLms, this.mpHands.HAND_CONNECTIONS);
                    cv.rectangle(img, new cv.Point(bbox[0] - 20, bbox[1] - 20), new cv.Point(bbox[0] + bbox[2] + 20, bbox[1] + bbox[3] + 20), [255, 0, 255, 255], 2);
                    cv.putText(img, myHand.type, new cv.Point(bbox[0] - 30, bbox[1] - 30), cv.FONT_HERSHEY_PLAIN, 2, [255, 0, 255, 255], 2);
                }
            }
        }
        imgRGB.delete();
        return [allHands, img];
    }

    fingersUp(myHand) {
        const fingers = [];
        const myHandType = myHand.type;
        const myLmList = myHand.lmList;
        if (this.results.multiHandLandmarks) {
            if (myHandType === "Right" ? myLmList[this.tipIds[0]][0] > myLmList[this.tipIds[0] - 1][0] : myLmList[this.tipIds[0]][0] < myLmList[this.tipIds[0] - 1][0]) {
                fingers.push(1);
            } else {
                fingers.push(0);
            }

            for (let id = 1; id < 5; id++) {
                fingers.push(myLmList[this.tipIds[id]][1] < myLmList[this.tipIds[id] - 2][1] ? 1 : 0);
            }
        }
        return fingers;
    }

    findDistance(p1, p2, img = null, color = [255, 0, 255, 255], scale = 5) {
        const [x1, y1] = p1;
        const [x2, y2] = p2;
        const cx = Math.round((x1 + x2) / 2);
        const cy = Math.round((y1 + y2) / 2);
        const length = Math.hypot(x2 - x1, y2 - y1);
        const info = [x1, y1, x2, y2, cx, cy];
        if (img !== null) {
            cv.circle(img, new cv.Point(x1, y1), scale, color, cv.FILLED);
            cv.circle(img, new cv.Point(x2, y2), scale, color, cv.FILLED);
            cv.line(img, new cv.Point(x1, y1), new cv.Point(x2, y2), color, Math.max(1, scale / 3));
            cv.circle(img, new cv.Point(cx, cy), scale, color, cv.FILLED);
        }
        return [length, info, img];
    }
}

function enumerate(iterable) {
    return [...iterable.entries()];
}

function zip(...iterables) {
    return iterables[0].map((_, i) => iterables.map(iterable => iterable[i]));
}


function main() {

    const videoElement = document.getElementById('videoElement');

    navigator.mediaDevices.getUserMedia({ video: { deviceId: 2 } }).then((stream) => {
        videoElement.srcObject = stream;
        videoElement.play();
    });
}

    const detector = new HandDetector(false, 2, 1, 0.5, 0.5);

    const processVideo = () => {
        const img = new cv.Mat(videoElement.height, videoElement.width, cv.CV_8UC4);
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.width;
        canvas.height = videoElement.height;
        const context = canvas.getContext('2d');
        context.drawImage(videoElement, 0, 0, videoElement.width, videoElement.height);
        img.data.set(context.getImageData(0, 0));
        }
*/
