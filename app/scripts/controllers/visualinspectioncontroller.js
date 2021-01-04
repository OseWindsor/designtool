//1in	96 pixel (X)
function visualinspectionController($scope, $window, $timeout){
// position to render resistor before start of experiment
	
	var resistor_width = 96;
	var resistor_height = 20;
	var resistor_linewidth = 1;
	var resistor_linecolor = "blue";
	var resistor_fillcolor = "red"
	var leftline_length = 50;
	var rightline_length = 50;
	var resistor_length_min_limit = 50;
	var resistor_length_max_limit = 1.2*resistor_length_min_limit //120%
	$scope.exp_trial = 1;
	$scope.experiment_flag=false;//indicates if experiment is running
	$scope.show_modal_confirm = false;
	$scope.show_info_test = false;
	$scope.resistor_length=0.8;
	$scope.left_trials = 1;
	$scope.show_result_flag = false;
	$scope.wait_for_resistor_flag=false;
	

	var elem = document.getElementById('vi_square');
    var vi_canvas = new Two({
        type: Two.Types.canvas,
        fullscreen: false,
		width: 720,
		height: 360
    });
	vi_canvas.appendTo(elem);
	
	var initial_resistor_left_margin = vi_canvas.width*0.5;
	var initial_resistor_top_margin = vi_canvas.height*0.5;
	var initial_resistor_left_margin_min = 240;
	var initial_resistor_top_margin_min = 150;
	var initial_resistor_left_margin_max = 480;
	var initial_resistor_top_margin_max = 240;
	// for recording response time
	var startTime = new Date();
	var endTime = new Date();
	var response_time = endTime - startTime;
	//for recording lead difference
	var lead_dif=0;
	//for recording results
	var trial_result_json={};
	$scope.result_json = [];
// inspired from https://medium.com/dev-bits/programming-dynamic-drawings-animations-with-angular-js-and-two-js-9d2ec1ce2580

//write a function to be called, when 0.8" is selected on radio button
$scope.create_resistor=function(option_selected){
	vi_canvas.clear();
	//code to draw rectangle center_x,center_y,width,height
	
	var rect = vi_canvas.makeRectangle(initial_resistor_left_margin, initial_resistor_top_margin, (option_selected*resistor_width), resistor_height);
	// linewidth property sets width of the line
	rect.linewidth = resistor_linewidth;
	// stroke property sets the color
	rect.stroke = resistor_linecolor;
	rect.fill = resistor_fillcolor;
	
	// code to draw left line
	var left_line = vi_canvas.makeLine((initial_resistor_left_margin-((option_selected*resistor_width)*0.5))-leftline_length,
									initial_resistor_top_margin, 
									(initial_resistor_left_margin-((option_selected*resistor_width)*0.5)), 
									initial_resistor_top_margin);
	// linewidth property sets width of the line
	left_line.linewidth = resistor_linewidth;
	// stroke property sets the color
	left_line.stroke = resistor_linecolor;
	
	// code to draw right line
	var right_line = vi_canvas.makeLine((initial_resistor_left_margin+((option_selected*resistor_width)*0.5)), 
										initial_resistor_top_margin, 
										(initial_resistor_left_margin+((option_selected*resistor_width)*0.5))+rightline_length, 
										initial_resistor_top_margin);
	// linewidth property sets width of the line
	right_line.linewidth = resistor_linewidth;
	// stroke property sets the color
	right_line.stroke = resistor_linecolor;
	
	vi_canvas.update();
}


$scope.start_vi_main=function(){
		$timeout(function () {
			leftline_length = Math.floor(Math.random() * (resistor_length_max_limit - resistor_length_min_limit + 1)) + resistor_length_min_limit;
			rightline_length = Math.floor(Math.random() * (resistor_length_max_limit - resistor_length_min_limit + 1)) + resistor_length_min_limit;
		    initial_resistor_left_margin = Math.floor(Math.random() * (initial_resistor_left_margin_max - initial_resistor_left_margin_min + 1)) + initial_resistor_left_margin_min;
			initial_resistor_top_margin = Math.floor(Math.random() * (initial_resistor_top_margin_max - initial_resistor_top_margin_min + 1)) + initial_resistor_top_margin_min;
			lead_dif = (Math.abs(rightline_length-leftline_length)*100)/Math.min(rightline_length,leftline_length);
			lead_dif = Math.round(lead_dif*100)/100;//upto 2 decimal places
			$scope.create_resistor($scope.resistor_length);
			startTime = new Date();
			$scope.wait_for_resistor_flag=true;
	  }, 2000);
}

/* This method is called
on click of start experiment
*/
$scope.start_vi_experiment=function(){
	document.body.scrollTop = 0;
  	document.documentElement.scrollTop = 0;
	$scope.show_result_flag = false;
	if ($scope.exp_trial>0){
		$scope.left_trials=$scope.exp_trial;
		vi_canvas.clear();
		vi_canvas.update();
		$scope.show_info_text = true;
		$scope.vi_info_text = "Get Ready for the Experiment";
		$scope.result_json = [];
		$scope.experiment_flag=true;
		$timeout(function () {
		    $scope.show_info_text = false;
			$scope.start_vi_main();
	  }, 2000);
	}else{
		$scope.vi_info_modal_title="Error!";
		$scope.vi_info_modal_msg = "Number of trials should be a positive number";
		$("#vi_info_Modal").modal("show");
	}
	
}

$scope.exit_vi_experiment=function(){
	if ($scope.experiment_flag){
		window.alert("Experiment is interrupted in between. Click on OK to restart the experiment.");
		$window.location.reload();
	}
}

$scope.reset_exp=function(){
	$window.location.reload();
}

$scope.action_equal=function(){
	vi_canvas.clear();
	vi_canvas.update();
	$scope.wait_for_resistor_flag=false;
	if ((0<$scope.left_trials) && ($scope.left_trials<=$scope.exp_trial)){
		endTime = new Date();
		response_time = (endTime-startTime)/1000;
		trial_result_json = {'trial':$scope.exp_trial-$scope.left_trials+1,
							'response_time':response_time,
							'response':'equal',
							'lead_difference':lead_dif};
		$scope.result_json.push(trial_result_json);
		$scope.left_trials=$scope.left_trials-1;
		if($scope.left_trials==0){
			$scope.call_experiment_complete();
		}else{
			$scope.start_vi_main();
		}
		
	}else{
		$scope.call_experiment_complete();
	}
}

$scope.action_unequal=function(){
	vi_canvas.clear();
	vi_canvas.update();
	$scope.wait_for_resistor_flag=false;
	if ((0<$scope.left_trials) && ($scope.left_trials<=$scope.exp_trial)){
		//record the result
		endTime = new Date();
		response_time = (endTime-startTime)/1000;
		trial_result_json = {'trial':$scope.exp_trial-$scope.left_trials+1,
							'response_time':response_time,
							'response':'unequal',
							'lead_difference':lead_dif};
		$scope.result_json.push(trial_result_json);
		
		$scope.left_trials=$scope.left_trials-1;
		if($scope.left_trials==0){
			$scope.call_experiment_complete();
		}else{
			$scope.start_vi_main();
		}
	}else{
		$scope.call_experiment_complete();
	}
}

//call on click of new experiment
$scope.new_vi_experiment=function(){
	$window.location.reload();
}

$scope.view_vi_result=function(){
	$("#vi_result_Modal").modal("show");
}

//call the plugin: https://www.geeksforgeeks.org/jquery-table2excel-plugin/
$scope.export_results=function(){
	$("#tblVisualInspection").table2excel({
    // exclude CSS class
    exclude:".noExl",//colorClass
    name:"visual_inspection",
    filename:"visual_inspection_results",//do not include extension
    fileext:".xls" // file extension
  });

}


$scope.call_experiment_complete=function(){
	$scope.show_info_text = true;
	$scope.vi_info_text = "Experiment Completed";
	$scope.show_result_flag = true;
	$scope.experiment_flag=false;
}

//call on load
$scope.create_resistor($scope.resistor_length);

window.addEventListener('keydown', function (e) {
	if($scope.experiment_flag && $scope.wait_for_resistor_flag){
	    if (e.key === "z") {
			$("#action_equal").click(); 
	    }
	    else if (e.key === "/") {
	        $("#action_unequal").click(); 
	    }
	}
}, false);



}