function stroopTestController($scope,$window,$timeout){
$scope.experiment_flag=false;
$scope.exp_trial = 1;
$scope.current_trial = 0;
$scope.strooptestcondition=[];


$scope.stroop_target_condition_array = [{'id':1,'value':'Color-Words, No Interference'},
										{'id':2,'value':'Color-Words, Interference'},
										{'id':3,'value':'Color-NonWords, No Interference'},
										{'id':4,'value':'Color-NonWords, Interference'}];
$scope.strooptargetcondition = $scope.stroop_target_condition_array[0];

$scope.stroop_target_condition_cwni = [{'color':'red','value':'RED'},
										{'color':'aqua','value':'AQUA'},
										{'color':'green','value':'GREEN'},
										{'color':'blue','value':'BLUE'}];
										
$scope.stroop_target_condition_cwi = [{'color':'red','value':'RED'},{'color':'aqua','value':'RED'},
										{'color':'green','value':'RED'},{'color':'blue','value':'RED'},
										{'color':'red','value':'AQUA'},{'color':'aqua','value':'AQUA'},
										{'color':'green','value':'AQUA'},{'color':'blue','value':'AQUA'},
										{'color':'red','value':'GREEN'},{'color':'aqua','value':'GREEN'},
										{'color':'green','value':'GREEN'},{'color':'blue','value':'GREEN'},
										{'color':'red','value':'BLUE'},{'color':'aqua','value':'BLUE'},
										{'color':'green','value':'BLUE'},{'color':'blue','value':'BLUE'}];
										
$scope.stroop_target_condition_cnni = [{'color':'red','value':'RED'},{'color':'red','value':'DER'},
										{'color':'red','value':'ERD'},{'color':'red','value':'EDR'},
										{'color':'aqua','value':'AQUA'},{'color':'aqua','value':'QAAU'},
										{'color':'aqua','value':'UAQA'},{'color':'aqua','value':'AAUQ'},
										{'color':'green','value':'GREEN'},{'color':'green','value':'NEREG'},
										{'color':'green','value':'ENGRE'},{'color':'green','value':'REENG'},
										{'color':'green','value':'REGEN'},{'color':'green','value':'RENEG'},
										{'color':'green','value':'EEGRN'},{'color':'green','value':'EENGR'},
										{'color':'green','value':'EERGN'},{'color':'green','value':'EERNG'},
										{'color':'blue','value':'BLUE'},{'color':'blue','value':'ULBE'},
										{'color':'blue','value':'EUBL'},{'color':'blue','value':'EBUL'},
										{'color':'blue','value':'BELU'},{'color':'blue','value':'BUEL'},
										{'color':'blue','value':'LUBE'},{'color':'blue','value':'LBUE'},
										{'color':'blue','value':'LEBU'},{'color':'blue','value':'LEUB'}];
										
$scope.stroop_target_condition_cni = [{'color':'red','value':'EBUL'},{'color':'red','value':'EUBL'},
										{'color':'red','value':'REENG'}, {'color':'red','value':'QAAU'},
										{'color':'RED','value':'ENGRE'},
										{'color':'green','value':'QAAU'}, {'color':'aqua','value':'NEREG'},
										{'color':'aqua','value':'DER'},{'color':'aqua','value':'BELU'},
										{'color':'green','value':'EUBL'},{'color':'green','value':'UAAQ'},
										{'color':'green','value':'QAAU'},
										{'color':'green','value':'EBUL'},{'color':'green','value':'BELU'},
										{'color':'blue','value':'QAAU'},{'color':'blue','value':'DER'},
										{'color':'blue','value':'UAAQ'},{'color':'blue','value':'EUBL'},
										{'color':'blue','value':'ENGRE'},{'color':'blue','value':'NEREG'},
										{'color':'blue','value':'EDR'}];
										
var target_text_color = document.getElementById("target_text_color");
var target_index = 0;
var max;
var min=0;
var error_flag;

var startTime=new Date();
var endTime=new Date();
var responseTime;

var trial_result_json={};
$scope.result_json = [];
      
 $scope.target_condition=function(){
 	$scope.show_result_flag = false;
 	$scope.show_info_text=true;
 	if($scope.strooptargetcondition.id==1){
 		$scope.sr_info_text="Correct response is the color of the displayed word. The word will be the name of color. Please press the button with color that matches your response.";
 		$scope.active_choice_arr = $scope.stroop_target_condition_cwni;
 		max=$scope.stroop_target_condition_cwni.length;
 	}else if($scope.strooptargetcondition.id==2){
 		$scope.sr_info_text="Correct response is the displayed word which is the name of color. The word and color won't match. Please press the button with color that matches your response.";
 		$scope.active_choice_arr = $scope.stroop_target_condition_cwi;
 		max=$scope.stroop_target_condition_cwi.length;
 	}else if($scope.strooptargetcondition.id==3){
 		$scope.sr_info_text="Correct response is the color of the displayed word. The alphabets of words are mixed. Please press the button with color that matches your response.";
 		$scope.active_choice_arr = $scope.stroop_target_condition_cnni;
 		max=$scope.stroop_target_condition_cnni.length;
 	}else if($scope.strooptargetcondition.id==4){
 		$scope.sr_info_text="Correct response is the color of the displayed word. The word will be of different color to it's name. Please press the button with color that matches your response.";
 		$scope.active_choice_arr = $scope.stroop_target_condition_cni;
 		max=$scope.stroop_target_condition_cni.length;
 	}
 }
 
 $scope.start_st_experiment=function(){
 	if(!$scope.experiment_flag){
 		$scope.reset();
 	}
 	$scope.experiment_flag=true;
 	$scope.show_info_text=false;
 	$scope.current_trial = $scope.current_trial+1; 
 	$timeout(function(){
 		target_index = Math.floor(Math.random() * (max - min + 1)) + min;
 		$scope.wait_for_st_flag = true;
 		$scope.st_target_text = $scope.active_choice_arr[target_index]['value'];
 		target_text_color.style.color = $scope.active_choice_arr[target_index]['color'];
 		$scope.show_target = true;
 		startTime=new Date();
 	},2000);
 }
 
 $scope.action_response=function(target_choice_alias){
 	endTime=new Date();
 	responseTime=endTime-startTime;
 	$scope.wait_for_st_flag = false;
 	$scope.show_target = false;
 	if(target_choice_alias=="Z"){
 		if($scope.active_choice_arr[target_index]['color']=='red'){
 			error_flag = 'N';
 		}else{
 			error_flag = 'Y';
 		}
 		trial_result_json={'trial':$scope.current_trial,
 									'stimulus': $scope.active_choice_arr[target_index]['color'],
 									'response':'red',
 									'error':error_flag,
 									'response_time': responseTime/1000};
 		
 	}else if(target_choice_alias=="X"){
 		if($scope.active_choice_arr[target_index]['color']=='aqua'){
 			error_flag = 'N';
 		}else{
 			error_flag = 'Y';
 		}
 		trial_result_json={'trial':$scope.current_trial,
 									'stimulus': $scope.active_choice_arr[target_index]['color'],
 									'response':'aqua',
 									'error':error_flag,
 									'response_time': responseTime/1000};
 		
 	}else if(target_choice_alias=="V"){
 		if($scope.active_choice_arr[target_index]['color']=='green'){
 			error_flag = 'N';
 		}else{
 			error_flag = 'Y';
 		}
 		trial_result_json={'trial':$scope.current_trial,
 									'stimulus': $scope.active_choice_arr[target_index]['color'],
 									'response':'green',
 									'error':error_flag,
 									'response_time': responseTime/1000};
 		
 	}else if(target_choice_alias=="C"){
 		if($scope.active_choice_arr[target_index]['color']=='blue'){
 			error_flag = 'N';
 		}else{
 			error_flag = 'Y';
 		}
 		trial_result_json={'trial':$scope.current_trial,
 									'stimulus': $scope.active_choice_arr[target_index]['color'],
 									'response':'blue',
 									'error':error_flag,
 									'response_time': responseTime/1000};
 		
 	}
 	$scope.result_json.push(trial_result_json);
 	if($scope.current_trial<$scope.exp_trial){
	 	$scope.current_trial = $scope.current_trial+1;
	 	$timeout(function(){
	 		target_index = Math.floor(Math.random() * (max - min + 1)) + min;
	 		$scope.wait_for_st_flag = true;
	 		$scope.st_target_text = $scope.active_choice_arr[target_index]['value'];
	 		target_text_color.style.color = $scope.active_choice_arr[target_index]['color'];
	 		$scope.show_target = true;
	 		startTime = new Date();
	 	},2000);
 	}else if($scope.current_trial>=$scope.exp_trial){
 		$scope.experiment_flag=false;
 		$scope.show_info_text=false;
 		$scope.show_result_flag = true;
 	}
 }
 
 $scope.exit_st_experiment=function(){
	if ($scope.experiment_flag){
		window.alert("Experiment is interrupted in between. Click on OK to restart the experiment.");
		$window.location.reload();
	}
}

$scope.view_st_result=function(){
	$("#st_result_Modal").modal("show");
}

$scope.new_st_experiment=function(){
	$window.location.reload();
}

$scope.reset=function(){
	$scope.show_result_flag = false;
	trial_result_json={};
	$scope.result_json=[];
	$scope.current_trial = 0;
}
$scope.export_results=function(){
	$("#tblStroopTest").table2excel({
    // exclude CSS class
    exclude:".noExl",//colorClass
    name:"stroop_test",
    filename:"stroop_test_results",//do not include extension
    fileext:".xls" // file extension
  });

}

window.addEventListener('keydown', function (e) {
	if($scope.experiment_flag && $scope.wait_for_st_flag){
	    if (e.key === "z") {
			$("#action_response_1").click();
	    }
	    if (e.key === "x") {
			$("#action_response_2").click();
	    }
	    if (e.key === "c") {
			$("#action_response_3").click();
	    }
	    if (e.key === "v") {
			$("#action_response_4").click();
	    }
	}
}, false);


$scope.target_condition();
};