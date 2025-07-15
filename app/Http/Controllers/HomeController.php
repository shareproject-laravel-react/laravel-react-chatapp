<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Conversation;

class HomeController extends Controller
{
    public function home()
    {
        $user = Auth::user();

        $conversations = Conversation::getConversationsForSidebar($user);

        return Inertia::render('Home', [
            'conversations' => $conversations,
            'selectedConversations' => null, // or pass selected if any
        ]);
    }
}
