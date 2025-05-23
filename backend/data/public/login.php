<?php
function Login() {
    global $connect;

    header('Content-Type: application/json');

    $data = json_decode(file_get_contents('php://input'), true);

    if($data) {
        $email = $data['email'];
        $password = $data['password'];
        
        if($email && $password) {
            // Added address to the SELECT statement
            $stmt = $connect->prepare("SELECT id, password_hash, name, customer_code, address FROM customers WHERE email = ?");
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if($result->num_rows > 0) {
                $customer = $result->fetch_assoc();
                
                if(password_verify($password, $customer['password_hash'])) {
                    session_start();
                    $_SESSION['customer_id'] = $customer['id'];
                    $_SESSION['customer_name'] = $customer['name'];
                    $_SESSION['customer_code'] = $customer['customer_code'];
                    $_SESSION['address'] = $customer['address'];
                    
                    // Don't include password hash in response
                    unset($customer['password_hash']);
                    
                    echo json_encode([
                        'type' => 'success', 
                        'message' => 'Login successful',
                        'customer' => $customer
                    ]);
                } else {
                    echo json_encode(['type' => 'error', 'message' => 'Invalid password']);
                }
            } else {
                echo json_encode(['type' => 'error', 'message' => 'No account found with this email']);
            }
            $stmt->close();
        } else {
            echo json_encode(['type' => 'error', 'message' => 'Email and password are required']);
        }
    } else {
        echo json_encode(['type' => 'error', 'message' => 'Invalid request']);
    }
}