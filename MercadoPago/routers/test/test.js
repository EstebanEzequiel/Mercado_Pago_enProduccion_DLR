var express = require('express');
var router = express.Router({ mergeParams: true });
var path = '/test/';
var func = require('../../server-functions');


router.get(path, async function (req, res) {
  func.appendLogs("Hola");
})

module.exports = router;