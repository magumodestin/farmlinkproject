<?php
// Command-line helper:  php database/manage.php <command>
//   init                 create the database/tables (SQLite: automatic anyway)
//   seed                 (re)load the demo products + livestock
//   approve <email>      approve a seller/driver (only needed if REQUIRE_SELLER_APPROVAL=1)
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/seed_lib.php';
$cmd = $argv[1] ?? '';
$pdo = db();
switch ($cmd) {
    case 'init': echo "Database ready (" . db_driver() . ").\n"; break;
    case 'seed': $r = seed_demo_data($pdo); echo "Seeded {$r['products']} products and {$r['livestock']} livestock listings.\n"; break;
    case 'approve':
        $email = strtolower(trim($argv[2] ?? ''));
        $s = $pdo->prepare("UPDATE users SET verification_status='approved' WHERE email=? AND role IN ('seller','driver')");
        $s->execute([$email]);
        echo $s->rowCount() ? "Approved $email\n" : "No seller/driver found with that email.\n";
        break;
    default: echo "Usage: php database/manage.php init|seed|approve <email>\n";
}
