<?php
// Uncomment the register route in api.php
include_once './config/database.php';
include_once './header/header.php';

header('Content-Type: application/json');

$res = ['error' => false];
$action = isset($_GET['action']) ? $_GET['action'] : '';
switch($action) {
    case 'insert':
        include './data/insert.php';
            insert();
            break;
    case 'fetch':
        include './data/admin/fetch.php';
            fetchCustomer();
            break;
        
    default:
        $res = [
            'error' => true,
            'message' => 'Invalid action'
        ];
        echo json_encode($res);
        break;
}