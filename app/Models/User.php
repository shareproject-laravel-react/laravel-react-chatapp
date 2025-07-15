<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Group;
use App\Models\Conversation;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'email_verified_at',
        'is_admin',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function groups(){
        return $this->belongsToMany(Group::class,'group_users');
    }

    public static function getUserExceptUser(User $user){
        $userId = $user->id;
        $query = User::select(['users.*',
        'messages.message as last_message', 
        'messages.created_at as last_message_date'])
        ->where('users.id','!=',$userId)
        ->when(!$user->is_admin,function($query){
            $query->whereNull('users.blocked_at');
        })
        ->leftJoin('conversations', function($join) use ($userId){
            $join->on('conversations.user_id1','=','users.id')
            ->where('conversations.user_id2','=', $userId)
            ->orWhere(function ($query) use ($userId){
                $query->on('conversations.user_id2','=','users.id')
                ->where('conversations.user_id1', '=',$userId);
            });
        })->leftJoin('messages','messages.id','=','conversations.last_message_id')
        ->orderByRaw("COALESCE(users.blocked_at, '1970-01-01 00:00:00')
")
        ->orderBy('messages.created_at','desc')
        ->orderBy('users.name');

        return $query->get();

    } 

    public function toConversationArray(){
        return [
            'id'=>$this->id,
            'name' => $this->name,
            'is_group' => false,
            'is_user' => true,
            'is_admin'=>(bool) $this->is_admin,
            'created_at'=>$this->created_at,
            'updated_at'=>$this->updated_at,
            'blocked_at'=>$this->blocked_at,
            'last_message'=>$this->last_message,
            'last_message_date'=>($this->last_message_date ? $this->last_message_date . ' UTC' : null),

        ];
    }
}
