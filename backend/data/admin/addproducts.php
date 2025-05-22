<?php 
 
function addProduct() {
    global $connect;
    $data = json_decode(file_get_contents('php://input'), true);
    
    if($data) {
        $product_code = isset($data['product_code']) ? $data['product_code'] : '';
        $name = isset($data['name']) ? $data['name'] : '';
        $category = isset($data['category']) ? $data['category'] : '';
        $price = isset($data['price']) ? $data['price'] : '';
        $description = isset($data['description']) ? $data['description'] : '';
        $stock = isset($data['stock']) ? $data['stock'] : '';
        
        if($name && $price !== '') {
            $stmt = $connect->prepare("INSERT INTO products (product_code, name, category, price, description, stock) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("sssdsi", $product_code, $name, $category, $price, $description, $stock);
            
            if($stmt->execute()) {
                $id = $connect->insert_id;
                
                echo json_encode([
                    'type' => 'success', 
                    'message' => 'Product created successfully',
                    'id' => $id
                ]);
            } else {
                echo json_encode(['type' => 'error', 'message' => 'Failed to create product: ' . $stmt->error]);
            }
    
            $stmt->close();
        } else {
            echo json_encode(['type' => 'error', 'message' => 'Name and price are required']);
        }
    } else {
        echo json_encode(['type' => 'error', 'message' => 'Invalid JSON']);
    }
}