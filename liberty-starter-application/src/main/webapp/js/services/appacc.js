/*******************************************************************************
 * Copyright (c) 2016 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *******************************************************************************/

 //service for communicating with the app accelerator

angular.module('appAccelerator')
   .factory('appacc',
    [      '$log','$q','$http',
  function ($log,  $q,  $http) {
     $log.debug("Initialising AppAccelerator service");

     var serviceURL = "/start/api/v1";
     var techURL = serviceURL + "/tech";  //where to get the technology types from
     var dataURL = "/data?";              //tech=rest&deploy=local&name=libertyProject&workspace=642f3151-c9b6-4d5c-b185-4c29b8

     var getTechnologies = function() {
        $log.debug("AppAccelerator : GET : available technology list");

        var q = $q.defer();
        $http({
          url: techURL,
          method: 'GET'
          }).then(function(response) {
            // 200: technologies discovered
            $log.debug(response.status + ' ' + response.statusText + " %o - OK", response.data);
            var data = [];
            if ( response.status === 200 ) {
              data = angular.fromJson(response.data);
            }
            $log.debug("getTechnologies returning %o", data);
            q.resolve(data);
          }, function(response) {
            $log.debug(response.status + ' ' + response.statusText + " %o - FAILED", response.data);
            // TODO: Alert -- problem occurred
            // return empty set for decent experience, or could insert some default values here ...
            q.reject([]);
          });

          return q.promise;
      };

      var download = function(technologies) {

        var selected = undefined;   //the list of slected technologies
        for(var tech in technologies) {
          if(tech.selected) {
            if(selected) selected += "&";
            selected += ("tech=" + tech.id);
          }
        }
        if(selected) {
          //something has been selected, so proceed
          var url = serviceURL + selected;
          $log.debug("Downloading from " + url);
        } else {
          //something has gone wrong, nothing has been selected
        }
/*
          // Selected technologies
          var selectedTechnologies = $("#step1TechnologiesContainer .step1Technology.selected");
          var url = serviceURL + "/data?tech=";
          for(var i = 0; i < selectedTechnologies.size(); i++) {
              url += selectedTechnologies.get(i).dataset.technologyid;
              if(i + 1 < selectedTechnologies.size()) {
                  url += "&tech=";
              }
          }

          // Deploy location
          var deployLocation = $("#step2DeployLocationsContainer .step2DeployLocation.selected").data("value");
          url += "&deploy=" + deployLocation;

          // Project name
          var projectName = $("#step4NameInput").val();
          if(projectName != "") {
              url += "&name=" + projectName;
          } else {
              url += "&name=" + "libertyProject";
          }
      url += "&workspace=" + workspaceId;
      if(isSwaggerCodeGenerated()){
        url += "&techoptions=swagger:server";
      }
          window.location.assign(url);
          */
      };

      return {
        getTechnologies: getTechnologies,
        download : download
      };
  }]);
