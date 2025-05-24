<?php
include_once '../config/database.php';

function getCart() {
    global $connect;
    
    $customer_id = $_GET['customer_id'] ?? null;
    
    if (!$customer_id) {
        echo json_encode(['error' => true, 'message' => 'Customer ID required']);
        return;
    }

    $stmt = $connect->prepare("
        SELECT c.cart_id, c.product_id, c.quantity, p.name, p.price, p.product_image
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.customer_id = ?
    ");
    $stmt->bind_param("i", $customer_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $cart = [];
    while ($row = $result->fetch_assoc()) {
        $cart[] = $row;
    }
    
    echo json_encode(['error' => false, 'data' => $cart]);
    $stmt->close();
}