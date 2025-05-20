<?php
function fetchCustomer() {
    global $connect;

    $stmt = $connect->prepare("SELECT * FROM customers");
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