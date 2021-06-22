<?php
	$firstName = $_POST['firstName'];
	$lastName = $_POST['lastName'];
	$email = $_POST['email'];
    $number = $_POST['number'];
    $address = $_POST['address'];


	// Database connection
	$conn = new mysqli('localhost','wjamil1','wjamil1','wjamil1');
	if($conn->connect_error){
		echo "$conn->connect_error";
		die("Connection Failed : ". $conn->connect_error);
	} else {
		$stmt = $conn->prepare("insert into invitation(firstName, lastName, email, number, address) values(?, ?, ?, ?, ?)");
		$stmt->bind_param("sssis", $firstName, $lastName, $email, $number, $address);
		$execval = $stmt->execute();
		echo $execval;
		echo "Your information is now store in our database, we will contact you soon";
		$stmt->close();
		$conn->close();
	}
?>