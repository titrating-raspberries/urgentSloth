angular.module('LocationService', [])

.factory('Location', ['$q', '$window', '$http', function($q, $window, $http) {

  var geoLocate = function() {
    return $q(function(resolve, reject) {
      if('geolocation' in $window.navigator) {
        $window.navigator.geolocation.getCurrentPosition(function(position) {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        }, reject);
      } else {
        reject(new Error('Geolocation is not supported'));
      }
    });
  };

  var reverseGeocode = function(coords) {
    return $q(function(resolve, reject) {
      var url = 'http://maps.google.com/maps/api/geocode/json?latlng=';
      url += coords.lat + ',' + coords.lng;
      $http.get(url).success(resolve).error(reject);
    });
  };

  var browser = function() {
    return $q(function(resolve, reject) {
      geoLocate()
        .then(reverseGeocode, reject)
        .then(function(reversed) {
          resolve(reversed.results[0].formatted_address);
        });
    });
  };

  var ip = function() {
    return $q(function(resolve, reject) {
      $http.get('http://freegeoip.net/json/')
        .success(function(res) {
          resolve(res.city + ', ' + res.region_code);
        }).error(reject);
    });
  };

  return {
    browser: browser,
    ip: ip,
  };
}]);
