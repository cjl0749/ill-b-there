<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('firstname');
            $table->string('lastname');
            $table->string('email')->unique();
            $table->string('password');
			$table->enum('gender', ['unknown', 'male', 'female']);
			$table->integer('nationality_id')->unsigned()->index()->nullable();
			$table->date('birthdate');
            $table->rememberToken();
            $table->timestamps();
			
			$table->foreign('nationality_id')->references('id')->on('nationalities')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
		Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('users');
		Schema::enableForeignKeyConstraints();
    }
}
