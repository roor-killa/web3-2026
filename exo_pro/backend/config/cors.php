<?php

// Fichier backend: commentaires simples en francais.
return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [],
    'allowed_origins_patterns' => [
        '/^http:\/\/localhost:\d+$/',
        '/^http:\/\/127\.0\.0\.1:\d+$/',
        '/^http:\/\/\[::1\]:\d+$/',
        '/^http:\/\/(?:\d{1,3}\.){3}\d{1,3}:\d+$/',
    ],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];


