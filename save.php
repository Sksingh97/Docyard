<?php

$fp = fopen('scene.json', 'w');
fwrite($fp, json_encode($_POST['data']));
fclose($fp);
echo "1";
?>
