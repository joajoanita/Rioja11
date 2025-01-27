<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\CORS;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
       using: function(Illuminate\Routing\Router $router){
        $router->middleware('api')
            ->prefix('api')
            ->group(base_path('routes/api.php'));

        $router->middleware('web')
        ->group(base_path('routes/web.php'));

    })
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->validateCsrfTokens(
            except: ['login', 'register']
        );
     
        $middleware->web(append: [
            CORS::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
