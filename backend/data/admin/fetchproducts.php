<?php
function fetchProducts() {
    global $connect;

    $stmt = $connect->prepare("SELECT * FROM products");
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();

    $data = [];
    while($users = $result->fetch_assoc()) {
        $data[] = $users;
    }
    echo json_encode($data);
}
?>