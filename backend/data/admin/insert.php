<?php
    function insert() {
        global $connect;
        $res = ['error' => false];
        $data = json_decode(file_get_contents("php://input"), true);
        
        // Check if the required fields are present
        if (isset($data['username']) && isset($data['password'])) {
            $username = mysqli_real_escape_string($connect, $data['username']);
            $password = mysqli_real_escape_string($connect, $data['password']);
            
            // Hash the password
            $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
            
            // Insert the data into the database
            $query = "INSERT INTO users (username, password) VALUES ('$username', '$hashedPassword')";
            if (mysqli_query($connect, $query)) {
                $res['message'] = 'User registered successfully';
            } else {
                $res['error'] = true;
                $res['message'] = 'Error: ' . mysqli_error($connect);
            }
        } else {
            $res['error'] = true;
            $res['message'] = 'Username and password are required';
        }
        
        echo json_encode($res);
    }