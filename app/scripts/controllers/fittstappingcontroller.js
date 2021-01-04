//assuming size of experiment screen 720x360
function fittstappingController($scope,$window,$timeout){
$scope.experiment_flag=false;//true when exp starts
$scope.show_exp_exit=false;
$scope.close_btn_flag=false;
$scope.start_btn_flag=false;
$scope.result_btn_flag=false;
$scope.exp_trial = 1;
$scope.exp_trial_left = $scope.exp_trial;
$scope.fitts_tapping_target_size_array = [0.25,0.50,0.75,1.0,1.25,1.50,1.75,2.0];
$scope.fitts_tapping_target_distance_array = [2,3,4,5];
$scope.exp_taps=100;
$scope.current_trial=0;
$scope.fittstappingtargetlength=$scope.fitts_tapping_target_size_array[5];
$scope.fittstappingtargetdistance=$scope.fitts_tapping_target_distance_array[2];

$scope.convert_size_to_px=function(num){
	return (num*48)+"px"
}

var target_square_1 = document.getElementById("square_1");
var target_square_2 = document.getElementById("square_2");
//var experiment_screen = document.getElementById("ft_exp_section");

var target_width=$scope.convert_size_to_px($scope.fittstappingtargetlength);
var target_height=target_width;
var target_margin_distance = $scope.convert_size_to_px($scope.fittstappingtargetdistance);

target_square_1.style.marginTop = "192px";
target_square_2.style.marginTop = "192px";
target_square_1.style.marginLeft = "284px";//top corner dist

var attempt_correct = 0;
var attempt_incorrect = 0;
var startTime = new Date();
var endTime = new Date();
var response_time = endTime - startTime;
//for recording results
var trial_result_json={};
$scope.result_json = [];

$scope.create_target=function(target_size,target_distance){
	target_width = $scope.convert_size_to_px(target_size);
	target_height = $scope.convert_size_to_px(target_size);
	target_margin_distance = $scope.convert_size_to_px(target_distance);
	target_square_1.style.height = target_height;//1in=96px
	target_square_1.style.width = target_width;
	
	target_square_1.style.backgroundColor = "yellow";
	
	target_square_2.style.height = target_height;
	target_square_2.style.width = target_width;
	target_square_2.style.marginLeft = target_margin_distance;
	target_square_2.style.backgroundColor = "yellow";
	
}

$scope.change_target_size=function(){
	$scope.create_target($scope.fittstappingtargetlength, $scope.fittstappingtargetdistance);
}

$scope.change_target_distance=function(){
	$scope.create_target($scope.fittstappingtargetlength, $scope.fittstappingtargetdistance);
}

$scope.show_start_ft_experiment_modal=function(){
	$scope.start_btn_flag=true;
	$scope.ft_info_exp_modal_title = "Information message"
	$scope.ft_info_exp_modal_msg = "Start from the left target when it turns green.\nEach trial"
								+" must be 100 taps and results show the average time per tap. \n"
								+"Click on start button to begin experiment.";
	$scope.ft_modal_confirm_button_name = "Start";
	
	$("#ft_info_exp_Modal").modal("show");
}

$scope.start_ft_exp=function(){
	document.body.scrollTop = 0;
  	document.documentElement.scrollTop = 0;
	
	$scope.current_trial=$scope.current_trial+1;
	$timeout(function () {
		$scope.experiment_flag=true;
		target_square_1.style.backgroundColor = "green";
		target_square_2.style.backgroundColor = "red";
		startTime = new Date();
	},2000);
}


//call on click of new experiment
$scope.new_ft_experiment=function(){
	$window.location.reload();
}

$scope.click_target_square_1=function (){
	if ($scope.experiment_flag){
		if (target_square_1.style.backgroundColor=="green"){
			attempt_correct = attempt_correct+1;
		}else if (target_square_1.style.backgroundColor=="red"){
			attempt_incorrect = attempt_incorrect+1;
		}
	}
}

$scope.click_target_square_2=function(){
	if ($scope.experiment_flag){
		if (target_square_2.style.backgroundColor=="green"){
			attempt_correct = attempt_correct+1;
		}else if (target_square_2.style.backgroundColor=="red"){
			attempt_incorrect = attempt_incorrect+1;
		}
	}
}

$scope.click_outside_target=function(){
	if($scope.experiment_flag){
		$scope.exp_taps=$scope.exp_taps-1;//detect taps
		//detect click on which division
/*		document.addEventListener('click',function(e){
			if((e.target==target_square_1) || (e.target==target_square_2)){
				
				}else{
					attempt_incorrect = attempt_incorrect+1;
				}
		});*/
		//code to change colors of targets
		if (target_square_1.style.backgroundColor=="green"){
				target_square_1.style.backgroundColor = "red";
				target_square_2.style.backgroundColor = "green";
		}else if (target_square_1.style.backgroundColor=="red"){
				target_square_1.style.backgroundColor = "green";
				target_square_2.style.backgroundColor = "red";
		}
		
				if ($scope.exp_taps<=0){
					if($scope.current_trial<$scope.exp_trial){
						endTime = new Date();
						response_time=(endTime-startTime)/1000;
						$scope.experiment_flag=false;
						target_square_1.style.backgroundColor = "yellow";
						target_square_2.style.backgroundColor = "yellow";
						$scope.ft_info_exp_modal_msg = "Trial " + $scope.current_trial
												+" is completed. \n"
												+" Click on start button to begin next trial.";
						$scope.ft_modal_confirm_button_name = "Start";
						$("#ft_info_exp_Modal").modal("show");
						$scope.exp_taps=100;
						trial_result_json = {'trial': $scope.current_trial,
							'average_time': response_time/100,
							'error_count': 100-attempt_correct
							};
						$scope.result_json.push(trial_result_json);
						attempt_incorrect = 0;
						attempt_correct = 0;
					}else{
						$scope.experiment_flag=false;
						$scope.start_btn_flag=false;
						$scope.close_btn_flag = true;
						$scope.result_btn_flag = true;
						target_square_1.style.backgroundColor = "yellow";
						target_square_2.style.backgroundColor = "yellow";
						$scope.ft_info_exp_modal_title="Information";
						$scope.ft_info_exp_modal_msg = "Experiment"
													+" is completed. \n"
													+" Click on results button to view results.";
						endTime = new Date();
						response_time=(endTime-startTime)/1000;
						trial_result_json = {'trial': $scope.current_trial,
							'average_time': response_time/100,
							'error_count': 100-attempt_correct
							};
						$scope.result_json.push(trial_result_json);
						
						$scope.ft_modal_result_exp_button_name = "Export results";
						$("#ft_info_exp_Modal").modal("show");
				}
		}
	}//experiment_flag
}

$scope.confirm_exit_ft_experiment=function(){
	/*if ($scope.experiment_flag){
		$scope.ft_info_exp_modal_title="Information";
		$scope.ft_info_exp_modal_msg = "Experiment is incomplete. Are you sure?";
		$scope.ft_modal_exit_exp_confirm_button_name = "Yes";
		$scope.start_btn_flag = false;
		$scope.show_exp_exit = true;
		$scope.close_btn_flag = true;
		$("#ft_info_exp_Modal").modal("show");
	}*/
		if ($scope.experiment_flag){
		window.alert("Experiment is interrupted in between. Click on OK to restart the experiment.");
		$window.location.reload();
	}
}

$scope.export_results=function(){
	$("#ft_result_Modal").table2excel({
    // exclude CSS class
    exclude:".noExl",//colorClass
    name:"fitts tapping",
    filename:"fitts_tapping_task",//do not include extension
    fileext:".xls" // file extension
});
}

$scope.view_ft_exp_results=function(){
	$("#ft_result_Modal").modal("show");
}

$scope.exit_ft_exp=function(){
	$window.location.reload();
}


$scope.create_target($scope.fittstappingtargetlength, $scope.fittstappingtargetdistance);
};