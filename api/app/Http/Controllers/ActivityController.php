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
     * @api {get} /activities List activities
	 * @apiName index
	 * @apiGroup Activities
	 *
     * @apiDescription Display a listing of the activities around the logged in user.
	 * @apiExample {curl} Example usage:
	 *		curl -i https://api.illbthere.localhost/api/activities?latitude=33.1295574&longitude=-117.1599449
	 *
	 * @apiParam {Number} latitude	The current latitude of the user
	 * @apiParam {Number} longitude	The current longitude of the user
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
     * @api {get} /activities/create Activity creation form
	 * @apiName create
	 * @apiGroup Activities
	 *
     * @apiDescription Show the form for creating a new activity.
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
     * @api {post} /activities Store new activity
	 * @apiName store
	 * @apiGroup Activities
	 *
     * @apiDescription Store a newly created activity in storage.
	 *
	 * @apiParam {String}	[description]	The description of the activity
	 * @apiParam {Number}	[community_id]	The ID of the community to link the activity to
	 * @apiParam {Number}	category_id		The ID of the category to link the activity to
	 * @apiParam {Number}	longitude		The longitude of the location of the event. Required without the address.
	 * @apiParam {Number}	latitude		The latitude of the location of the event. Required without the address.
	 * @apiParam {String}	address			The address of the location of the event. Required without the latitude and the longitude.
	 * @apiParam {String}	event_at		The time of the event.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->authorize('create', Activity::class);

		$this->validate($request, [
			'description' => '',
			'community_id' => 'exists:communities,id',
			'category_id' => 'required|exists:categories,id',
			'longitude' => 'required_without:address|numeric',
			'latitude' => 'required_without:address|numeric',
			'address' => 'required_without:longitude,latitude',
			'event_at' => 'required|date|after_or_equal:now',
		]);

		// Check if user is member of specified community
		if ($request->has('community_id')
			&& !Auth::user()->communities->contains($request->get('community_id')))
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
		$activity->description = $request->get('description');
		$activity->longitude = $longitude;
		$activity->latitude = $latitude;
		$activity->address = $address;
		$activity->event_at = $request->get('event_at');
		$activity->save();

		return $activity;
    }

    /**
     * @api {get} /activities/:id Display an activity
	 * @apiName show
	 * @apiGroup Activities
	 *
     * @apiDescription Display the specified activity.
	 *
	 * @apiParam {Number}	id		The ID of the activity
     *
     * @param  \App\Models\Activity  $activity
     * @return \Illuminate\Http\Response
     */
    public function show(Activity $activity)
    {
		$this->authorize('view', $activity);

		$activity->load(['creator', 'participants', 'community', 'category']);

        return $activity;
    }

    /**
     * @api {get} /activities/:id/edit Activity update form
	 * @apiName edit
	 * @apiGroup Activities
	 *
     * @apiDescription Show the form for editing the specified activity.
     *
	 * @apiParam {Number}	id		The ID of the activity
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
     * @api {put} /activities/:id Update an activity
	 * @apiName update
	 * @apiGroup Activities
	 *
     * @apiDescription Update the specified activity in storage.
     *
	 * @apiParam {Number}	id		The ID of the activity
	 *
	 * @apiParam {String}	[description]	The description of the activity
	 * @apiParam {Number}	[longitude]		The longitude of the location of the event.
	 * @apiParam {Number}	[latitude]		The latitude of the location of the event.
	 * @apiParam {String}	[address]		The address of the location of the event.
	 * @apiParam {String}	[event_at]		The time of the event.
	 *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Activity  $activity
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Activity $activity)
    {
        $this->authorize('update', $activity);

		$this->validate($request, [
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

		if ($request->has('description'))
			$activity->description = $request->get('description');
		if ($latitude !== null)
			$activity->latitude = $latitude;
		if ($longitude !== null)
			$activity->longitude = $longitude;
		if ($address !== null)
			$activity->address = $address;
		if ($request->has('event_at'))
			$activity->event_at = $request->get('event_at');
		$activity->save();

		return $activity;
    }

    /**
     * @api {delete} /activities/:id Delete an activity
	 * @apiName destroy
	 * @apiGroup Activities
	 *
     * @apiDescription Remove the specified activity from storage.
     *
	 * @apiParam {Number}	id		The ID of the activity
	 *
     * @param  \App\Models\Activity  $activity
     * @return \Illuminate\Http\Response
     */
    public function destroy(Activity $activity)
    {
        $this->authorize('delete', $activity);

		$activity->delete();
	}

	/**
	 * @api {get} /activities/:id/join Join an activity
	 * @apiName join
	 * @apiGroup Activities
	 *
     * @apiDescription Join the specified activity as a participant.
	 *
	 * @apiParam {Number}	id		The ID of the activity
	 *
	 * @param Activity $activity
     * @return \Illuminate\Http\Response
	 */
    public function join(Activity $activity)
    {
        $this->authorize('join', $activity);

		$activity->participants()->attach(Auth::id());
	}

	/**
	 * @api {get} /activities/:id/leave Leave an activity
	 * @apiName leave
	 * @apiGroup Activities
	 *
     * @apiDescription Leave the specified activity as a participant.
	 *
	 * @apiParam {Number}	id		The ID of the activity
	 *
	 * @param Activity $activity
     * @return \Illuminate\Http\Response
	 */
    public function leave(Activity $activity)
    {
        $this->authorize('leave', $activity);

		$activity->participants()->detach(Auth::id());
	}
}
