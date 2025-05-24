<?php
include_once './config/database.php';
header('Content-Type: application/json');

$response = ['error' => false];

try {
    // Get customer ID from query parameter
    $customer_id = isset($_GET['customer_id']) ? intval($_GET['customer_id']) : 0;

    if ($customer_id <= 0) {
        $response['error'] = true;
        $response['message'] = 'Invalid customer ID';
        echo json_encode($response);
        exit;
    }

    // Initialize database connection
    $db = $database->getConnection();

    // Fetch customer data
    $query = "SELECT id, customer_code, name, email, phone, address, created_at 
              FROM customers 
              WHERE id = :customer_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':customer_id', $customer_id, PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() == 0) {
        $response['error'] = true;
        $response['message'] = 'Customer not found';
        echo json_encode($response);
        exit;
    }

    $customer = $stmt->fetch(PDO::FETCH_ASSOC);

    // Fetch loyalty points
    $query = "SELECT points_earned 
              FROM loyaltypoints 
              WHERE customer_id = :customer_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':customer_id', $customer_id, PDO::PARAM_INT);
    $stmt->execute();
    $loyalty = $stmt->fetch(PDO::FETCH_ASSOC);

    // Determine subscription status (example logic: active if points > 0)
    $subscription_status = ($loyalty && $loyalty['points_earned'] > 0) ? 'Active' : 'Inactive';

    // Prepare response
    $response['id'] = $customer['id'];
    $response['customer_code'] = $customer['customer_code'];
    $response['name'] = $customer['name'];
    $response['email'] = $customer['email'];
    $response['phone'] = $customer['phone'];
    $response['address'] = $customer['address'] ?: 'No address available';
    $response['created_at'] = $customer['created_at'];
    $response['subscription_status'] = $subscription_status;
    $response['loyalty_points'] = $loyalty ? (int)$loyalty['points_earned'] : 0;

    echo json_encode($response);

} catch (PDOException $e) {
    $response['error'] = true;
    $response['message'] = 'Database error: ' . $e->getMessage();
    echo json_encode($response);
} catch (Exception $e) {
    $response['error'] = true;
    $response['message'] = 'Error: ' . $e->getMessage();
    echo json_encode($response);
}
?>