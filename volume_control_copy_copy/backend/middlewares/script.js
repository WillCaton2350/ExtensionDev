function activate() {
    let cap = new cv.VideoCapture(0);
    cap.set(cv.CAP_PROP_FRAME_WIDTH, 640);
    cap.set(cv.CAP_PROP_FRAME_HEIGHT, 480);
    let detector = new HandTrackingModule.HandDetector(1, 0.3);
    let volumeMin = 0;
    let volumeMax = 100;
    let currentVolume = volumeMin;
    function processVideo() {
        let begin = Date.now();
        cap.read(img);
        let hands = detector.findHands(img, false);
        hands.forEach(hand => {
            let { x, y, width, height } = hand.bbox;
            cv.rectangle(img, new cv.Point(x, y), new cv.Point(x + width, y + height), [0, 255, 0, 255], 2);
            let length = Math.hypot(hand.lmList[8][0] - hand.lmList[4][0], hand.lmList[8][1] - hand.lmList[4][1]);
            if (length < 40) {
                cv.circle(img, new cv.Point(hand.lmList[8][0], hand.lmList[8][1]), 10, [0, 255, 0, 255], cv.FILLED);
            }
            let targetVolume = cv.interp(length, [40, 200], [volumeMin, volumeMax]);
            let step = 58;
            if (currentVolume < targetVolume) {
                currentVolume = Math.min(currentVolume + step, targetVolume);
            } else if (currentVolume > targetVolume) {
                currentVolume = Math.max(currentVolume - step, targetVolume);
            }
            console.log(`Volume set to ${currentVolume}`);
        });
        cv.putText(img, `FPS: ${Math.round(1000 / (Date.now() - begin))}`, new cv.Point(50, 70), cv.FONT_HERSHEY_SIMPLEX, 1, [255, 0, 0, 255], 2);
        requestAnimationFrame(processVideo);
    }
    processVideo();
}
