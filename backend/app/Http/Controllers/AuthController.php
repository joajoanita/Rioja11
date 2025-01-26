<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;
use Validator;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{

    // Registrar un nuevo usuario
    public function register(Request $request)
    {
        // Validar los datos de entrada
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|between:4,20',
            'email' => 'required|string|email|max:100|unique:users',
            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/[A-Z]/',     // Uppercase password
                'regex:/[a-z]/',     // Lowercase password
                'regex:/[0-9]/',     // Number password
                'regex:/[@$!%*?&#]/' // Alphanumeric password
            ],
        ]);

        // Si la validación falla, retornar el error
        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson(), 400);
        }

        // Crear un nuevo usuario
        try {
            $imageName = 'defaultProfile.jpg';
            $user = User::create(array_merge(
                $validator->validated(),
                [
                    'password' => bcrypt($request->password),  // Hashear la contraseña
                    'privilege' => 'admin',                     // Privilegio de administrador
                    'userImage' => $imageName,                  // Imagen de perfil por defecto
                ]
            ));

            return response()->json(['message' => 'Usuario creado exitosamente', 'user' => $user], 201);

        } catch (\Exception $exception) {
            return response()->json(['message' => 'Error al crear el usuario', 'error' => $exception->getMessage()], 500);
        }
    }

    // Iniciar sesión del usuario
    public function login(Request $request)
    {
        // Validar los datos de entrada
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/[A-Z]/',     // Uppercase password
                'regex:/[a-z]/',     // Lowercase password
                'regex:/[0-9]/',     // Number password
                'regex:/[@$!%*?&#]/' // Alphanumeric password
            ],
        ]);

        // Si los datos no son válidos, retornar error
        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson(), 400);
        }

        // Intentar autenticar al usuario
        if (!$token = JWTAuth::attempt($validator->validated())) {
            return response()->json(['error' => 'No autorizado'], 401);
        }

        return $this->createNewToken($token);
    }

    // Cerrar sesión
    public function logout()
    {
        // Cerrar sesión y revocar el token
        JWTAuth::invalidate(JWTAuth::getToken());
        return response()->json(['message' => 'Usuario desconectado con éxito']);
    }

    // Refrescar el token JWT
    public function refresh()
    {
        return $this->createNewToken(JWTAuth::refresh());
    }

    // Obtener el perfil del usuario autenticado
    public function userProfile()
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['message' => 'No autorizado'], 401);
        }

        return response()->json($user);
    }

    // Crear un nuevo token JWT
    protected function createNewToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60,  
            'user' => auth()->user()
        ]);
    }
}
