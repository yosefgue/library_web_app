<?php
namespace App\Service;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Symfony\Component\HttpFoundation\Request;

class jwtService {
    public function createToken($userid, $email, $username, $is_premium, $is_admin) {
        
        $secret = $_ENV['JWT_SECRET'];
        $ttl = (int) $_ENV['JWT_TTL'];
        $now = time();

        $payload = [
            'sub' => $userid,
            'email' => $email,
            'username' => $username,
            'is_premium' => $is_premium,
            'is_admin' => $is_admin,
            'iat' => $now,
            'exp' => $now + $ttl,
        ];
        return JWT::encode($payload, $secret, 'HS256');
    }

    public function verifyToken($token): array {
        $secret = $_ENV['JWT_SECRET'];
        $decoded = JWT::decode($token, new Key($secret, 'HS256'));
        return (array) $decoded;
    }
    
    public function getPayloadFromRequest(Request $request): array
    {
        $authHeader = $request->headers->get('Authorization');

        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            throw new \RuntimeException('missing token');
        }

        $token = substr($authHeader, 7);

        return $this->verifyToken($token);
    }

}