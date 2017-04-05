<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Controllers\Controller;

class FriendController extends Controller
{
    /**
     * @api {delete} /friends/:id Remove a friend
	 * @apiName destroy
	 * @apiGroup Friends
	 *
     * @apiDescription Remove the friend from the list of friends of the logged in user.
	 *
	 * @apiParam {Number}	id	The ID of the friend to remove
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        Auth::user()->friends()->detach($user->id);
        $user->friends()->detach(Auth::id());
    }
}
