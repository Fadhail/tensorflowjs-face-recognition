const video = document.getElementById('video');

async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 720, height: 560 }
    });
    video.srcObject = stream;
    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}

async function loadModels() {
    await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    ]);
    console.log("Models Loaded");
}

async function start() {
    await setupCamera();
    await loadModels();
    console.log("Camera and models are ready.");
}

start();

const registerButton = document.getElementById('register');
const nameInput = document.getElementById('name');

registerButton.addEventListener('click', async () => {
    const name = nameInput.value;
    if (!name) {
        alert('Please enter a name');
        return;
    }

    const faceDescriptor = await detectFace();
    if (faceDescriptor) {
        try {
            const response = await fetch('register.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: name, descriptor: Array.from(faceDescriptor) })
            });

            if (response.ok) {
                alert('Face registered successfully!');
            } else {
                alert('Failed to register face.');
            }
        } catch (error) {
            alert('Failed to register face.');
        }
    }
});

async function detectFace() {
    const options = new faceapi.TinyFaceDetectorOptions();
    const detections = await faceapi.detectSingleFace(video, options).withFaceLandmarks().withFaceDescriptor();

    if (detections) {
        return detections.descriptor;
    }
    alert('No face detected. Please try again.');
    return null;
}

const recognizeButton = document.getElementById('recognize');

recognizeButton.addEventListener('click', async () => {
    const faceDescriptor = await detectFace();
    if (faceDescriptor) {
        try {
            const response = await fetch('recognize.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ descriptor: Array.from(faceDescriptor) })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.label !== 'unknown') {
                    markAttendance(result.label);
                    alert(`Face recognized! Attendance marked for ${result.label}.`);
                } else {
                    alert('Face not recognized.');
                }
            } else {
                alert('Failed to recognize face.');
            }
        } catch (error) {
            alert('Failed to recognize face.');
        }
    }
});

function markAttendance(name) {
    const date = new Date().toLocaleDateString('en-IN');
    const time = new Date().toLocaleTimeString('en-IN');

    fetch('mark_attendance.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name, date: date, time: time })
    }).then(response => {
        if (!response.ok) {
            alert('Failed to mark attendance.');
        }
    });
}

const exportButton = document.getElementById('export');

exportButton.addEventListener('click', () => {
    const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    const csvContent = "data:text/csv;charset=utf-8,"
        + ["Name,Date,Time"].concat(attendanceRecords.map(record => `${record.name},${record.date},${record.time}`)).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "attendance.csv");
    document.body.appendChild(link);
    link.click();
});
