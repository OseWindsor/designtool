function simplereactionTimeController($scope, $window, $timeout){
$scope.experiment_flag=false;
$scope.show_result_flag=false;
$scope.show_target = true;
$scope.exp_trial = 10;
$scope.target_color = {
        name: 'red'
      };
$scope.current_trial = 0;

var target_display_time=2000;
//for recording and displaying results
var trial_result_json={};
$scope.result_json = [];

// target parameters
var target_circle = document.getElementById("circle_target");
target_circle.style.marginTop = "192px";
target_circle.style.marginTop = "192px";
target_circle.style.marginLeft = "284px";

// for recording response time
var startTime = new Date();
var endTime = new Date();
var response_time = endTime - startTime;

$scope.create_target=function(){
	console.log($scope.target_color.name);
	target_circle.style.backgroundColor = $scope.target_color.name;
}

$scope.start_sr_experiment = function(){
	$scope.experiment_flag=true;
	$scope.show_target = false;
	$scope.show_info_text=true;
	$scope.current_trial = 0;
	$scope.result_json = [];
	$scope.sr_info_text="Get ready for the experiment. Hit the response button or z key in keyboard when target pops up.";
	$scope.current_trial = $scope.current_trial+1;
	$timeout(function(){
		$scope.show_info_text=false;
		$scope.wait_for_sr_flag = true;
		$scope.show_target = true;
		startTime = new Date();
	},target_display_time);
}

$scope.action_response = function(){
	endTime = new Date();
	responseTime = endTime-startTime;
	trial_result_json={'trial':$scope.current_trial,
							'response_time': responseTime/1000}
	$scope.result_json.push(trial_result_json);
	
	if($scope.current_trial<$scope.exp_trial){
		$scope.show_target = false;
		$scope.wait_for_sr_flag = false;
		$scope.current_trial = $scope.current_trial+1
		target_display_time = Math.floor(Math.random() * (4000 - 2000 + 1)) + 2000;
		$timeout(function(){
			$scope.wait_for_sr_flag = true;
			$scope.show_target = true;
			startTime = new Date();
		},target_display_time);
	}else{
		$scope.show_target = false;
		$scope.wait_for_sr_flag = false;
		$scope.show_info_text=true;
		$scope.sr_info_text="Experiment is completed. Click on view result button to see the results.";
		$scope.show_result_flag=true;
		$scope.experiment_flag=false;
	}
	
}

$scope.view_sr_result=function(){
	$("#sr_result_Modal").modal("show");
}
$scope.new_sr_experiment=function(){
	$window.location.reload();
}

$scope.exit_sr_experiment=function(){
	if ($scope.experiment_flag){
		window.alert("Experiment is interrupted in between. Click on OK to restart the experiment.");
		$window.location.reload();
	}
}

$scope.export_results=function(){
	$("#tblSimpleReaction").table2excel({
    // exclude CSS class
    exclude:".noExl",//colorClass
    name:"simple_reaction_time",
    filename:"simple_reaction_results",//do not include extension
    fileext:".xls" // file extension
  });

}

$scope.create_target($scope.target_color.name);

window.addEventListener('keydown', function (e) {
	if($scope.experiment_flag && $scope.wait_for_sr_flag){
	    if (e.key === "z") {
			$("#action_response").click();
	    }
	}
}, false);


};