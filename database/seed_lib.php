<?php
// Demo catalogue seeding (used on first run and by `php database/manage.php seed`).
// The data lives in seed_data.json - the same sample products the site used
// to hard-code (Fresh Maize, Farm Tomatoes, Bananas, ...), now real DB rows
// owned by a demo seller account.

const DEMO_SELLER_EMAIL = 'demo.farm@farmlink.local';

function seed_demo_data(PDO $pdo): array {
    $data = json_decode(file_get_contents(__DIR__ . '/seed_data.json'), true);
    $now = gmdate('Y-m-d H:i:s');

    $s = $pdo->prepare('SELECT id FROM users WHERE email=?');
    $s->execute([DEMO_SELLER_EMAIL]);
    $sellerId = $s->fetchColumn();
    if (!$sellerId) {
        // Random password: this demo account is not meant to be logged into.
        $pdo->prepare("INSERT INTO users(full_name,email,phone,password_hash,role,verification_status,email_verified) VALUES(?,?,?,?,?,?,1)")
            ->execute(['FarmLink Demo Farm', DEMO_SELLER_EMAIL, '0000000000', password_hash(bin2hex(random_bytes(16)), PASSWORD_DEFAULT), 'seller', 'approved']);
        $sellerId = (int)$pdo->lastInsertId();
    }
    $sellerId = (int)$sellerId;

    // Re-running replaces only the demo seller's rows (and only if no order uses them).
    $pdo->prepare('DELETE FROM products WHERE seller_id=? AND id NOT IN (SELECT product_id FROM order_items)')->execute([$sellerId]);
    $pdo->prepare('DELETE FROM livestock_listings WHERE seller_id=?')->execute([$sellerId]);

    $desc = 'Market-aligned FarmLink starting price. Sold by the FarmLink Demo Farm.';
    $ins = $pdo->prepare('INSERT INTO products(seller_id,name,description,price,sale_price,stock,image_url,category,unit,location,badge,demo_key,is_service,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
    foreach ($data['products'] as $p) {
        $ins->execute([$sellerId, $p['name'], $desc, $p['price'], $p['sale_price'], $p['stock'], $p['image_url'], $p['category'],
            $p['unit'], $p['location'], $p['badge'], $p['demo_key'], $p['is_service'] ? 1 : 0, $p['stock'] > 0 ? 'active' : 'sold_out', $now, $now]);
    }
    $lv = $pdo->prepare('INSERT INTO livestock_listings(seller_id,species,breed,listing_title,quantity,price,price_type,weight_kg,age_months,location,description,image_url,status) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)');
    foreach ($data['livestock'] as $a) {
        $lv->execute([$sellerId, $a['species'], $a['breed'], $a['listing_title'], $a['quantity'], $a['price'], $a['price_type'],
            $a['weight_kg'], $a['age_months'], $a['location'], 'Demo listing. Health records and transport are confirmed by the seller.', 'imgs/animals/' . $a['species'] . '.svg', 'active']);
    }
    return ['products' => count($data['products']), 'livestock' => count($data['livestock'])];
}
