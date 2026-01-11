<?php
namespace App\Controller;

use App\Service\jwtService;
use Doctrine\DBAL\Connection;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class searchController
{
    #[Route('/api/dashboard/search', methods:['POST'])]
    public function search(Request $request, jwtService $jwt, Connection $conn): JsonResponse
    {
        try {
            $jwt->getPayloadFromRequest($request);
        } catch (\RuntimeException $e) {
            return new JsonResponse(['error' => 'Invalid or expired token'], 401);
        }

        return $this->doSearch($request, $conn, 200);
    }

    #[Route('/api/search', methods:['POST'])]
    public function visitorSearch(Request $request, Connection $conn): JsonResponse
    {
        return $this->doSearch($request, $conn, 20);
    }

    private function doSearch(Request $request, Connection $conn, int $limit): JsonResponse
    {
        try {
            $data = $request->toArray();
        } catch (\Throwable $e) {
            return new JsonResponse(['error' => 'Invalid JSON'], 400);
        }

        $q = trim($data['query'] ?? '');
        if ($q === '') {
            return new JsonResponse(['error' => 'Missing search query'], 400);
        }

        $query = '%' . $q . '%';

        $results = $conn->fetchAllAssociative(
            'SELECT *
             FROM books
             WHERE title ILIKE :query
                OR author ILIKE :query
                OR description ILIKE :query
                OR genre ILIKE :query
             LIMIT ' . (int) $limit,
            ['query' => $query]
        );

        return new JsonResponse(['results' => $results], 200);
    }
}
