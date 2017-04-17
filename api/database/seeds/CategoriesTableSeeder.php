<?php

use Illuminate\Database\Seeder;

use App\Models\Category;

class CategoriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
		Category::create([
			'name' => 'Smoke',
			'description' => ''
		]);
		
		Category::create([
			'name' => 'Lunch',
			'description' => ''
		]);
		
		Category::create([
			'name' => 'Drink',
			'description' => ''
		]);
		
		Category::create([
			'name' => 'Movie',
			'description' => ''
		]);
		
		Category::create([
			'name' => 'Video-game',
			'description' => ''
		]);
		
		Category::create([
			'name' => 'Chat',
			'description' => ''
		]);
		
		Category::create([
			'name' => 'Sport',
			'description' => ''
		]);
    }
}
