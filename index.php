<?php

/**
 *Travis status board
 */
function includeIfExists($file)
{
    if (file_exists($file)) {
        return include $file;
    }
}

if ((!$loader = includeIfExists(__DIR__.'/vendor/autoload.php')) && (!$loader = includeIfExists(__DIR__.'/../../autoload.php'))) {
    die('You must set up the project dependencies, run the following commands:'.PHP_EOL.
        'curl -sS https://getcomposer.org/installer | php'.PHP_EOL.
        'php composer.phar install'.PHP_EOL);
}

use Symfony\Component\Yaml\Yaml;

$config = json_encode(Yaml::parse(file_get_contents('config.yml')));

?>

<html>
    <head>
        <title>Status board</title>
        <meta http-equiv="refresh" content="60" >
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.5/css/bootstrap.min.css">
        <link rel="stylesheet" href="app.css">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.1.4/vue.js"></script>
    </head>
    <body>
        <div class="container">
            <div class="row">
                <div id="app">
                    <ul class="list-unstyled">
                        <project v-for="project in repositories" v-bind:project="project"></project>
                    </ul>
                </div>
            </div>
        </div>
        <div id="config" class="hidden">
            <?php echo $config; ?>
        </div>
        <script type="text/x-template" id="project-template">
            <li :class="manageClasses">
                <span class="name">{{ project.name }}</span>
                <span class="branch">{{ project.default_branch.name }}</span>
                <span class="commit">{{ project.default_branch.last_build.commit.sha|commit }}</span>
                <span class="since">{{ since }} ago</span>
            </li>
        </script>
        <script type="text/javascript" src="app.js"></script>
    </body>
</html>
