<?php

namespace App\Controller;

use Doctrine\DBAL\Connection;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use App\Service\jwtService;

class authController {
    
    #[Route('/api/register', methods: ['POST'])]
    public function register(
        Request $request,
        Connection $connection,
    ) : JsonResponse
    {
        $data = $request->toArray();
        if (!$data) {
            return new JsonResponse(['error' => 'no data found JSON'], 400);
        }
        $username = $data['username'] ?? '';
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';

        if ($email === '' || $password === '' || $username === '') {
            return new JsonResponse(['error' => 'Email and password required'], 400);
        }
        $checkemail = $connection->fetchOne(
            'SELECT user_id FROM users WHERE email = :email',
            ['email' => $email]
        );
        $checkusername = $connection->fetchOne(
            'SELECT user_id FROM users WHERE username = :username',
            ['username' => $username]
        );
        
        if ($checkemail || $checkusername) {
            return new JsonResponse(['error' => 'User already exists'], 400);
        }

        $passwordhash = password_hash($password, PASSWORD_DEFAULT);

        $connection->insert('users', [
            'username' => $username,
            'email' => $email,
            'password_hash' => $passwordhash,
        ]);
        
        return new JsonResponse(['message' => 'User registered'], 201);
    }

    #[Route('/api/signin', methods: ['POST'])]
    public function signin(
        Request $request,
        Connection $connection,
        jwtService $jwt,
    ): JsonResponse 
    {
        $data = $request->toArray();
        if (!$data) {
            return new JsonResponse(['error' => 'no data found JSON'], 400);
        }
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';

        if ($email === '' || $password === '') {
            return new JsonResponse(['error' => 'Email and password required'], 400);
        }

        $user = $connection->fetchAssociative(
            'SELECT * FROM users where email = :email',
            ['email' => $email]
        );

        if (!$user || !password_verify($password, $user['password_hash'])) {
            return new JsonResponse(['error' => 'invalid credentials'], 401);
        }
        $token = $jwt->createToken($user['user_id'], $user['email'], $user['username'], $user['is_premium'], $user['is_admin']);

        return new JsonResponse(['token' => $token], 200);
    }
}