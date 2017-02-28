<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use GoogleMaps;

class ActivityController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $this->authorize('create', Activity::class);

		$categories = Category::get();
		
		return [
			'categories' => $categories,
			'communities' => Auth::user()->communities,
		];
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->authorize('create', Activity::class);
		
		$this->validate($request, [
			'title' => 'required|min:3',
			'description' => '',
			'community_id' => 'exists:communities,id',
			'category_id' => 'required|exists:categories,id',
			'longitude' => 'required_without:address|numeric',
			'latitude' => 'required_without:address|numeric',
			'address' => 'required_without:longitude,latitude',
			'event_at' => 'required|date|after_or_equal:now',
		]);
		
		// Check if user is member of specified community
		if ($request->has('community_id') && !Auth::user()->communities->contains($request->get('community_id')))
			abort (403, trans('activites.cannot_create_activity_for_unjoined_community'));
		
		// Retrieve location information
		$longitude = $request->get('longitude');
		$latitude = $request->get('latitude');
		$address = $request->get('address');
		
		if (empty($address))
		{
			$response = GoogleMaps::load('geocoding')
								  ->setParamByKey('latlng', $latitude . ',' . $longitude)
								  ->get();
			$response = json_decode($response);
			
			$address = $response->results[0]->formatted_address;
			$latitude = $response->results[0]->geometry->location->lat;
			$longitude = $response->results[0]->geometry->location->lng;
		}
		else if (empty($longitude) || empty($latitude))
		{
			$response = GoogleMaps::load('geocoding')
								  ->setParamByKey('address', $address)
								  ->get();
			$response = json_decode($response);
			
			$address = $response->results[0]->formatted_address;
			$latitude = $response->results[0]->geometry->location->lat;
			$longitude = $response->results[0]->geometry->location->lng;
		}
		
		$activity = new Activity();
		$activity->creator_id = Auth::id();
		$activity->community_id = $request->get('community_id');
		$activity->category_id = $request->get('category_id');
		$activity->title = $request->get('title');
		$activity->description = $request->get('description');
		$activity->longitude = $longitude;
		$activity->latitude = $latitude;
		$activity->address = $address;
		$activity->event_at = $request->get('event_at');
		$activity->save();
		
		return $activity;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Activity  $activity
     * @return \Illuminate\Http\Response
     */
    public function show(Activity $activity)
    {
		$this->authorize('view', $activity);
		
		$activity->load(['creator', 'participants', 'community']);
		
        return $activity;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Activity  $activity
     * @return \Illuminate\Http\Response
     */
    public function edit(Activity $activity)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Activity  $activity
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Activity $activity)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Activity  $activity
     * @return \Illuminate\Http\Response
     */
    public function destroy(Activity $activity)
    {
        $this->authorize('delete', $activity);
		
		$activity->delete();
	}
}
