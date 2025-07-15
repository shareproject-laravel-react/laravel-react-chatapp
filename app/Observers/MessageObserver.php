<?php

namespace App\Observers;

use App\Models\Message;
use App\Models\Group;
use App\Models\Conversation;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class MessageObserver
{
    public function deleting(Message $message)
    {
        DB::transaction(function () use ($message) {
            // Delete the attachments *from disk and DB* first
            if ($message->attachments && $message->attachments->count() > 0) {
                $message->attachments->each(function ($attachment) {
                    $dir = dirname($attachment->path);
                    Storage::disk('public')->deleteDirectory($dir);
                });

                // Now delete them from the DB
                $message->attachments()->delete();
            }

            // Handle group updates
            $group = Group::where('last_message_id', $message->id)->first();
            if ($group) {
                $group->last_message_id = null;
                $group->save();

                $prevMessage = Message::where('group_id', $message->group_id)
                    ->where('id', '!=', $message->id)
                    ->latest()
                    ->first();

                if ($prevMessage) {
                    $group->last_message_id = $prevMessage->id;
                    $group->save();
                }
            }

            // Handle conversation updates
            $conversation = Conversation::where('last_message_id', $message->id)->first();
            if ($conversation) {
                $conversation->last_message_id = null;
                $conversation->save();

                $prev = Message::where(function ($query) use ($message) {
                        $query->where('sender_id', $message->sender_id)
                              ->where('receiver_id', $message->receiver_id)
                              ->orWhere(function ($query) use ($message) {
                                  $query->where('sender_id', $message->receiver_id)
                                        ->where('receiver_id', $message->sender_id);
                              });
                    })
                    ->where('id', '!=', $message->id)
                    ->latest()
                    ->first();

                if ($prev) {
                    $conversation->last_message_id = $prev->id;
                    $conversation->save();
                }
            }
        });
    }
}
