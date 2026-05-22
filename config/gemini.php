<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Gemini Flash AI Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for Google's Gemini Flash API integration
    | Get your API key from: https://ai.google.dev/
    |
    */

    'api_key' => env('GEMINI_API_KEY'),
    
    'model' => env('GEMINI_MODEL', 'gemini-2.5-flash'),
    
    'base_url' => env('GEMINI_BASE_URL', 'https://generativelanguage.googleapis.com/v1beta'),
    
    'max_tokens' => env('GEMINI_MAX_TOKENS', 2048),
    
    'temperature' => env('GEMINI_TEMPERATURE', 0.7),
    
    'timeout' => env('GEMINI_TIMEOUT', 30),
];