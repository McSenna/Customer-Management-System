<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
function fetchProducts() {
    global $connect;

    // Enable error reporting for debugging
    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    try {
        $stmt = $connect->prepare("SELECT * FROM products ORDER BY id DESC");
        if (!$stmt) {
            echo json_encode(['error' => true, 'message' => 'Prepare failed: ' . $connect->error]);
            return;
        }

        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();

        $data = [];
        while($product = $result->fetch_assoc()) {
            // Fix image path construction
            if (!empty($product['product_image'])) {
                // Remove any existing 'uploads/' prefix to avoid duplication
                $imageName = str_replace('uploads/products/', '', $product['product_image']);
                $imageName = str_replace('uploads/', '', $imageName);
                
                // Set the relative path that will work with your frontend
                $product['product_image'] = 'uploads/products/' . $imageName;
            }
            
            // Add default values for rating and reviews if they don't exist in database
            if (!isset($product['rating']) || empty($product['rating'])) {
                $product['rating'] = 4.5; // Default rating
            }
            if (!isset($product['reviews']) || empty($product['reviews'])) {
                $product['reviews'] = rand(15, 120); // Random review count for demo
            }
            
            // Ensure price is properly formatted as number
            $product['price'] = floatval($product['price']);
            
            // Ensure stock is properly formatted as integer
            if (isset($product['stocks'])) {
                $product['stocks'] = intval($product['stocks']);
            }
            if (isset($product['stock'])) {
                $product['stock'] = intval($product['stock']);
            }
            
            $data[] = $product;
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