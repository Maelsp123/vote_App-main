<?php
$host = 'postgres';
$db = 'votes';
$user = 'user';
$pass = 'password';
$dsn = "pgsql:host=$host;dbname=$db";
$pdo = new PDO($dsn, $user, $pass);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application de Vote</title>
    <!-- Bootstrap CSS -->
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <link href="style.css" rel="stylesheet">
</head>
<body>
    <div class="container card-container mt-5">
        <form action="vote.php" method="POST">
            <div class="row justify-content-center">
                <div class="col-md-4">
                    <div class="card text-center">
                        <div class="card-body">
                            <div class="icon mb-3">
                                <img src="polygamy_icon.png" alt="Polygamie" class="img-fluid" style="max-width: 100px;">
                            </div>
                            <h5 class="card-title">Polygamie</h5>
                            <input type="radio" name="vote" value="polygamie" required>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card text-center">
                        <div class="card-body">
                            <div class="icon mb-3">
                                <img src="monogamy_icon.png" alt="Monogamie" class="img-fluid" style="max-width: 100px;">
                            </div>
                            <h5 class="card-title">Monogamie</h5>
                            <input type="radio" name="vote" value="monogamie" required>
                        </div>
                    </div>
                </div>
            </div>
            <div class="text-center mt-4">
                <button type="submit" class="btn btn-primary btn-lg btn-vote">Votez</button>
            </div>
        </form>
        <?php
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $vote = $_POST['vote'];
            $stmt = $pdo->prepare('INSERT INTO votes (choice) VALUES (:choice)');
            $stmt->execute(['choice' => $vote]);
            echo '<div class="alert alert-success mt-4" role="alert">Merci pour votre vote !<a href="http://localhost:3001/" target="blank">Voir les Résultats --></a></div>';
        }
        ?>
    </div>

    <!-- Bootstrap JS and dependencies -->
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.4/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
