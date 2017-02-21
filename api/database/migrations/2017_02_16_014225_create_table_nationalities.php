<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableNationalities extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('nationalities', function (Blueprint $table) {
            $table->increments('id');
			$table->string('identifier');
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
        Schema::dropIfExists('nationalities');
		Schema::enableForeignKeyConstraints();
    }
}
