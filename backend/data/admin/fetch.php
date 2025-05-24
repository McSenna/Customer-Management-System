<?php
function fetchCustomer() {
    global $connect;

    // Enable error reporting for debugging
    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    try {
        $stmt = $connect->prepare("SELECT * FROM customers ORDER BY id DESC");
        if (!$stmt) {
            echo json_encode(['error' => true, 'message' => 'Prepare failed: ' . $connect->error]);
            return;
        }

        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();

        $data = [];
        while($customer = $result->fetch_assoc()) {
            // If you have customer profile images, construct the full path here
            if (!empty($customer['profile_image'])) {
                // Check if the path already contains 'uploads/', if not, add it
                if (strpos($customer['profile_image'], 'uploads/') === false) {
                    $customer['profile_image'] = 'uploads/customers/' . $customer['profile_image'];
                }
            }
            
            $data[] = $customer;
        }
        
        // Return the data as JSON
        echo json_encode($data);
        
    } catch (Exception $e) {
        echo json_encode([
            'error' => true, 
            'message' => 'Database error: ' . $e->getMessage()
        ]);
    }
}
?>