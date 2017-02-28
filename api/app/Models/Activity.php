<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
	protected $dates = [
		'event_at',
	];
	
    public function creator()
	{
		return $this->belongsTo(User::class, 'creator_id');
	}
	
    public function community()
	{
		return $this->belongsTo(Community::class);
	}
	
	public function participants()
	{
		return $this->belongsToMany(User::class);
	}
}
