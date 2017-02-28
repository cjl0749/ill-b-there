<?php

namespace App\Models;

use Laravel\Passport\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token', 'nationality_id'
    ];

	protected $dates = [
		'birthdate',
	];

	public function nationality()
	{
		return $this->belongsTo(Nationality::class);
	}

	public function communities()
	{
		return $this->belongsToMany(Community::class)->wherePivot('active', true);
	}

	public function applications()
	{
		return $this->belongsToMany(Community::class)->wherePivot('active', false);
	}

	public function activities()
	{
		return $this->belongsToMany(Activity::class)->orderBy('event_at', 'DESC');
	}

}
