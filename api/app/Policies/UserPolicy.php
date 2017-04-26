<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view the user.
     *
     * @param  \App\User  $user
     * @param  \App\Models\User  $user
     * @return mixed
     */
    public function view(User $user, User $resourceUser)
    {
        return true;
    }

    /**
     * Determine whether the user can create users.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return true;
    }

    /**
     * Determine whether the user can update the user.
     *
     * @param  \App\User  $user
     * @param  \App\Models\User  $user
     * @return mixed
     */
    public function update(User $user, User $resourceUser)
    {
        return $user->id === $resourceUser->id;
    }

    /**
     * Determine whether the user can delete the user.
     *
     * @param  \App\User  $user
     * @param  \App\Models\User  $user
     * @return mixed
     */
    public function delete(User $user, User $resourceUser)
    {
        return false;
    }
}
