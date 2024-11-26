
<?php
$data = json_decode(file_get_contents('php://input'), true);
$name = $data['name'];
$date = $data['date'];
$time = $data['time'];

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "face_recognition";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['message' => 'Database connection failed']);
    exit();
}

$stmt = $conn->prepare("INSERT INTO attendance_records (name, date, time) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $name, $date, $time);

if ($stmt->execute()) {
    echo json_encode(['message' => 'Attendance marked successfully']);
} else {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to mark attendance']);
}

$stmt->close();
$conn->close();
?>