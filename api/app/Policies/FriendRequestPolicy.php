<?php

namespace App\Policies;

use App\User;
use App\Models\FriendRequest;
use Illuminate\Auth\Access\HandlesAuthorization;

class FriendRequestPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can create friendRequests.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user, $friendId)
    {
        return !$user->friends()->contains($friendId);
    }

    /**
     * Determine whether the user can delete the friendRequest.
     *
     * @param  \App\User  $user
     * @param  \App\Models\FriendRequest  $friendRequest
     * @return mixed
     */
    public function delete(User $user, FriendRequest $friendRequest)
    {
        return $friendRequest->user_id == $user->id;
    }

	public function approve(User $user, FriendRequest $friendRequest)
    {
        return $friendRequest->friend_id == $user->id;
    }

	public function reject(User $user, FriendRequest $friendRequest)
    {
        return $friendRequest->friend_id == $user->id;
    }

}
