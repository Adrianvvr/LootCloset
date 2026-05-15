<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    // 1. REGISTRO DE USUARIO
    public function register(Request $request)
    {
        // Validamos que nos envíen los datos correctamente
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        // Creamos el usuario en la BD (la contraseña se encripta con Hash)
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Generamos su "llave" de acceso (Token)
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => '¡Usuario creado con éxito!',
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    // 2. LOGIN DE USUARIO
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Buscamos al usuario por su email
        $user = User::where('email', $request->email)->first();

        // Comprobamos si existe y si la contraseña coincide
        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Credenciales incorrectas. Revisa tu email o contraseña.'
            ], 401);
        }

        // Generamos un nuevo token de sesión
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => '¡Login exitoso!',
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    // 3. LOGOUT (Cerrar sesión)
    public function logout(Request $request)
    {
        // Borramos todos los tokens del usuario actual (cierra todas sus sesiones)
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Sesión cerrada correctamente'
        ]);
    }

    // 4. VER PERFIL (Ruta de prueba protegida)
    public function profile(Request $request)
    {
        // Devuelve los datos del usuario que está haciendo la petición
        return response()->json($request->user());
    }

    // 5. ACTUALIZAR PERFIL / CONTRASEÑA
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'current_password' => 'nullable|required_with:new_password',
            'new_password' => 'nullable|min:8|confirmed',
        ]);

        // Si intenta cambiar la contraseña, verificamos la actual
        if ($request->new_password) {
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'message' => 'La contraseña actual no es correcta.'
                ], 422);
            }
            $user->password = Hash::make($request->new_password);
        }

        $user->name = $request->name;
        $user->save();

        return response()->json([
            'message' => 'Perfil actualizado correctamente.',
            'user' => $user
        ]);
    }
}