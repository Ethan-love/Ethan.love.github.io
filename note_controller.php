<?php
// 连接数据库
$servername = "localhost";
$username = "your_username";
$password = "your_password";
$dbname = "notes";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("连接失败: ". $conn->connect_error);
}

// 处理上传便签
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['image']) && isset($_POST['text'])) {
    $image = $_FILES['image'];
    $imageName = uniqid(). '_'. $image['name'];
    $imagePath = 'uploads/'. $imageName;
    move_uploaded_file($image['tmp_name'], $imagePath);

    $text = $_POST['text'];
    $sql = "INSERT INTO notes (image_path, text, created_at) VALUES ('$imagePath', '$text', NOW())";

    if ($conn->query($sql) === TRUE) {
        http_response_code(200);
    } else {
        http_response_code(500);
    }
}

// 获取所有便签
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT * FROM notes";
    $result = $conn->query($sql);

    $notes = array();
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $notes[] = $row;
        }
    }

    header('Content-Type: application/json');
    echo json_encode($notes);
}

$conn->close();
?>