<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

use App\Models\User;
use App\Models\Nationality;

class UserController extends Controller
{
	private $genders = ['male', 'female', 'unknown'];

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $users = User::with('nationality')->get();

		return $users;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $nationalities = Nationality::get();

		return [
			'nationalities' => $nationalities,
			'genders' => $this->genders,
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
        $this->validate($request, [
			'firstname' => 'required',
			'lastname' => 'required',
			'email' => 'required|email|unique:users,email',
			'password' => 'required|min:5',
			'gender' => ['required', Rule::in($this->genders)],
			'nationality_id' => 'exists:nationalities,id',
			'birthdate' => 'required|date',
		]);

		$user = new User();
		$user->firstname = $request->get('firstname');
		$user->lastname = $request->get('lastname');
		$user->email = $request->get('email');
		$user->password = bcrypt($request->get('password'));
		$user->gender = $request->get('gender');
		$user->nationality_id = $request->get('nationality_id');
		$user->birthdate = $request->get('birthdate');
		$user->save();

		return $user;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {
		$this->authorize('view', $user);

		$user->load(['nationality']);

        return $user;
    }

	/**
	 * Display the user profile
	 *
     * @return \Illuminate\Http\Response
	 */
	public function profile()
	{
		$user = Auth::user();

		$user->load(['communities', 'applications', 'activities']);

		return $user;
	}

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function edit(User $user)
    {
		$this->authorize('update', $user);

		$user->load(['nationality']);

        $nationalities = Nationality::get();

		return [
			'user' => $user,
			'nationalities' => $nationalities,
			'genders' => $this->genders,
		];
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, User $user)
    {
		$this->authorize('update', $user);

        $this->validate($request, [
			'firstname' => '',
			'lastname' => '',
			'email' => 'email|unique:users,email,' . $id,
			'password' => 'min:5',
			'gender' => [Rule::in($this->genders)],
			'nationality_id' => 'exists:nationalities,id',
			'birthdate' => 'date',
		]);

		if ($request->has('firstname'))
			$user->firstname = $request->get('firstname');
		if ($request->has('lastname'))
			$user->lastname = $request->get('lastname');
		if ($request->has('email'))
			$user->email = $request->get('email');
		if ($request->has('password'))
			$user->password = bcrypt($request->get('password'));
		if ($request->has('gender'))
			$user->gender = $request->get('gender');
		if ($request->has('nationality_id'))
			$user->nationality_id = $request->get('nationality_id');
		if ($request->has('birthdate'))
			$user->birthdate = $request->get('birthdate');
		$user->save();

		return $user;
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        $this->authorize('delete', $user);
    }
}
