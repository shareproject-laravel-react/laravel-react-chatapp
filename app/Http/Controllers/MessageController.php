<?php

namespace App\Http\Controllers;
use App\Http\Resources\MessageResource;
use App\Http\Requests\StoreMessageRequest;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Group;
use App\Models\Message;
use App\Models\Conversation;
use App\Events\SocketMessage;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\MessageAttachment;



class MessageController extends Controller
{
    public function byUser(User $user){
        $messages = Message::where('sender_id', auth()->id())
        ->where('receiver_id', $user->id)
        ->orWhere('sender_id', $user->id)
        ->where('receiver_id', auth()->id())
        ->latest()
        ->paginate(10);

        return inertia('Home',[
            'selectedConversation' => $user->toConversationArray(),
            'messages' => MessageResource::collection($messages)->response()->getData(true),
        ]);
    }

    public function byGroup(Group $group){
        $messages = Message::where('group_id', $group->id)
        ->latest()
        ->paginate(50);

        return inertia('Home',[
            'selectedConversation' => $group->toConversationArray(),
            'messages' => MessageResource::collection($messages)->response()->getData(true),
        ]);
    }

    public function loadOlder(Message $message){
        if($message->group_id){
            $messages = Message::where('created_at', '<', $message->created_at)
            ->where(function ($query) use ($message){
                $query->where('sender_id', $message->sender_id)
                ->where('receiver_id', $message->receiver_id)
                ->orWhere('sender_id', $message->receiver_id)
                ->where('receiver_id', $message->sender_id);
            })->latest()->paginate(10); 
        }else{
            $messages = Message::where('created_at', '<', $message->created_at)
            ->where(function ($query) use ($message){
                $query->where('sender_id', $message->sender_id)
                ->where('receiver_id', $message->receiver_id)
                ->orWhere('sender_id', $message->receiver_id)
                ->where('receiver_id', $message->sender_id);
            })->latest()->paginate(10); 
        }

        return MessageResource::collection($messages);
    }

    public function store(StoreMessageRequest $request)
{
    $data = $request->validated();
    $data['sender_id'] = auth()->id();

    $receiverId = $data['receiver_id'] ?? null;
    $groupId = $data['group_id'] ?? null;

    // Don't expect attachments in validated() — get them from $request->file
    $files = $request->file('attachments', []);

    $message = Message::create($data);

    if ($files) {
        foreach ($files as $file) {
            $directory = 'attachments/' . Str::random(32);
            Storage::makeDirectory($directory);

            $message->attachments()->create([
                'name' => $file->getClientOriginalName(),
                'mime' => $file->getClientMimeType(),
                'size' => $file->getSize(),
                'path' => $file->store($directory, 'public'),
            ]);
        }
    }

    if ($receiverId) {
        Conversation::updateConversationWithMessage($receiverId, auth()->id(), $message);
    }

    if ($groupId) {
        Group::updateGroupWithMessage($groupId, $message);
    }

    // Load sender + attachments so MessageResource has data
    $message->load(['sender', 'attachments']);

    SocketMessage::dispatch($message);

    return new MessageResource($message);
}


    public function destroy(Message $message){
        $group = null;
        $conversation = null;
        if($message->sender_id !==auth()->id()){
            return response()->json(['message'=>'Forbidden'], 403);
        }

        //Check whether or not the message is within a group:
        if($message->group_id){
            $group = Group::where('last_message_id', $message->id)->first();
        }else{
                $conversation = Conversation::where('last_message_id', $message->id)->first();
            }
        
        
        $message->delete();

        if($group){
            //Repopulate group with latest data.
            $group = Group::find($group->id);
            $lastMessage = $group->lastMessage;
        }else if($conversation){
            $conversation = Conversation::find($conversation->id);
            $lastMessage = $conversation->lastMessage;
        }
        return response()->json(['message'=> $lastMessage ? new MessageResource($lastMessage) : null]);
    }
}
