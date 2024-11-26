
<?php
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

$result = $conn->query("SELECT name, date, time FROM attendance_records ORDER BY date DESC, time DESC");
$attendanceRecords = [];

while ($row = $result->fetch_assoc()) {
    $attendanceRecords[] = $row;
}

echo json_encode($attendanceRecords);

$conn->close();
?>