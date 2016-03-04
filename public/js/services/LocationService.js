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
        }, function(err) {
          reject(err.message);
        });
      } else {
        reject('Geolocation is not supported');
      }
    });
  };

  var reverseGeocode = function(coords) {
    return $q(function(resolve, reject) {
      var url = 'https://maps.google.com/maps/api/geocode/json?latlng=';
      url += coords.lat + ',' + coords.lng;
      $http.get(url)
        .then(function(res) {
          resolve(res.data);
        })
        .catch(function() {
          reject('Error retrieving address from coords.');
        });
    });
  };

  var browser = function() {
    return $q(function(resolve, reject) {
      geoLocate()
      .then(reverseGeocode)
      .then(function(reversed) {
        resolve(reversed.results[0].formatted_address);
      })
      .catch(function(err) {
        reject(err);
      });
    });
  };

  var ip = function() {
    return $q(function(resolve, reject) {
      $http.get('https://freegeoip.net/json/')
        .then(function(res) {
          resolve(res.data.city + ', ' + res.data.region_code);
        })
        .catch(function() {
          reject('Error retrieving IP location.');
        });
    });
  };

  return {
    browser: browser,
    ip: ip,
  };
}]);
