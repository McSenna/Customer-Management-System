<?php

function addToCart() {
    global $connect;
    
    $data = json_decode(file_get_contents('php://input'), true);
    $customer_id = $data['customer_id'] ?? null;
    $product_id = $data['product_id'] ?? null;
    $quantity = $data['quantity'] ?? 1;

    if (!$customer_id || !$product_id) {
        echo json_encode(['error' => true, 'message' => 'Missing required parameters']);
        return;
    }

    // Check if product exists and has stock
    $stmt = $connect->prepare("SELECT stocks FROM products WHERE id = ?");
    $stmt->bind_param("i", $product_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows === 0 || $result->fetch_assoc()['stocks'] < $quantity) {
        echo json_encode(['error' => true, 'message' => 'Product unavailable or insufficient stock']);
        return;
    }

    // Check if item already in cart
    $stmt = $connect->prepare("SELECT cart_id, quantity FROM cart WHERE customer_id = ? AND product_id = ?");
    $stmt->bind_param("ii", $customer_id, $product_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $new_quantity = $row['quantity'] + $quantity;
        $stmt = $connect->prepare("UPDATE cart SET quantity = ? WHERE cart_id = ?");
        $stmt->bind_param("ii", $new_quantity, $row['cart_id']);
    } else {
        $stmt = $connect->prepare("INSERT INTO cart (customer_id, product_id, quantity) VALUES (?, ?, ?)");
        $stmt->bind_param("iii", $customer_id, $product_id, $quantity);
    }

    if ($stmt->execute()) {
        echo json_encode(['error' => false, 'message' => 'Product added to cart']);
    } else {
        echo json_encode(['error' => true, 'message' => 'Failed to add to cart']);
    }
    $stmt->close();
}