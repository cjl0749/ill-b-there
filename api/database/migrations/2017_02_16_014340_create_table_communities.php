<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableCommunities extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('communities', function (Blueprint $table) {
            $table->increments('id');
			$table->string('name');
			$table->text('description')->nullable();
			$table->integer('creator_id')->unsigned()->index()->nullable();
			$table->string('email_filter')->nullable();
			$table->boolean('requires_activation')->default(false);
            $table->timestamps();
        });

		Schema::table('communities', function (Blueprint $table) {
			$table->foreign('creator_id')->references('id')->on('users')->onDelete('set null');
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
        Schema::dropIfExists('communities');
		Schema::enableForeignKeyConstraints();
    }
}
