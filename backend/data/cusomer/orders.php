<?php
session_start();
header('Content-Type: application/json');

// Database connection
$host = 'localhost';
$db   = 'customer_management';  // change to your DB name
$user = 'root';  // change to your DB user
$pass = '';  // change to your DB password

$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit();
}

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

$userId = $_SESSION['user_id'];

// Fetch purchases for the user (optionally join with products if needed)
$sql = "SELECT 
            p.purchase_id,
            p.purchase_date,
            p.total_amount,
            p.quantity,
            p.product_id,
            pr.product_name
        FROM purchases p
        LEFT JOIN products pr ON p.product_id = pr.product_id
        WHERE p.customer_id = ?
        ORDER BY p.purchase_date DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$orders = [];

while ($row = $result->fetch_assoc()) {
    $orders[] = [
        'id' => 'ORD-' . str_pad($row['purchase_id'], 3, '0', STR_PAD_LEFT),
        'orderDate' => $row['purchase_date'],
        'total' => (float) $row['total_amount'],
        'status' => 'completed',  // Hardcoded unless you have a real status column
        'items' => (int) $row['quantity'],
        'productName' => $row['product_name'],
        'paymentMethod' => 'Credit Card', // Static unless you store it
        'paymentStatus' => 'paid'         // Static unless you store it
    ];
}

echo json_encode($orders);
$conn->close();
?>
