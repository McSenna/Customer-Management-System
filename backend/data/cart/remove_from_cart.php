<?php
include_once '../config/database.php';

function removeFromCart() {
    global $connect;
    
    $data = json_decode(file_get_contents('php://input'), true);
    $cart_id = $data['cart_id'] ?? null;

    if (!$cart_id) {
        echo json_encode(['error' => true, 'message' => 'Cart ID required']);
        return;
    }

    $stmt = $connect->prepare("DELETE FROM cart WHERE cart_id = ?");
    $stmt->bind_param("i", $cart_id);
    
    if ($stmt->execute()) {
        echo json_encode(['error' => false, 'message' => 'Item removed from cart']);
    } else {
        echo json_encode(['error' => true, 'message' => 'Failed to remove item']);
    }
    $stmt->close();
}