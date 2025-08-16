<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Models\Convenio;

class ConvenioController extends Controller
{
    // Lista todos los convenios
    public function index(Request $request)
    {
        $query = Convenio::query();

        if ($request->has('estado') && $request->estado != '') {
            $query->where('estado', $request->estado);
        }

        if ($request->has('riesgo') && $request->riesgo != '') {
            $query->where('riesgo', $request->riesgo);
        }

        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('titulo', 'like', "%$search%")
                ->orWhere('entidad_firmante', 'like', "%$search%");
            });
        }

        // 👇 esto es clave
        return $query->paginate(10);
    }
    // Guarda un nuevo convenio
    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'entidad_firmante' => 'required|string|max:255',
            'fecha_firma' => 'required|date',
            'fecha_vencimiento' => 'nullable|date',
            'estado' => 'required|in:vigente,vencido,en_negociacion',
            'riesgo' => 'nullable|in:alto,medio,bajo',
            'descripcion' => 'nullable|string',
            'archivo' => 'nullable|file|mimes:pdf,doc,docx|max:2048',
        ]);

        if ($request->hasFile('archivo')) {
            $validated['archivo'] = $request->file('archivo')->store('convenios', 'public');
        }

        $convenio = Convenio::create($validated);
        return response()->json($convenio, 201);
    }

    public function proximosAVencer()
    {
        try {
            $hoy = Carbon::today();
            $limite = Carbon::today()->addDays(15);

            $convenios = Convenio::whereNotNull('fecha_vencimiento') // evita NULL
                ->whereBetween('fecha_vencimiento', [$hoy, $limite])
                ->orderBy('fecha_vencimiento', 'asc')
                ->get();

            return response()->json($convenios);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error en proximosAVencer',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    // Muestra un convenio específico
    public function show($id)
    {
        $convenio = Convenio::findOrFail($id);
        return response()->json($convenio);
    }

    // Actualiza un convenio
    public function update(Request $request, $id)
    {
        $convenio = Convenio::findOrFail($id);
        $convenio->update($request->all());
        return response()->json($convenio);
    }

    // Elimina un convenio
    public function destroy($id)
    {
        $convenio = Convenio::findOrFail($id);
        $convenio->delete();
        return response()->json(['message' => 'Convenio eliminado']);
    }
}