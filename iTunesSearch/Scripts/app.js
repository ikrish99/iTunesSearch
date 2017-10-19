var app = angular.module('itunesSearch', ['ngMaterial', 'chart.js']);

var itunesApi = "https://itunes.apple.com/search?";

var mainController = function ($scope, $http) {

    $scope.showFilterUI = false;
    $scope.favoriteData = [];

    //JSON object to store filter selected options (Default to country-us and type -'')
    $scope.filters = [
        {
            country: '',
            type: ''
        }
    ];

    //JSON object for country options
    $scope.countryOptions = [
        {
            name: "USA",
            value: "us"
        },
        {
            name: "Canada",
            value: "ca"
        }
    ];

    //JSON object for type options
    $scope.typeOptions = [
        {
            name: "Movie",
            value: "movie"
        },
        {
            name: "Podcast",
            value: "podcast"
        },
        {
            name: "Music Viedo",
            value: "musicVideo"
        },
        {
            name: "Audio Book",
            value: "audiobook"
        },
        {
            name: "Short Film",
            value: "shortFilm"
        },
        {
            name: "Software",
            value: "software"
        },
        {
            name: "TV Show",
            value: "tvShow"
        }
    ];

    //Function to make response data distinct based on the JSON object id 
    function UniqueTheJson(collection, keyname) {
        var output = [],
            keys = [];

        angular.forEach(collection, function (item) {
            var key = item[keyname];
            if (keys.indexOf(key) === -1) {
                keys.push(key);
                output.push(item);
            }
        });
        return output;
    };

    //Function to hide/display filter in UI
    $scope.showFilter = function () {
        $scope.showFilterUI = !$scope.showFilterUI;
    };

    //Function used to search when user press enter key
    $scope.checkForEnter = function (event) {
        $scope.apiError = false;
        $scope.displayError = false;

        if (event.key == "Enter") {
            $scope.submitForSearch();
        }
    };

    //Function to store the filter selected value
    $scope.selectedFilters = function (key) {
        if (key == "country") {
            $scope.filters[0].country = $scope.selectedCountry;
        }
        else if (key == "type") {
            $scope.filters[0].type = $scope.selectedType;
        }
    }

    //Function to re remove the filters, which is selected
    $scope.removeFilter = function (tag) {
        if (tag == 'country') {
            $scope.filters[0].country = '';
            $scope.selectedCountry = '';
        } else if (tag == 'type') {
            $scope.filters[0].type = '';
            $scope.selectedType = '';
        }
    }

    //Function to get Analytics data from local host api.
    $scope.getAnalytics = function () {

        $http.get("http://localhost:63978/api/analytics/").then(function (data) {
            $scope.data = data.data;

            if ($scope.data.preview == 0 && $scope.data.collection == 0 && $scope.data.artist == 0 && $scope.data.search == 0) {
                $scope.graphShow = false;
            } else {
                $scope.graphShow = true;
                $scope.graphData = [$scope.data.preview, $scope.data.collection, $scope.data.artist, $scope.data.search];
                $scope.graphLabel = ['Preview', 'Collection', 'Artist', 'search'];
                $scope.graphColor = ['#803690', '#FDB45C', '#00ADF9', '#4D5360'];
                $scope.options = {};
            }
        }).catch(function (error) {
            console.log(error);
        });
    };

    //Function to post data on button click to local host
    $scope.postClick = function (value) {
        $http.post("http://localhost:63978/api/analytics/?buttonName=" + value).then(function (data) {
            console.log("Posted");
        }).catch(function (error) {
            console.log("error" + error);
        });
    };

    //Function for pagination, if the search result is more than 10 rows
    $scope.sortRecord = function (value) {
        var diff = $scope.resultCount - $scope.endNumber;
        if (value == "next") {
            if (diff > 10) {
                $scope.startNumber = $scope.startNumber + 10;
                $scope.endNumber = $scope.endNumber + 10;
            }
            else if (diff > 0) {
                $scope.startNumber = $scope.startNumber + 10;
                $scope.endNumber = $scope.endNumber + diff;
            }
        } else if (value == "prev") {
            if (diff == 0) {
                var diffValue = $scope.resultCount - $scope.startNumber;
                $scope.startNumber = $scope.startNumber - 10;
                $scope.endNumber = $scope.endNumber - diffValue;
            } else if ($scope.startNumber > 0) {
                $scope.startNumber = $scope.startNumber - 10;
                $scope.endNumber = $scope.endNumber - 10;
            }
        }

        var temp = [];
        for (var i = $scope.startNumber; i < ($scope.endNumber || $scope.resultCount); i++) {
            temp.push($scope.dataBackup[i]);
        }

        $scope.itunesData = temp;
    };

    //Function to call the iTunes public api based on the search value
    $scope.submitForSearch = function () {
        if ($scope.searchName != null && $scope.searchName != undefined && $scope.searchName != '' && $scope.searchName.length != 0) {

            var url = itunesApi + "term=" + $scope.searchName;

            if ($scope.filters[0].country != '') {
                url = url + "&country=" + $scope.filters[0].country;
            }

            if ($scope.filters[0].type != '') {
                url = url + "&entity=" + $scope.filters[0].type;
            }

            $scope.showFilterUI = false;
            $scope.nextButton = false;
            $scope.postClick("search");
            $scope.startNumber = 0;
            $scope.endNumber = 10;

            $http.get(url).then(function (data) {
                $scope.resultCount = data.data.resultCount;
                $scope.itunesData = data.data.results;
                $scope.itunesData = UniqueTheJson($scope.itunesData, 'collectionName');
                $scope.resultCount = $scope.itunesData.length;
                $scope.dataBackup = $scope.itunesData;

                if ($scope.resultCount == 0) {
                    $scope.displayError = true;
                    $scope.apiError = false;
                    $scope.display = false;
                }
                else if ($scope.resultCount > 10)
                {
                    $scope.sortRecord("");
                    $scope.displayError = false;
                    $scope.apiError = false;
                    $scope.display = true;
                    $scope.nextButton = true;
                }
                else
                {
                    $scope.displayError = false;
                    $scope.apiError = false;
                    $scope.display = true;
                }
            }).catch(function (error) {
                if (error.status >= 400 && error.status < 500) {
                    $scope.displayError = true;
                    $scope.apiError = false;
                    $scope.display = false;
                } else {
                    $scope.apiError = true;
                    $scope.displayError = false;
                    $scope.display = false;
                }
            })
        }
        else {
            console.log("Nothing Entered")
        }
    };

    //Function to add the favorite in my profile
    $scope.favoriteSelected = function (item, index) {
        if ($scope.itunesData[index].favoriteColor == undefined) {
            $scope.itunesData[index].favoriteColor = '';
            $scope.itunesData[index].favoriteColor = "selected";
            $scope.favoriteData.push(item);
        } else if ($scope.itunesData[index].favoriteColor == '') {
            $scope.itunesData[index].favoriteColor = "selected";
            $scope.favoriteData.push(item);
        } else {
            $scope.itunesData[index].favoriteColor = '';
            $scope.removeFavorite('', item.collectionId);
        }
        
    }

    //Function to remove favorite from my profile
    $scope.removeFavorite = function (index, collectionId) {
        if (index == '') {
            var i = 0;
            angular.forEach($scope.favoriteData, function (item) {
                if (item.collectionId == collectionId) {
                    index = i
                    return;
                }
                i++;
            });
        }
        $scope.favoriteData.splice(index, 1);
    }

    //Function to clear the whole page
    $scope.clearAllData = function () {
        $scope.itunesData = [];
        $scope.searchName = '';
        $scope.dataBackup = [];
        $scope.resultCount = '';
        $scope.nextButton = false;
        $scope.selectedType = '';
        $scope.selectedCountry = '';
        $scope.showFilterUI = false;
        $scope.filters = [
            {
                country: '',
                type: ''
            }
        ];
    }

}

app.controller('mainController', mainController);