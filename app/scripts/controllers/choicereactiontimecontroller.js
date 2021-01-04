function choicereactiontimeController($scope, $window, $timeout){
$scope.experiment_flag=false;
$scope.show_result_flag=false;
$scope.show_info_text = false;
$scope.show_target = true;
$scope.wait_for_cr_flag = false;
$scope.exp_trial = 10;
$scope.target_alternative = {
        options: '2'
      };

$scope.current_trial = 0;
$scope.cr_target_num = 4;
var additional_cr_info_text = "4 or 5";

// target parameters
var target_choice = document.getElementById("alternate_target_options");
target_choice.style.marginTop = "192px";
target_choice.style.marginTop = "192px";
target_choice.style.marginLeft = "284px";

var min = 4;
var max = 5;

//for recording and displaying results
var trial_result_json={};
$scope.result_json = [];

var startTime = new Date();
var endTime = new Date();
var responseTime = endTime-startTime;

$scope.start_cr_experiment=function(){
	$scope.experiment_flag=true;
	$scope.current_trial = 0;
	$scope.show_target = false;
	$scope.show_info_text = true;
	$scope.show_result_flag=false;
	$scope.current_trial = $scope.current_trial+1
	$scope.cr_info_text="Get ready for the experiment. Hit the respective number key which pops up in the screen. The numbers visible in the screen will be "+ additional_cr_info_text;
	$timeout(function(){
		$scope.show_info_text = false;
		$scope.wait_for_cr_flag = true;
		$scope.cr_target_num = Math.floor(Math.random() * (max - min + 1)) + min;
		$scope.show_target = true;
		startTime = new Date();
	},2000);	
}

$scope.action_response = function(arg_num){
	$scope.show_target = false;
	endTime = new Date();
	responseTime = endTime-startTime;
	if (arg_num == $scope.cr_target_num){
			trial_result_json = {'trial': $scope.current_trial,
								'response_time': responseTime/1000,
								'response': 'correct'
					};
			$scope.result_json.push(trial_result_json);
		}else{
			trial_result_json = {'trial': $scope.current_trial,
								'response_time': responseTime/1000,
								'response': 'Incorrect'
					};
			$scope.result_json.push(trial_result_json);
		}
	if ($scope.current_trial<$scope.exp_trial){
		$scope.current_trial = $scope.current_trial+1
		
		$timeout(function(){
				$scope.wait_for_cr_flag = true;
				$scope.cr_target_num = Math.floor(Math.random() * (max - min + 1)) + min;
				$scope.show_target = true;
				startTime = new Date();
			},2000);
	}else{
		$scope.show_target = false;
		$scope.wait_for_cr_flag = false;
		$scope.show_info_text=true;
		$scope.cr_info_text="Experiment is completed. Click on view result button to see the results.";
		$scope.show_result_flag=true;
		$scope.experiment_flag=false;
	}
	
}

$scope.exit_cr_experiment=function(){
	if ($scope.experiment_flag){
		window.alert("Experiment is interrupted in between. Click on OK to restart the experiment.");
		$window.location.reload();
	}
}

$scope.view_cr_result=function(){
	$("#cr_result_Modal").modal("show");
}
$scope.new_cr_experiment=function(){
	$window.location.reload();
}

$scope.export_results=function(){
	$("#tblChoiceReaction").table2excel({
    // exclude CSS class
    exclude:".noExl",//colorClass
    name:"choice_reaction_time",
    filename:"choice_reaction_results",//do not include extension
    fileext:".xls" // file extension
  });

}

$scope.create_target=function(){
	if($scope.target_alternative.options == 4){
		$scope.alternative_option_info = "use index and middle fingers of both hands for the four alternative experiment";
		additional_cr_info_text = "between 3 to 6";
		min = 3;
		max= 6;
	} else if($scope.target_alternative.options == 8){
		$scope.alternative_option_info = "use all fingers except thumbs for the eight alternative experiment";
		additional_cr_info_text = "between 1 to 8";
		min = 1;
		max= 8;
	} else if($scope.target_alternative.options == 2){
		$scope.alternative_option_info = "Use index fingers for the two alternative experiment";
		additional_cr_info_text = "4 or 5";
		min = 4;
		max= 5;
	}
}


$scope.create_target();

window.addEventListener('keydown', function (e) {
	if($scope.experiment_flag && $scope.wait_for_cr_flag){
	    if (e.key === "1" && $scope.target_alternative.options==8) {
			$("#action_response_1").click();
	    }
	    if (e.key === "2" && $scope.target_alternative.options==8) {
			$("#action_response_2").click();
	    }
	    if (e.key === "3" && $scope.target_alternative.options!=2) {
			$("#action_response_3").click();
	    }
	    if (e.key === "4") {
			$("#action_response_4").click();
	    }
	    if (e.key === "5") {
			$("#action_response_5").click();
	    }
	    if (e.key === "6" && $scope.target_alternative.options!=2) {
			$("#action_response_6").click();
	    }
	    if (e.key === "7" && $scope.target_alternative.options==8) {
			$("#action_response_7").click();
	    }
	    if (e.key === "8" && $scope.target_alternative.options==8) {
			$("#action_response_8").click();
	    }
	}
}, false);


};