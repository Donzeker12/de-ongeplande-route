<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Avontuur;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AvontuurController extends Controller
{
    public function index(): Response
    {
        $avonturen = Avontuur::query()
            ->with(['user:id,name', 'posts' => fn ($q) => $q->select('id', 'title', 'status', 'avontuur_id', 'user_id')->with('user:id,name')])
            ->latest()
            ->get();

        return Inertia::render('Admin/Avonturen/Index', [
            'avonturen' => $avonturen,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:2000',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $validated['user_id'] = Auth::id();
        Avontuur::create($validated);

        return back()->with('success', 'Avontuur aangemaakt!');
    }

    public function update(Request $request, Avontuur $avontuur): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:2000',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $avontuur->update($validated);

        return back()->with('success', 'Avontuur bijgewerkt!');
    }

    public function destroy(Avontuur $avontuur): RedirectResponse
    {
        $avontuur->delete();

        return back()->with('success', 'Avontuur verwijderd.');
    }
}
