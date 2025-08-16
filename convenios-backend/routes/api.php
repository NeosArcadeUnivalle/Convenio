<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ConvenioController;
use App\Http\Controllers\Api\ConvenioVersionController;

Route::get('versiones/{id}/leer', [ConvenioVersionController::class, 'leerArchivo']);

Route::get('convenios/{id}/versiones', [ConvenioVersionController::class, 'index']);
Route::post('convenios/{id}/versiones', [ConvenioVersionController::class, 'store']);

Route::get('convenios/proximos-vencer', [ConvenioController::class, 'proximosAVencer']);

Route::apiResource('convenios', ConvenioController::class);

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});