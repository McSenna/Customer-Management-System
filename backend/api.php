<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

include_once './config/database.php';
include_once './header/header.php';

header('Content-Type: application/json');

$res = ['error' => false];
$action = isset($_GET['action']) ? $_GET['action'] : '';

try {
    switch($action) {
        case 'insert':
            if (file_exists('./data/insert.php')) {
                include './data/insert.php';
                insert();
            } else {
                throw new Exception('Insert file not found');
            }
            break;
                
        case 'fetch':
            if (file_exists('./data/admin/fetch.php')) {
                include './data/admin/fetch.php';
                fetchCustomer();
            } else {
                throw new Exception('Fetch file not found');
            }
            break;
                
        case 'fetchproducts':
            if (file_exists('./data/admin/fetchproducts.php')) {
                include './data/admin/fetchproducts.php';
                fetchProducts();
            } else {
                throw new Exception('Fetchproducts file not found');
            }
            break;

        case 'login':
            if (file_exists('./data/public/login.php')) {
                include './data/public/login.php';
                Login();
            } else {
                throw new Exception('Login file not found');
            }
            break;

        case 'add':
            if (file_exists('./data/public/addcustomer.php')) {
                include './data/public/addcustomer.php';
                addCustomer();
            } else {
                throw new Exception('Add customer file not found');
            }
            break;

        case 'addproducts':
            if (file_exists('./data/admin/addproducts.php')) {
                include './data/admin/addproducts.php';
                addProduct();
            } else {
                throw new Exception('Add products file not found');
            }
            break;
            
        default:
            $res = [
                'error' => true,
                'message' => 'Invalid action: ' . $action
            ];
            echo json_encode($res);
            break;
    }
} catch (Exception $e) {
    $res = [
        'error' => true,
        'message' => 'Server error: ' . $e->getMessage()
    ];
    echo json_encode($res);
}
?>