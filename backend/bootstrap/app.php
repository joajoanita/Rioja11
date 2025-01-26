<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

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
        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
