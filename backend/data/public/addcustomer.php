<?php 
 
function addCustomer() {
    global $connect;
    $data = json_decode(file_get_contents('php://input'), true);
    
    if($data) {
        $name = isset($data['name']) ? $data['name'] : '';
        $email = isset($data['email']) ? $data['email'] : '';
        $password = isset($data['password']) ? $data['password'] : ''; 
        $phone = isset($data['phone']) ? $data['phone'] : '';
        $address = isset($data['address']) ? $data['address'] : '';
        
        if($name && $email && $password) {
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);              
            
            $stmt = $connect->prepare("INSERT INTO customers (name, email, phone, address, password_hash) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("sssss", $name, $email, $phone, $address, $hashedPassword);
            
            if($stmt->execute()) {
                $id = $connect->insert_id;
                
                echo json_encode([
                    'type' => 'success', 
                    'message' => 'Customer created successfully',
                    'id' => $id
                ]);
            } else {
                echo json_encode(['type' => 'error', 'message' => 'Failed to create customer: ' . $stmt->error]);
            }
    
            $stmt->close();
        } else {
            echo json_encode(['type' => 'error', 'message' => 'Name, email and password are required']);
        }
    } else {
        echo json_encode(['type' => 'error', 'message' => 'Invalid JSON']);
    }
}