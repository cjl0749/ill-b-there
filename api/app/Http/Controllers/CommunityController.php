<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Models\Community;
use App\Models\User;

class CommunityController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $communities = Community::get();
		
		return $communities;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
		$this->authorize('create', Community::class);
    }

    /**
     * Store a newly created resource in storage.
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
     * Display the specified resource.
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
     * Show the form for editing the specified resource.
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
     * Update the specified resource in storage.
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
     * Remove the specified resource from storage.
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
	 * Add the logged-in user as a member of the community
	 * 
	 * @param Community $community
	 */
	public function join(Community $community)
	{
		$this->authorize('join', $community);
		
		$community->members()->attach(Auth::id(), ['active' => !$community->requires_activation]);
	}
	
	/**
	 * Remove the logged-in user from the members of the community
	 * 
	 * @param Community $community
	 */
	public function leave(Community $community)
	{
		$this->authorize('leave', $community);
		
		$community->members()->detach(Auth::id());
	}
	
	/**
	 * Approve the user as a member of the community
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
	 * Reject the user as a member of the community
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
