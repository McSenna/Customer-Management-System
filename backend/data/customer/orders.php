<?php
include_once './config/database.php';

header('Content-Type: application/json');

$purchase_id = $_GET['purchase_id'] ?? null;

if ($purchase_id) {
    $stmt = $connect->prepare("
        SELECT p.purchase_id, p.customer_id, p.product_id, p.quantity, p.total_amount, p.purchase_date,
               pr.name as product_name, pr.price, pr.product_image,
               pm.payment_status, pm.payment_method
        FROM purchases p
        JOIN products pr ON p.product_id = pr.id
        LEFT JOIN payments pm ON p.purchase_id = pm.purchase_id
        WHERE p.purchase_id = ?
    ");
    $stmt->bind_param("i", $purchase_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        echo json_encode($result->fetch_assoc());
    } else {
        echo json_encode(['error' => true, 'message' => 'Order not found']);
    }
    $stmt->close();
} else {
    // Existing orders list logic
    $stmt = $connect->prepare("
        SELECT p.purchase_id, p.purchase_date, p.quantity, p.total_amount, 
               pm.payment_status, pm.payment_method
        FROM purchases p
        LEFT JOIN payments pm ON p.purchase_id = pm.purchase_id
        WHERE p.customer_id = ?
    ");
    $stmt->bind_param("i", $_GET['customer_id']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $orders = [];
    while ($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }
    
    echo json_encode($orders);
    $stmt->close();
}
?>