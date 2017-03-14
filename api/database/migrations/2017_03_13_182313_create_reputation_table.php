<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateReputationTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('reputation', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->integer('activity_id');
            $table->integer('rator_id');
            $table->integer('ratee_id');
            $table->double('rating');
        });

        Schema::table('reputation', function (Blueprint $table) {
            $table->foreign('activity_id')->references('id')->on('activities')->onDelete('set null');
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
        Schema::dropIfExists('reputation');
        Schema::enableForeignKeyConstraints();
    }
}
