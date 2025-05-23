<?php 
 
function addProduct() {
    global $connect;
    
    // Add error reporting for debugging
    error_log("addProduct function called");
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Log the received data for debugging
    error_log("Received data: " . print_r($data, true));
    
    if($data) {
        $name = isset($data['name']) ? trim($data['name']) : '';
        $category = isset($data['category']) ? trim($data['category']) : '';
        $price = isset($data['price']) ? $data['price'] : 0;
        $description = isset($data['description']) ? trim($data['description']) : '';
        $stock = isset($data['stock']) ? $data['stock'] : 0;
        
        // Validate required fields
        if(empty($name)) {
            echo json_encode(['type' => 'error', 'message' => 'Product name is required']);
            return;
        }
        
        if($price <= 0) {
            echo json_encode(['type' => 'error', 'message' => 'Price must be greater than 0']);
            return;
        }
        
        if(empty($category)) {
            echo json_encode(['type' => 'error', 'message' => 'Category is required']);
            return;
        }
        
        if($stock < 0) {
            echo json_encode(['type' => 'error', 'message' => 'Stock cannot be negative']);
            return;
        }
        
        // Prepare the SQL statement - removed product_code since it's auto-generated
        // Note: Using 'stocks' (plural) to match your database table
        $stmt = $connect->prepare("INSERT INTO products (name, category, price, description, stocks) VALUES (?, ?, ?, ?, ?)");
        
        if (!$stmt) {
            echo json_encode(['type' => 'error', 'message' => 'Prepare failed: ' . $connect->error]);
            return;
        }
        
        // Bind parameters - price as 'd' for decimal/double, stocks as 'i' for integer
        $stmt->bind_param("ssdsi", $name, $category, $price, $description, $stock);
        
        if($stmt->execute()) {
            $id = $connect->insert_id;
            
            // Get the auto-generated product_code
            $get_product_stmt = $connect->prepare("SELECT product_code FROM products WHERE id = ?");
            $get_product_stmt->bind_param("i", $id);
            $get_product_stmt->execute();
            $result = $get_product_stmt->get_result();
            $product_data = $result->fetch_assoc();
            $product_code = $product_data['product_code'];
            $get_product_stmt->close();
            
            echo json_encode([
                'type' => 'success', 
                'message' => 'Product created successfully',
                'id' => $id,
                'product' => [
                    'id' => $id,
                    'product_code' => $product_code, // Auto-generated code
                    'name' => $name,
                    'category' => $category,
                    'price' => $price,
                    'description' => $description,
                    'stock' => $stock
                ]
            ]);
        } else {
            echo json_encode(['type' => 'error', 'message' => 'Failed to create product: ' . $stmt->error]);
        }

        $stmt->close();
    } else {
        // Check if there was a JSON decode error
        $json_error = json_last_error();
        if ($json_error !== JSON_ERROR_NONE) {
            echo json_encode(['type' => 'error', 'message' => 'Invalid JSON: ' . json_last_error_msg()]);
        } else {
            echo json_encode(['type' => 'error', 'message' => 'No data received']);
        }
    }
}