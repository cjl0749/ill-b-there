<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Community;
use Illuminate\Auth\Access\HandlesAuthorization;

class CommunityPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view the community.
     *
     * @param  \App\User  $user
     * @param  \App\Community  $community
     * @return mixed
     */
    public function view(User $user, Community $community)
    {
        return ($community->creator_id === $user->id
				|| empty($community->email_filter)
				|| preg_match("/^.+@" . preg_quote($community->email_filter) . "$/isU", $user->email));
    }
	
    /**
     * Determine whether the user can create communities.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return true;
    }

    /**
     * Determine whether the user can update the community.
     *
     * @param  \App\User  $user
     * @param  \App\Community  $community
     * @return mixed
     */
    public function update(User $user, Community $community)
    {
        return $community->creator_id === $user->id;
    }

    /**
     * Determine whether the user can delete the community.
     *
     * @param  \App\User  $user
     * @param  \App\Community  $community
     * @return mixed
     */
    public function delete(User $user, Community $community)
    {
        return $community->creator_id === $user->id;
    }
	
	/**
	 * Determine wether the user can join the community.
	 * 
	 * @param User $user
	 * @param Community $community
	 * @return type
	 */
	public function join(User $user, Community $community)
    {
        return (empty($community->email_filter)
				|| preg_match("/^.+@" . preg_quote($community->email_filter) . "$/isU", $user->email));
    }
	
	/**
	 * Determine wether the user can leave the community.
	 * 
	 * @param User $user
	 * @param Community $community
	 * @return type
	 */
	public function leave(User $user, Community $community)
    {
        return true;
    }
	
	/**
	 * Determine wether the user can approve a application to join the community.
	 * 
	 * @param User $user
	 * @param Community $community
	 * @return type
	 */
	public function approve(User $user, Community $community)
    {
        return $user->id === $community->creator_id;
    }
	
	/**
	 * Determine wether the user can reject a application to join the community.
	 * 
	 * @param User $user
	 * @param Community $community
	 * @return type
	 */
	public function reject(User $user, Community $community)
    {
        return $user->id === $community->creator_id;
    }

}
