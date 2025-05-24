<?php
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

    case 'fetchproducts':
        include './data/admin/fetchproducts.php';
            fetchProducts();
            break;

    case 'login':
        include './data/public/login.php';
            Login();
            break;

    case 'add':
        include './data/public/addcustomer.php';
            addCustomer();
            break;

    case 'addproducts':
        include './data/admin/addproducts.php';
            addProduct();
            break;
    
    case 'get_customer':
        include './data/public/get_customer.php';
        get_customer();
        break;

    case 'add_to_cart':
            include './data/cart/add_to_cart.php';
            addToCart();
            break;

        case 'get_cart':
            include './data/cart/get_cart.php';
            getCart();
            break;

        case 'update_cart_quantity':
            include './data/cart/update_cart_quantity.php';
            updateCartQuantity();
            break;

        case 'remove_from_cart':
            include './data/cart/remove_from_cart.php';
            removeFromCart();
            break;

        case 'create_order':
            include './data/orders/create_order.php';
            createOrder();
            break;



    default:
        $res = [
            'error' => true,
            'message' => 'Invalid action'
        ];
        echo json_encode($res);
        break;
    }