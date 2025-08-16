<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ConvenioVersion;
use Illuminate\Support\Facades\Storage;
use Smalot\PdfParser\Parser as PdfParser;
use PhpOffice\PhpWord\IOFactory as WordIOFactory;

class ConvenioVersionController extends Controller
{
    /**
     * 📥 Subir una nueva versión de un convenio
     */
    public function store(Request $request, $convenioId)
    {
        $validated = $request->validate([
            'archivo' => 'required|file|mimes:pdf,doc,docx,txt|max:4096',
            'descripcion' => 'nullable|string',
        ]);

        // Guardar archivo en storage/app/public/convenios/versiones
        $path = $request->file('archivo')->store('convenios/versiones', 'public');

        $version = ConvenioVersion::create([
            'convenio_id' => $convenioId,
            'archivo' => $path,
            'descripcion' => $request->descripcion,
        ]);

        return response()->json($version, 201);
    }

    /**
     * 📋 Listar todas las versiones de un convenio
     */
    public function index($convenioId)
    {
        return ConvenioVersion::where('convenio_id', $convenioId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * 📖 Leer contenido de una versión (TXT, PDF o DOCX)
     */
    public function leerArchivo($id)
    {
        try {
            $version = ConvenioVersion::findOrFail($id);

            if (!$version->archivo || !Storage::disk('public')->exists($version->archivo)) {
                return response()->json(['error' => 'Archivo no encontrado'], 404);
            }

            // Ruta absoluta
            $path = storage_path('app/public/' . $version->archivo);
            $contenido = '';

            // TXT
            if (str_ends_with($version->archivo, '.txt')) {
                $contenido = Storage::disk('public')->get($version->archivo);
            }
            // PDF
            elseif (str_ends_with($version->archivo, '.pdf')) {
                $parser = new PdfParser();
                $pdf = $parser->parseFile($path);
                $contenido = $pdf->getText();
            }
            // DOCX
            elseif (str_ends_with($version->archivo, '.docx')) {
                $phpWord = WordIOFactory::load($path);
                foreach ($phpWord->getSections() as $section) {
                    foreach ($section->getElements() as $element) {
                        /** @var \PhpOffice\PhpWord\Element\Text $element */ // 👈 Esto calma a Intelephense
                        if (method_exists($element, 'getText')) {
                            $contenido .= $element->getText() . " ";
                        }
                    }
                }
            }
            else {
                return response()->json([
                    'error' => 'Formato no soportado. Usa TXT, PDF o DOCX'
                ], 400);
            }

            return response()->json(['contenido' => $contenido]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error interno al leer archivo',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}