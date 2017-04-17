<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Community extends Model
{
    protected $casts = [
		'requires_activation' => 'boolean',
	];
	
	public function creator()
	{
		return $this->belongsTo(User::class, 'creator_id', 'id');
	}
	
	public function members()
	{
		return $this->belongsToMany(User::class)->withPivot('active');
	}
	
	public function activeMembers()
	{
		return $this->belongsToMany(User::class)->wherePivot('active', true);
	}
	
	public function inactiveMembers()
	{
		return $this->belongsToMany(User::class)->wherePivot('active', false);
	}
}
