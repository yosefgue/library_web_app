<?php

namespace App\Controller;

use App\Service\jwtService;
use Doctrine\DBAL\Connection;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class premiumController
{
    #[Route('/api/dashboard/premium/upgrade', methods: ['POST'])]
    public function upgrade(
        Request $request,
        jwtService $jwt,
        Connection $conn
    ): JsonResponse {
        try {
            $payload = $jwt->getPayloadFromRequest($request);
        } catch (\RuntimeException $e) {
            return new JsonResponse(['error' => 'Invalid or expired token'], 401);
        }

        $userId = (int) $payload['sub'];

        $conn->executeStatement(
            'UPDATE users SET is_premium = true WHERE user_id = :id',
            ['id' => $userId]
        );

        $user = $conn->fetchAssociative(
            'SELECT user_id, email, username, is_premium, is_admin
             FROM users
             WHERE user_id = :id',
            ['id' => $userId]
        );

        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], 404);
        }

        $newToken = $jwt->createToken(
            $user['user_id'],
            $user['email'],
            $user['username'],
            $user['is_premium'],
            $user['is_admin']
        );

        return new JsonResponse([
            'success' => true,
            'token' => $newToken
        ], 200);
    }

    #[Route('/api/dashboard/premium/remove', methods: ['POST'])]
    public function remove(
        Request $request,
        jwtService $jwt,
        Connection $conn
    ): JsonResponse {
        try {
            $payload = $jwt->getPayloadFromRequest($request);
        } catch (\RuntimeException $e) {
            return new JsonResponse(['error' => 'Invalid or expired token'], 401);
        }

        $userId = (int) $payload['sub'];

        $conn->executeStatement(
            'UPDATE users SET is_premium = false WHERE user_id = :id',
            ['id' => $userId]
        );

        $user = $conn->fetchAssociative(
            'SELECT user_id, email, username, is_premium, is_admin
             FROM users
             WHERE user_id = :id',
            ['id' => $userId]
        );

        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], 404);
        }

        $newToken = $jwt->createToken(
            $user['user_id'],
            $user['email'],
            $user['username'],
            $user['is_premium'],
            $user['is_admin']
        );

        return new JsonResponse([
            'success' => true,
            'token' => $newToken
        ], 200);
    }
}
