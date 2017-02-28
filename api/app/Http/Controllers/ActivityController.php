<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

use GoogleMaps;

class ActivityController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
		if (!$request->has('latitude') || !$request->has('longitude'))
			abort(400, trans('activities.missing_latitude_longitude_parameters'));

		$currentLatitude = DB::connection()->getPdo()->quote($request->get('latitude'));
		$currentLongitude = DB::connection()->getPdo()->quote($request->get('longitude'));

		$timeCheck = new \DateTime();
		$timeCheck->modify('-15 minutes'); // Should be configurable

        $activities = DB::table('activities')
						->select('*', DB::raw('6371 * (ACOS(COS(RADIANS(' . $currentLatitude . ')) * COS(RADIANS(latitude)) * COS(RADIANS(longitude) - RADIANS(' . $currentLongitude . ')) + SIN(RADIANS(' . $currentLatitude . ')) * SIN(RADIANS(latitude)))) AS distance'))
					    ->having('distance', '<', 30) // Should be configurable
						->where('event_at', '>=', $timeCheck)
						->orderBy('distance', 'ASC')
						->get();

		return $activities;
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
        $this->authorize('update', $activity);

		return $activity;
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
        $this->authorize('update', $activity);

		$this->validate($request, [
			'title' => 'min:3',
			'description' => '',
			'longitude' => 'numeric',
			'latitude' => 'numeric',
			'address' => '',
			'event_at' => 'date|after_or_equal:now',
		]);

		// Retrieve location information
		$longitude = $request->get('longitude');
		$latitude = $request->get('latitude');
		$address = $request->get('address');

		if (!empty($address))
		{
			$response = GoogleMaps::load('geocoding')
								  ->setParamByKey('address', $address)
								  ->get();
			$response = json_decode($response);

			$address = $response->results[0]->formatted_address;
			$latitude = $response->results[0]->geometry->location->lat;
			$longitude = $response->results[0]->geometry->location->lng;
		}
		else if (!empty($longitude) && !empty($latitude))
		{
			$response = GoogleMaps::load('geocoding')
								  ->setParamByKey('latlng', $latitude . ',' . $longitude)
								  ->get();
			$response = json_decode($response);

			$address = $response->results[0]->formatted_address;
			$latitude = $response->results[0]->geometry->location->lat;
			$longitude = $response->results[0]->geometry->location->lng;
		}

		if ($request->has('title'))
			$activity->title = $request->get('title');
		if ($request->has('description'))
			$activity->description = $request->get('description');
		if ($latitude !== null)
			$activity->latitude = $latitude;
		if ($longitude !== null)
			$activity->longitude = $longitude;
		if ($address !== null)
			$activity->address = $address;
		if ($request->has('event_at'))
			$activity->title = $request->get('event_at');
		$activity->save();

		return $activity;
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
