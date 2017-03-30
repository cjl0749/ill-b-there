<?php

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::resource('users', 'UserController', ['only' => ['create', 'store']]);

Route::group(['middleware' => ['auth:api']], function()
{
	Route::group(['prefix' => '/users'], function()
	{
		Route::get('/profile', ['uses' => 'UserController@profile']);
	});
	Route::resource('users', 'UserController', ['except' => ['create', 'store']]);

	Route::group(['prefix' => '/communities'], function()
	{
		Route::group(['prefix' => '/{community}'], function()
		{
			Route::get('/join', ['uses' => 'CommunityController@join']);
			Route::get('/leave', ['uses' => 'CommunityController@leave']);

			Route::group(['prefix' => '/members/{user}'], function()
			{
				Route::get('/approve', ['uses' => 'CommunityController@approve']);
				Route::get('/reject', ['uses' => 'CommunityController@reject']);
			});
		});
	});
	Route::resource('communities', 'CommunityController');

	Route::group(['prefix' => '/activities'], function()
	{
        Route::get('/future', ['uses' => 'ActivityController@userFutureActivities']);
        Route::get('/past', ['uses' => 'ActivityController@userPastActivities']);

		Route::group(['prefix' => '/{activity}'], function()
		{
			Route::get('/join', ['uses' => 'ActivityController@join']);
			Route::get('/leave', ['uses' => 'ActivityController@leave']);
            Route::post('/feedback', ['uses' => 'ActivityController@giveFeedback']);
		});
	});
	Route::resource('activities', 'ActivityController');
});
