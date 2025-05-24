<?php
include_once '../config/database.php';

function createOrder() {
    global $connect;
    
    $data = json_decode(file_get_contents('php://input'), true);
    $customer_id = $data['customer_id'] ?? null;
    $cart_items = $data['cart_items'] ?? [];

    if (!$customer_id || empty($cart_items)) {
        echo json_encode(['error' => true, 'message' => 'Invalid order data']);
        return;
    }

    $connect->begin_transaction();
    try {
        $total_amount = 0;
        foreach ($cart_items as $item) {
            $stmt = $connect->prepare("SELECT price, stocks FROM products WHERE id = ?");
            $stmt->bind_param("i", $item['product_id']);
            $stmt->execute();
            $result = $stmt->get_result();
            $product = $result->fetch_assoc();
            
            if ($product['stocks'] < $item['quantity']) {
                throw new Exception("Insufficient stock for product ID: " . $item['product_id']);
            }
            
            $total_amount += $product['price'] * $item['quantity'];
            
            $stmt = $connect->prepare("
                INSERT INTO purchases (customer_id, product_id, quantity, total_amount)
                VALUES (?, ?, ?, ?)
            ");
            $stmt->bind_param("iiid", $customer_id, $item['product_id'], $item['quantity'], $total_amount);
            $stmt->execute();
            
            $stmt = $connect->prepare("UPDATE products SET stocks = stocks - ? WHERE id = ?");
            $stmt->bind_param("ii", $item['quantity'], $item['product_id']);
            $stmt->execute();
        }

        $stmt = $connect->prepare("DELETE FROM cart WHERE customer_id = ?");
        $stmt->bind_param("i", $customer_id);
        $stmt->execute();
        
        $connect->commit();
        $purchase_id = $connect->insert_id;
        
        echo json_encode([
            'error' => false,
            'message' => 'Order created successfully',
            'purchase_id' => $purchase_id
        ]);
    } catch (Exception $e) {
        $connect->rollback();
        echo json_encode(['error' => true, 'message' => $e->getMessage()]);
    }
}