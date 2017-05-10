<?php
  ini_set('display_errors', 'On');
  error_reporting(E_ALL);

  class Server {
    private $relAddress = '/models/';

    public function serve() {
      $URI = str_replace($this->relAddress, '', $_SERVER['REQUEST_URI']);

      $method = $_SERVER['REQUEST_METHOD'];

      $explArr = explode('/', $URI);

      $object = $explArr[0];
      $id = '';

      if (count($explArr) >= 2) {
        $id = $explArr[1];
      }

      $item = NULL;

      switch ($method) {
        case 'GET':

        break;
        case 'PUT':

        break;
        case 'POST':

        break;
        case 'DELETE':

        break;
      }

      $this->response($item);
    }
  }
?>