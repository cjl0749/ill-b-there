<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Models\Community;
use App\Models\User;

class CommunityController extends Controller
{
    /**
     * @api {get} /communities List communities
	 * @apiName index
	 * @apiGroup Communities
	 *
     * @apiDescription Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $communities = Community::get();

		return $communities;
    }

    /**
     * @api {get} /communities/create Community creation form
	 * @apiName create
	 * @apiGroup Communities
	 *
     * @apiDescription Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
		$this->authorize('create', Community::class);
    }

    /**
     * @api {post} /communities	Store new community
	 * @apiName store
	 * @apiGroup Communities
	 *
     * @apiDescription Store a newly created resource in storage.
	 *
	 * @apiParam {String}	name					Name of the community to be created
	 * @apiParam {String}	[description]			Description of the community to be created
	 * @apiParam {String}	[email_filter]			The domain to filter approved emails
	 * @apiParam {Boolean}	[requires_activation]	Does the community require activation for new members
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
		$this->authorize('create', Community::class);

        $this->validate($request, [
			'name' => 'required|min:3',
			'email_filter' => 'regex:/[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/',
		]);

		$community = new Community();
		$community->name = $request->get('name');
		$community->description = $request->get('description');
		$community->creator_id = Auth::id();
		$community->email_filter = $request->get('email_filter');
		$community->requires_activation = $request->has('requires_activation');
		$community->save();

		$community->members()->attach(Auth::id(), ['active' => true]);

		return $community;
    }

    /**
     * @api {get} /communities/:id Display a community
	 * @apiName show
	 * @apiGroup Communities
	 *
     * @apiDescription Display the specified resource.
	 *
	 * @apiParam {Number}	id	The ID of the community
     *
     * @param  \App\Models\Community  $community
     * @return \Illuminate\Http\Response
     */
    public function show(Community $community)
    {
		$this->authorize('view', $community);

		$community->load(['creator', 'activeMembers']);

		if (Auth::id() == $community->creator_id)
		{
			$community->load('inactiveMembers');
		}

		return $community;
    }

    /**
     * @api {get} /communities/:id/edit Community edition form
	 * @apiName edit
	 * @apiGroup Communities
	 *
     * @apiDescription Show the form for editing the specified resource.
     *
	 * @apiParam {Number}	id	The ID of the community
	 *
     * @param  \App\Models\Community  $community
     * @return \Illuminate\Http\Response
     */
    public function edit(Community $community)
    {
        $this->authorize('update', $community);

		return $community;
    }

    /**
     * @api {put} /communities/:id Update a community
	 * @apiName update
	 * @apiGroup Communities
	 *
     * @apiDescription Update the specified resource in storage.
     *
	 * @apiParam {Number}	id	The ID of the community
	 *
	 * @apiParam {String}	[name]					Name of the community to be created
	 * @apiParam {String}	[description]			Description of the community to be created
	 * @apiParam {String}	[email_filter]			The domain to filter approved emails
	 * @apiParam {Boolean}	[requires_activation]	Does the community require activation for new members
	 *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Community  $community
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Community $community)
    {
		$this->authorize('update', $community);

		$this->validate($request, [
			'name' => 'min:3',
			'email_filter' => 'regex:/[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/',
		]);

		if ($request->has('name'))
			$community->name = $request->get('name');
		if ($request->has('description'))
			$community->description = $request->get('description');
		if ($request->has('email_filter'))
			$community->email_filter = $request->get('email_filter');
		$community->requires_activation = $request->has('requires_activation');
		$community->save();

		return $community;
    }

    /**
     * @api {delete} /communities/:id Delete a community
	 * @apiName destroy
	 * @apiGroup Communities
	 *
     * @apiDescription Remove the specified resource from storage.
     *
	 * @apiParam {Number}	id	The ID of the community
	 *
     * @param  \App\Models\Community  $community
     * @return \Illuminate\Http\Response
     */
    public function destroy(Community $community)
    {
        $this->authorize('delete', $community);

		$community->delete();
    }

	/**
	 * @api {get} /communities/:id/join Join a community
	 * @apiName join
	 * @apiGroup Communities
	 *
     * @apiDescription Add the logged-in user as a member of the community
	 *
	 * @apiParam {Number}	id	The ID of the community
	 *
	 * @param Community $community
	 */
	public function join(Community $community)
	{
		$this->authorize('join', $community);

		$community->members()->attach(Auth::id(), ['active' => !$community->requires_activation]);
	}

	/**
	 * @api {get} /communities/:id/leave Leave a community
	 * @apiName leave
	 * @apiGroup Communities
	 *
     * @apiDescription Remove the logged-in user from the members of the community
	 *
	 * @apiParam {Number}	id	The ID of the community
	 *
	 * @param Community $community
	 */
	public function leave(Community $community)
	{
		$this->authorize('leave', $community);

		$community->members()->detach(Auth::id());
	}

	/**
	 * @api {get} /communities/:id/members/:userId/approve Approve an user in a community
	 * @apiName approve
	 * @apiGroup Communities
	 *
     * @apiDescription Approve the user as a member of the community
	 *
	 * @apiParam {Number}	id		The ID of the community
	 * @apiParam {Number}	userId	The ID of the user to approve
	 *
	 * @param Community $community
	 * @param User $user
	 */
	public function approve(Community $community, User $user)
	{
		$this->authorize('approve', $community);

		$community->members()->updateExistingPivot($user->id, ['active' => true]);
	}

	/**
	 * @api {get} /communities/:id/members/:userId/reject Reject an user from a community
	 * @apiName reject
	 * @apiGroup Communities
	 *
     * @apiDescription Reject the user as a member of the community
	 *
	 * @apiParam {Number}	id		The ID of the community
	 * @apiParam {Number}	userId	The ID of the user to reject
	 *
	 * @param Community $community
	 * @param User $user
	 */
	public function reject(Community $community, User $user)
	{
		$this->authorize('reject', $community);

		$community->members()->detach($user->id);
	}
}
