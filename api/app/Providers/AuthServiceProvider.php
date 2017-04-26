<?php

namespace App\Providers;

use Laravel\Passport\Passport;
use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        'App\Model' => 'App\Policies\ModelPolicy',
		'App\Models\Community' => 'App\Policies\CommunityPolicy',
		'App\Models\User' => 'App\Policies\UserPolicy',
		'App\Models\Activity' => 'App\Policies\ActivityPolicy',
		'App\Models\FriendRequest' => 'App\Policies\FriendRequestPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        Passport::routes();
    }
}
