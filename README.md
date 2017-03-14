# i'll-b-there

## Webservice setup

 - [Composer](https://getcomposer.org/download/) is required to install the project.
 - You need a complete development environment with PHP 7, a webserver (Apache) and MySQL
 - You need a database in your MySQL installation for the project

 Laravel documentation (guide): https://laravel.com/docs/5.4

### Configuring Laravel setup

You only have to do the following once when you're installing the API on your computer for the first time.

```sh
composer install              # Install all the Laravel packages
cp .env.example .env          # Copy the default configuration file
php artisan key:generate      # Generates a new hashing key used to encrypt passwords and stuff
```

You then have to edit the `.env` file to match the information of your environment (mostly database credentials).

### Installing Laravel

You only have to do the following once on the first installation of Laravel on your desktop

```sh
php artisan migrate:refresh --seed    # Creates the database structure and fills it with test / default data
php artisan passport:install          # Generates the client keys for the OAuth2 authentication
```

### Updating Laravel after each pull

You have to launch those commands after every pull

```sh
composer update              # Updates the Laravel packages
php artisan migrate          # Updates the database structure
```

### Running the project

There is two solutions to run the webservice:

 1. You need a [virtualhost](https://www.digitalocean.com/community/tutorials/how-to-set-up-apache-virtual-hosts-on-ubuntu-14-04-lts) (should be pretty much the same on OS X) pointing to the `public` directory of the Laravel project. Once it is set up you can access the webservice through the URL you set in your virtualhost.
 2. Run the command `php artisan serve` and the project will be available on `http://localhost:8000`.

 ### Generating the documentation

 We use [apiDoc](http://apidocjs.com/) to generate the documentation. Run the following command to build the files:

 ```sh
 apidoc -i app/ -o public/docs/
 ```

 The documentation will be generated and available at http://path.to.illbthere.api/docs