<?php
include_once './config/database.php';

function get_customer() {
    global $connect;

    if (!isset($_GET['customer_id']) || empty($_GET['customer_id'])) {
        echo json_encode([
            'error' => true,
            'message' => 'Customer ID is required'
        ]);
        return;
    }

    $customerId = $_GET['customer_id'];

    // Prepare SQL to fetch customer data and loyalty points
    $stmt = $connect->prepare("
        SELECT c.id, c.customer_code, c.name, c.email, c.phone, c.address, 
               c.created_at, COALESCE(lp.points_earned - lp.points_redeemed, 0) as loyalty_points,
               CASE WHEN lp.points_earned > 0 THEN 'Active' ELSE 'Inactive' END as subscription_status
        FROM customers c
        LEFT JOIN loyaltypoints lp ON c.id = lp.customer_id
        WHERE c.id = ?
    ");

    if (!$stmt) {
        echo json_encode([
            'error' => true,
            'message' => 'Database preparation error: ' . $connect->error
        ]);
        return;
    }

    $stmt->bind_param("i", $customerId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode([
            'error' => true,
            'message' => 'Customer not found'
        ]);
        return;
    }

    $customer = $result->fetch_assoc();
    $stmt->close();

    echo json_encode([
        'error' => false,
        'data' => $customer
    ]);
}