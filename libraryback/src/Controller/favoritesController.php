<?php
namespace App\Controller;

use App\Service\jwtService;
use Doctrine\DBAL\Connection;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class favoritesController {
    #[Route('/api/dashboard/favorites', methods:['GET'])]
    public function favorites(Request $request, jwtService $jwt, Connection $conn) : JsonResponse {
        try {
            $payload = $jwt->getPayloadFromRequest($request);
        } catch (\RuntimeException $e) {
            return new JsonResponse(['error' => 'Invalid or expired token'], 401);
        }
        
        $userid = $payload['sub'];

        $mybooks = $conn->fetchAllAssociative(
            'SELECT *
            FROM favorites f
            INNER JOIN books b ON b.book_id = f.book_id
            WHERE f.user_id = :userid',
            ['userid' => $userid]
        );

        return new JsonResponse([
            'favorites' => $mybooks
        ], 200);
    }
    #[Route('/api/dashboard/favorites/add', methods: ['POST'])]
    public function addFavorite(Request $request, jwtService $jwt, Connection $conn): JsonResponse
    {
        try {
            $payload = $jwt->getPayloadFromRequest($request);
        } catch (\RuntimeException $e) {
            return new JsonResponse(['error' => 'Invalid or expired token'], 401);
        }

        $userid = $payload['sub'];
        $data = json_decode($request->getContent(), true);

        $conn->executeStatement(
            'INSERT INTO favorites (user_id, book_id) VALUES (:uid, :bid)',
            [
                'uid' => $userid,
                'bid' => $data['book_id'],
            ]
        );

        return new JsonResponse(['success' => true], 201);
    }
    #[Route('/api/dashboard/favorites/remove', methods: ['POST'])]
    public function removeFavorite(Request $request, jwtService $jwt, Connection $conn): JsonResponse
    {
        try {
            $payload = $jwt->getPayloadFromRequest($request);
        } catch (\RuntimeException $e) {
            return new JsonResponse(['error' => 'Invalid or expired token'], 401);
        }

        $userid = $payload['sub'];
        $data = json_decode($request->getContent(), true);

        $conn->executeStatement(
            'DELETE FROM favorites WHERE user_id = :uid AND book_id = :bid',
            [
                'uid' => $userid,
                'bid' => $data['book_id'],
            ]
        );

        return new JsonResponse(['success' => true], 200);
    }

}