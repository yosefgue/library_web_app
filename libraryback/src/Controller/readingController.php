<?php

namespace App\Controller;

use App\Service\jwtService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\Routing\Attribute\Route;

class readingController extends AbstractController
{
    #[Route('/api/dashboard/read/pdf', name: 'dashboard_read_pdf', methods: ['GET'])]
    public function readPdf(Request $request, jwtService $jwt): BinaryFileResponse
    {
        try {
            $jwt->getPayloadFromRequest($request);
        } catch (\RuntimeException $e) {
            throw $this->createAccessDeniedException('Invalid or expired token');
        }

        $pdfPath = $this->getParameter('kernel.project_dir') . '/public/storage/books/csharp.pdf';

        $response = new BinaryFileResponse($pdfPath);
        $response->setContentDisposition(ResponseHeaderBag::DISPOSITION_INLINE, 'csharp.pdf');
        $response->headers->set('Content-Type', 'application/pdf');

        return $response;
    }
}
