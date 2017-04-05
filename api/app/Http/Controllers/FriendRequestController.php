<?php

namespace App\Http\Controllers;

use App\Models\FriendRequest;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class FriendRequestController extends Controller
{
    /**
     * @api {get} /friend-requests List friend requests
	 * @apiName index
	 * @apiGroup FriendRequests
	 *
     * @apiDescription Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return [
			'friend_requests' => FriendRequest::where('user_id', Auth::id())->get(),
			'received_friend_requests' => FriendRequest::where('friend_id', Auth::id())->get()
		];
    }

    /**
     * @api {post} /friend-requests Store new friend request
	 * @apiName store
	 * @apiGroup FriendRequests
	 *
     * @apiDescription Store a newly created resource in storage.
	 *
	 * @apiParam {Number}	friend_id	The ID of the user to add as a friend
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
		$this->validate($request, [
			'friend_id' => 'required|exists:users,id',
		]);

		$this->authorize('create', [FriendRequest::class, $request->get('friend_id')]);

		$friendRequest = new FriendRequest();
		$friendRequest->user_id = Auth::id();
		$friendRequest->friend_id = $request->get('friend_id');
		$friendRequest->save();

		return $friendRequest;
    }

    /**
     * @api {delete} /friend-requests/:id Delete a friend request
	 * @apiName destroy
	 * @apiGroup FriendRequests
	 *
     * @apiDescription Remove the specified resource from storage.
     *
     * @param  \App\Models\FriendRequest  $friendRequest
     * @return \Illuminate\Http\Response
     */
    public function destroy(FriendRequest $friendRequest)
    {
		$this->authorize('delete', $friendRequest);

		$friendRequest->delete();
    }

	/**
	 * @api {get} /friend-requests/:id/approve Approve friend requests
	 * @apiName approve
	 * @apiGroup FriendRequests
	 *
     * @apiDescription Approve a received friend request
	 *
	 * @param FriendRequest $friendRequest
	 */
	public function approve(FriendRequest $friendRequest)
	{
		$this->authorize('approve', $friendRequest);

		User::findOrFail($friendRequest->user_id)->friends()->attach($friendRequest->friend_id);
		User::findOrFail($friendRequest->friend_id)->friends()->attach($friendRequest->user_id);

		$friendRequest->delete();
	}

	/**
	 * @api {get} /friend-requests/:id/reject Reject friend requests
	 * @apiName reject
	 * @apiGroup FriendRequests
	 *
     * @apiDescription Reject a received friend request
	 *
	 * @param FriendRequest $friendRequest
	 */
	public function reject(FriendRequest $friendRequest)
	{
		$this->authorize('reject', $friendRequest);

		$friendRequest->delete();
	}
}
