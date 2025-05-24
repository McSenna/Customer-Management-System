<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: POST, GET');
header('Access-Control-Allow-Headers: Content-Type');

$host = 'localhost';
$dbname = 'customer_management';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Create a new payment record
        $data = json_decode(file_get_contents('php://input'), true);

        $purchase_id = $data['purchase_id'] ?? null;
        $payment_method = $data['payment_method'] ?? null;
        $payment_status = $data['payment_status'] ?? null;
        $transaction_id = $data['transaction_id'] ?? null;
        $amount = $data['amount'] ?? null;

        if (!$purchase_id || !$payment_method || !$payment_status || !$amount) {
            http_response_code(400);
            echo json_encode(['message' => 'Missing required payment data']);
            exit;
        }

        $sql = "INSERT INTO payments (purchase_id, payment_method, payment_status, transaction_id, amount) 
                VALUES (:purchase_id, :payment_method, :payment_status, :transaction_id, :amount)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':purchase_id' => $purchase_id,
            ':payment_method' => $payment_method,
            ':payment_status' => $payment_status,
            ':transaction_id' => $transaction_id,
            ':amount' => $amount
        ]);

        echo json_encode(['message' => 'Payment recorded successfully', 'payment_id' => $pdo->lastInsertId()]);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Get payment details by purchase_id
        if (!isset($_GET['purchase_id'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Missing purchase_id parameter']);
            exit;
        }
        $purchase_id = intval($_GET['purchase_id']);

        $sql = "SELECT * FROM payments WHERE purchase_id = :purchase_id ORDER BY payment_date DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':purchase_id' => $purchase_id]);
        $payments = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($payments);
    } else {
        http_response_code(405);
        echo json_encode(['message' => 'Method Not Allowed']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Database error: ' . $e->getMessage()]);
}
