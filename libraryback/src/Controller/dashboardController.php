<?php
namespace App\Controller;

use App\Service\jwtService;
use Doctrine\DBAL\Connection;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class dashboardController {
    #[Route('/api/dashboard', methods:['GET'])]
    public function dashboard(Request $request, jwtService $jwt) : JsonResponse {
        try {
            $payload = $jwt->getPayloadFromRequest($request);
        } catch (\RuntimeException $e) {
            return new JsonResponse(['error' => 'Invalid or expired token'], 401);
        }

        return new JsonResponse([
            'user' => [
                'id' => $payload['sub'],
                'email' => $payload['email'],
                'username' => $payload['username'],
                'is_premium' => (bool) $payload['is_premium'],
                'is_admin' => (bool) $payload['is_admin'],
            ]
        ], 200);
    }
    #[Route('/api/dashboard/home', methods:['GET'])]
    public function dashboardHome(Request $request, jwtService $jwt, Connection $conn) : JsonResponse {
        try {
            $payload = $jwt->getPayloadFromRequest($request);
        } catch (\RuntimeException $e) {
            return new JsonResponse(['error' => 'Invalid or expired token'], 401);
        }
         $popularbooks = $conn->fetchAllAssociative(
            'SELECT *
            FROM books
            ORDER BY RANDOM()
            LIMIT 5;'
        );
        $recommendedbooks = $conn->fetchAllAssociative(
            'SELECT *
            FROM books
            ORDER BY RANDOM()
            LIMIT 5;'
        );
        
        return new JsonResponse([
            'popularbooks' => $popularbooks,
            'recommendedbooks' => $recommendedbooks
        ], 200);
    }
    #[Route('/api/dashboard/borrow', methods: ['POST'])]
    public function borrow(Request $request, jwtService $jwt, Connection $conn): JsonResponse
    {
        try {
            $payload = $jwt->getPayloadFromRequest($request);
        } catch (\RuntimeException $e) {
            return new JsonResponse(['error' => 'Invalid or expired token'], 401);
        }

        $userid = $payload['sub'];
        $maxborrow = $payload['is_premium'] ? 10 : 2;

        $borrowcount = $conn->fetchOne(
            'SELECT COUNT(*) FROM loans WHERE user_id = :userid',
            ['userid' => $userid]
        );

        if ($borrowcount >= $maxborrow) {
            return new JsonResponse([
                'error' => 'Borrow limit reached. Upgrade to premium.'
            ], 403);
        }

        $data = json_decode($request->getContent(), true);
        if (!is_array($data) || !isset($data['book_id'])) {
            return new JsonResponse(['error' => 'Missing book_id'], 400);
        }

        $bookid = $data['book_id'];

        $book = $conn->fetchAssociative(
            'SELECT is_premium FROM books WHERE book_id = :bookid',
            ['bookid' => $bookid]
        );
        if (!$book) {
            return new JsonResponse(['error' => 'Book not found'], 404);
        }

        $bookIsPremium = (bool) $book['is_premium'];
        if ($bookIsPremium && !$payload['is_premium']) {
            return new JsonResponse([
                'error' => 'Premium book. Upgrade to premium to borrow.'
            ], 403);
        }

        $alreadyBorrowed = $conn->fetchOne(
            'SELECT 1 FROM loans WHERE user_id = :userid AND book_id = :bookid',
            ['userid' => $userid, 'bookid' => $bookid]
        );
        if ($alreadyBorrowed) {
            return new JsonResponse(['error' => 'Already borrowed'], 409);
        }

        $conn->insert('loans', [
            'user_id' => $userid,
            'book_id' => $bookid,
            'borrowed_at' => (new \DateTimeImmutable())->format('Y-m-d H:i:s'),
        ]);

        return new JsonResponse(['success' => true], 201);
    }
}