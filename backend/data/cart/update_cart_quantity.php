<?php
include_once '../config/database.php';

function updateCartQuantity() {
    global $connect;
    
    $data = json_decode(file_get_contents('php://input'), true);
    $cart_id = $data['cart_id'] ?? null;
    $quantity = $data['quantity'] ?? null;

    if (!$cart_id || $quantity < 1) {
        echo json_encode(['error' => true, 'message' => 'Invalid parameters']);
        return;
    }

    $stmt = $connect->prepare("UPDATE cart SET quantity = ? WHERE cart_id = ?");
    $stmt->bind_param("ii", $quantity, $cart_id);
    
    if ($stmt->execute()) {
        echo json_encode(['error' => false, 'message' => 'Cart updated']);
    } else {
        echo json_encode(['error' => true, 'message' => 'Failed to update cart']);
    }
    $stmt->close();
}