<?php
namespace App\Controller;

use App\Service\jwtService;
use Doctrine\DBAL\Connection;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class mybooksController {
    #[Route('/api/dashboard/mybooks', methods:['GET'])]
    public function mybooks(Request $request, jwtService $jwt, Connection $conn) : JsonResponse {
        try {
            $payload = $jwt->getPayloadFromRequest($request);
        } catch (\RuntimeException $e) {
            return new JsonResponse(['error' => 'Invalid or expired token'], 401);
        }
        
        $userid = $payload['sub'];

        $mybooks = $conn->fetchAllAssociative(
            'SELECT *
            FROM loans l
            INNER JOIN books b ON b.book_id = l.book_id
            WHERE l.user_id = :userid',
            ['userid' => $userid]
        );

        return new JsonResponse([
            'mybooks' => $mybooks
        ], 200);
    }
    #[Route('/api/dashboard/mybooks/unborrow', methods: ['POST'])]
    public function unborrow(Request $request, jwtService $jwt, Connection $conn): JsonResponse
    {
        try {
            $payload = $jwt->getPayloadFromRequest($request);
        } catch (\RuntimeException $e) {
            return new JsonResponse(['error' => 'Invalid or expired token'], 401);
        }

        $userid = (int) $payload['sub'];

        $data = json_decode($request->getContent(), true);
        if (!is_array($data) || !isset($data['book_id'])) {
            return new JsonResponse(['error' => 'Missing book_id'], 400);
        }

        $bookid = (int) $data['book_id'];

        $deletedRows = $conn->executeStatement(
            'DELETE FROM loans WHERE user_id = :uid AND book_id = :bid',
            ['uid' => $userid, 'bid' => $bookid]
        );

        if ($deletedRows === 0) {
            return new JsonResponse(['error' => 'Loan not found'], 404);
        }

        return new JsonResponse(['success' => true], 200);
    }
}