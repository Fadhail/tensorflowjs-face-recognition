
<?php
$data = json_decode(file_get_contents('php://input'), true);
$descriptor = $data['descriptor'];

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

$result = $conn->query("SELECT name, descriptor FROM registered_faces");
$bestMatch = ['label' => 'unknown', 'distance' => INF];

while ($row = $result->fetch_assoc()) {
    $registeredDescriptor = json_decode($row['descriptor']);
    $distance = 0;
    for ($i = 0; $i < count($descriptor); $i++) {
        $distance += pow($descriptor[$i] - $registeredDescriptor[$i], 2);
    }
    $distance = sqrt($distance);

    if ($distance < $bestMatch['distance']) {
        $bestMatch = ['label' => $row['name'], 'distance' => $distance];
    }
}

echo json_encode(['label' => $bestMatch['label']]);

$conn->close();
?>