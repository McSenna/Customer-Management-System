<?php 
function addProduct() {
    global $connect;
    
    // Add error reporting for debugging
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    
    // Check if this is a JSON request or form-data (for file upload)
    if ($_SERVER['CONTENT_TYPE'] === 'application/json') {
        $data = json_decode(file_get_contents('php://input'), true);
    } else {
        $data = $_POST;
    }
    
    // Log the received data for debugging
    error_log("Received data: " . print_r($data, true));
    
    if($data) {
        $name = isset($data['name']) ? trim($data['name']) : '';
        $category = isset($data['category']) ? trim($data['category']) : '';
        $price = isset($data['price']) ? floatval($data['price']) : 0;
        $description = isset($data['description']) ? trim($data['description']) : '';
        $stock = isset($data['stock']) ? intval($data['stock']) : 0;
        $product_image = null;
        
        // Handle file upload if present
        if (!empty($_FILES['product_image']['name'])) {
            $uploadDir = 'uploads/products/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            
            $fileExtension = pathinfo($_FILES['product_image']['name'], PATHINFO_EXTENSION);
            $fileName = uniqid() . '.' . $fileExtension;
            $targetPath = $uploadDir . $fileName;
            
            // Validate file type and size
            $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
            $maxSize = 2 * 1024 * 1024; // 2MB
            
            if (!in_array(strtolower($fileExtension), $allowedTypes)) {
                echo json_encode(['type' => 'error', 'message' => 'Invalid file type. Only JPG, JPEG, PNG, GIF are allowed.']);
                return;
            }
            
            if ($_FILES['product_image']['size'] > $maxSize) {
                echo json_encode(['type' => 'error', 'message' => 'File size exceeds 2MB limit.']);
                return;
            }
            
            if (move_uploaded_file($_FILES['product_image']['tmp_name'], $targetPath)) {
                $product_image = $targetPath;
            } else {
                echo json_encode(['type' => 'error', 'message' => 'Failed to upload image.']);
                return;
            }
        }
        
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
        
        // Prepare the SQL statement
        $stmt = $connect->prepare("INSERT INTO products (name, category, price, description, stocks, product_image) VALUES (?, ?, ?, ?, ?, ?)");
        
        if (!$stmt) {
            echo json_encode(['type' => 'error', 'message' => 'Prepare failed: ' . $connect->error]);
            return;
        }
        
        // Bind parameters
        $stmt->bind_param("ssdssi", $name, $category, $price, $description, $product_image, $stock);
        
        if($stmt->execute()) {
            $id = $connect->insert_id;
            
            // Get the complete product data including auto-generated product_code
            $get_product_stmt = $connect->prepare("SELECT * FROM products WHERE id = ?");
            $get_product_stmt->bind_param("i", $id);
            $get_product_stmt->execute();
            $result = $get_product_stmt->get_result();
            $product_data = $result->fetch_assoc();
            $get_product_stmt->close();
            
            echo json_encode([
                'type' => 'success', 
                'message' => 'Product created successfully',
                'product' => $product_data
            ]);
        } else {
            echo json_encode(['type' => 'error', 'message' => 'Failed to create product: ' . $stmt->error]);
        }

        $stmt->close();
    } else {
        $json_error = json_last_error();
        if ($json_error !== JSON_ERROR_NONE) {
            echo json_encode(['type' => 'error', 'message' => 'Invalid JSON: ' . json_last_error_msg()]);
        } else {
            echo json_encode(['type' => 'error', 'message' => 'No data received']);
        }
    }
}