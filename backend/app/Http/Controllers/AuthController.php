<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Credenciales incorrectas'], 401);
        }

        return response()->json(['user' => Auth::user()]);
    }

    public function logout()
    {
        Auth::logout();
        return response()->json(['message' => 'Sesión cerrada']);
    }

    public function me()
    {
        return response()->json(['user' => Auth::user()]);
    }
}