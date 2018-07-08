<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Activity;
use Illuminate\Auth\Access\HandlesAuthorization;

class ActivityPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view the activity.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Activity  $activity
     * @return mixed
     */
    public function view(User $user, Activity $activity)
    {
        return (empty($activity->community_id)
				|| $activity->creator_id === $user->id
				|| $user->communities->contains($activity->community_id));
    }

    /**
     * Determine whether the user can create activities.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return true;
    }

    /**
     * Determine whether the user can update the activity.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Activity  $activity
     * @return mixed
     */
    public function update(User $user, Activity $activity)
    {
        return $activity->creator_id === $user->id;
    }

    /**
     * Determine whether the user can delete the activity.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Activity  $activity
     * @return mixed
     */
    public function delete(User $user, Activity $activity)
    {
        return $activity->creator_id === $user->id;
    }

	/**
     * Determine whether the user can join the activity.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Activity  $activity
     * @return mixed
     */
    public function join(User $user, Activity $activity)
    {
		return !$activity->participants->contains($user->id);
    }

	/**
     * Determine whether the user can leave the activity.
     *
     * @param  \App\User  $user
     * @param  \App\Models\Activity  $activity
     * @return mixed
     */
    public function leave(User $user, Activity $activity)
    {
		return $activity->participants->contains($user->id) && $activity->creator_id != $user->id;
    }

    /**
     * @param User $user
     * @param Activity $activity
     */
    public function feedback(User $user, Activity $activity)
    {
        return $activity->participants->contains($user->id);
    }
}
