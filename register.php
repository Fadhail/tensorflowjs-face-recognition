
<?php
$data = json_decode(file_get_contents('php://input'), true);
$name = $data['name'];
$descriptor = json_encode($data['descriptor']);

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

$stmt = $conn->prepare("INSERT INTO registered_faces (name, descriptor) VALUES (?, ?)");
$stmt->bind_param("ss", $name, $descriptor);

if ($stmt->execute()) {
    echo json_encode(['message' => 'Face registered successfully']);
} else {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to register face']);
}

$stmt->close();
$conn->close();
?>