function shortTermMemorySpanController($scope,$window,$interval){
$scope.show_result_flag= false;
$scope.exp_trial = 5;
$scope.exp_time_perd=20;
$scope.exp_memory_list_length=10;
$scope.current_trial = 0;
$scope.initial_mem_time = 8;
$scope.wait_time = $scope.exp_time_perd;
$scope.memorize_num = 0;
$scope.show_target = false;
$scope.experiment_flag = false;
$scope.next_flag = false;
var trial_result_json={};
$scope.result_json = [];
/*https://docs.angularjs.org/api/ng/service/$interval*/
var defined_interval;

$scope.display_rand_num=function(num_length){
	return Math.floor(Math.pow(10, num_length-1) + Math.random() * 9 * Math.pow(10, num_length-1))
}
	
	
$scope.start_stm_experiment = function(){
	if(!$scope.experiment_flag){
		$scope.reset();
	}
	$scope.initial_mem_time = 8;
	$scope.wait_time = $scope.exp_time_perd;
	$scope.current_trial = $scope.current_trial + 1;
	$scope.initial_time = 9;
	$scope.experiment_flag = true;
	$scope.memorize_num = $scope.display_rand_num($scope.exp_memory_list_length);
	defined_interval = $interval(function(){
		if ($scope.initial_mem_time>=0){
			$scope.show_mem_num_flag = true;
			$scope.stm_info_text = "You have "+$scope.initial_mem_time+" seconds to memorize below number";
			$scope.show_info_text = true;
			$scope.initial_mem_time = $scope.initial_mem_time-1
			if($scope.initial_mem_time==-1){
				$scope.show_mem_num_flag = false;
				$scope.show_info_text = false;
			}
		}else if($scope.wait_time>=0){
			$scope.stm_info_text = "Wait "+$scope.wait_time+" seconds before typing the memorized number in below box";
			$scope.show_info_text = true;
			$scope.wait_time = $scope.wait_time-1;	
			if($scope.wait_time==-1){
				document.getElementById("user_memorize_num").focus();
				$scope.stm_info_text = "Type the number below"
				$interval.cancel(defined_interval);
				$scope.show_target = true;
			}
		}
	},1000);
	
	$scope.record_stm_experiment=function(){
		
		if($scope.memorize_num==$scope.user_memorize_num){
			trial_result_json = {'trial':$scope.current_trial,
								'asked_num': $scope.memorize_num,
								'user_input_num':$scope.user_memorize_num,
								'response': 'correct'};
			$scope.result_json.push(trial_result_json);
		}else if($scope.memorize_num!=$scope.user_memorize_num){
			trial_result_json = {'trial':$scope.current_trial,
								'asked_num': $scope.memorize_num,
								'user_input_num':$scope.user_memorize_num,
								'response': 'incorrect'};
			$scope.result_json.push(trial_result_json);
		}
		$scope.user_memorize_num = null;
		if ($scope.current_trial < $scope.exp_trial){
			$scope.show_target = false;
			$scope.show_mem_num_flag = false;
			$scope.stm_info_text = "Answer is recorded. Click on next to continue.";
			$scope.show_info_text = true;
			$scope.next_flag = true;
		}else if($scope.current_trial == $scope.exp_trial){
			$scope.show_target = false;
			$scope.show_mem_num_flag = false;
			$scope.stm_info_text = "Experiment is completed. Click on view result button to see the results.";
			$scope.show_info_text = true;
			$scope.show_result_flag = true;
			$scope.experiment_flag=false;
		}
	}
}

$scope.view_stm_result=function(){
	$("#stm_result_Modal").modal("show");
}
$scope.exit_stm_experiment=function(){
if ($scope.experiment_flag){
		window.alert("Experiment is interrupted in between. Click on OK to restart the experiment.");
		$window.location.reload();
	}
}
$scope.new_stm_experiment=function(){
	$window.location.reload();
}

	$scope.next_stm_experiment=function(){
		$scope.show_info_text = false;
		$scope.next_flag = false;
		$scope.start_stm_experiment();
	}
	
	//call the plugin: https://www.geeksforgeeks.org/jquery-table2excel-plugin/
$scope.export_results=function(){
	$("#tblShortTermMemory").table2excel({
    // exclude CSS class
    exclude:".noExl",//colorClass
    name:"short_term_memory_span",
    filename:"short_term_memory_span_results",//do not include extension
    fileext:".xls" // file extension
  });

}

$scope.reset=function(){
	$scope.current_trial = 0;
	trial_result_json={};
	$scope.result_json = [];
	$scope.show_result_flag = false;
	$scope.show_target = false;
	$scope.next_flag = false;
}


};