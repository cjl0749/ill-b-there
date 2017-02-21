<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableActivities extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('activities', function (Blueprint $table) {
            $table->increments('id');
			$table->integer('creator_id')->unsigned()->index();
			$table->integer('community_id')->unsigned()->index()->nullable();
			$table->integer('category_id')->unsigned()->index()->nullable();
			$table->string('title');
			$table->text('description')->nullable();
			$table->string('longitude');
			$table->string('latitude');
			$table->string('address');
			
			$table->foreign('creator_id')->references('id')->on('users')->onDelete('set null');
			$table->foreign('community_id')->references('id')->on('communities')->onDelete('set null');
			$table->foreign('category_id')->references('id')->on('categories')->onDelete('set null');
			$table->timestamps();
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
        Schema::dropIfExists('activities');
		Schema::enableForeignKeyConstraints();
    }
}
