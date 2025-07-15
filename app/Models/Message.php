<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Group;
use App\Models\MessageAttachment;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Observers\MessageObserver;
#[ObservedBy(MessageObserver::class)]
class Message extends Model
{
    use HasFactory;
    protected $fillable = [
        'message',
        'sender_id',
        'group_id',
        'receiver_id',
    ];

    public function sender(){
        return $this->belongsTo(User::class,'sender_id');
    }

    public function receiver(){
        return $this->belongsTo(User::class,'receiver_id');
    }

    public function group(){
        return $this->belongsTo(Group::class);
    }

    public function attachments(){
        return $this->hasMany(MessageAttachment::class);
    }
}
