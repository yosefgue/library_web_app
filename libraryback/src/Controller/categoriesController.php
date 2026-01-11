<?php
namespace App\Controller;

use App\Service\jwtService;
use Doctrine\DBAL\Connection;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class categoriesController
{
    #[Route('/api/dashboard/categories', methods: ['GET'])]
    public function categories(Request $request, jwtService $jwt, Connection $conn): JsonResponse
    {
        try {
            $jwt->getPayloadFromRequest($request);
        } catch (\RuntimeException $e) {
            return new JsonResponse(['error' => 'Invalid or expired token'], 401);
        }

        $genres = [
            'technology',
            'self_help',
            'fantasy',
            'fiction',
            'science_fiction',
            'mystery',
            'history',
            'children',
            'science',
        ];

        $categories = [];

        foreach ($genres as $genre) {
            $books = $conn->fetchAllAssociative(
                'SELECT *
                 FROM books
                 WHERE genre = :genre
                 ORDER BY RANDOM()
                 LIMIT 20;',
                ['genre' => $genre]
            );

            $categories[$genre] = $books;
        }

        return new JsonResponse([
            'categories' => $categories
        ], 200);
    }
}
