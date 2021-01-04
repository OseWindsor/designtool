/*https://developers.google.com/chart/interactive/docs/gallery/linechart#curving-the-lines*/
function learningCurveController($scope, $window,$timeout){
	$scope.experiment_flag=false;
	$scope.result_flag=false;
	$scope.show_info_text = false;
	$scope.processing_flag = false;
	$scope.method={
		"name": 1
	}
	
	$scope.regression_rows=10;
	$scope.result_display_flag=false;
	
	$scope.regression_point_array=[];
	var regression_point={'index':0,'cycle_number':null,'working_time':null};
	var data_point_x;
	var data_point_y;
	$scope.data_point_arr=[];
	
	var lc_canvas = document.getElementById('learning_curve');
	lc_canvas.width = 500;
	lc_canvas.height = 350;
	var ctx = lc_canvas.getContext('2d');
	var grid_x = 10;
	var grid_y = 10;
	var scale_x;
	var scale_y;
	
	$scope.create_target=function(){
		if($scope.method.name==1){
			$scope.lc_info_text = "On click of start experiment, You will be asked to enter two points and system will compute L.C";	
		}else if($scope.method.name==2){
			$scope.lc_info_text ="On click of start experiment, You will be asked to enter multiple points (minimum 10 and maximum 100) and system will compute L.C";
		}
		$scope.show_info_text = true;
	}
	
	$scope.remove_row=function(element_index){
		$scope.regression_point_array.splice(element_index,1);
	}
	
	$scope.add_row=function(){
		$scope.table_len = $scope.regression_point_array.length;
		if($scope.regression_rows>0){
			for(var i=$scope.table_len;i<$scope.table_len+$scope.regression_rows;i++){
				regression_point={'table_index':i,'cycle_number':null,'working_time':null};
				$scope.regression_point_array.push(regression_point);
			}
		}
	}
	
	$scope.start_lc_experiment=function(){
		$scope.show_info_text = false;
		$scope.experiment_flag=true;
		if($scope.method.name==1){
			$scope.cycle_num_point_1 = 50;
			$scope.cycle_time_point_1 = 20;
			$scope.cycle_num_point_2 = 100;
			$scope.cycle_time_point_2 = 15;
		}
		if($scope.method.name==2){
			$scope.add_row();
		}
	}
	
	$scope.compute_lc=function(){
		if($scope.method.name==1){
			$scope.compute_lc_1();
		}else if($scope.method.name==2){
			$scope.compute_lc_2();
		}
	}
	
	$scope.compute_lc_1=function(){
		$('#processing_spinner').show();
		if($scope.cycle_num_point_1<=0 || $scope.cycle_num_point_1==null
			|| $scope.cycle_time_point_1<=0 || $scope.cycle_time_point_1==null ||
			$scope.cycle_num_point_2<=0 || $scope.cycle_num_point_2==null
			|| $scope.cycle_time_point_2<=0 || $scope.cycle_time_point_2==null){
				$('#processing_spinner').hide();
				alert('There is not enough data to compute. Please enter all the datapoints and try again.');
		}else{
			$scope.lc_result = regression.exponential([[$scope.cycle_num_point_1,$scope.cycle_time_point_1],
								[$scope.cycle_num_point_2,$scope.cycle_time_point_2]], { order: 3 });
			$('#processing_spinner').hide();
		}
	}
	
/*https://github.com/Tom-Alexander/regression-js
https://www.youtube.com/watch?v=9rKuJrONnGQ*/
	$scope.compute_lc_2=function(){
	$('#processing_spinner').show();
	//to get rid of empty or negative rows
	if($scope.regression_point_array.length>0){
		for(var j=0;j<$scope.regression_point_array.length;j++){
			if($scope.regression_point_array[j]['cycle_number']<=0 || $scope.regression_point_array[j]['cycle_number']==null
			|| $scope.regression_point_array[j]['working_time']<=0 || $scope.regression_point_array[j]['working_time']==null){
				$scope.regression_point_array.splice(j,1);
				j=0;
			}
		}
			
	}
		//preparing data for least square regression
		if($scope.regression_point_array.length>1){
			for(var j=0;j<$scope.regression_point_array.length;j++){
				data_point_x=$scope.regression_point_array[j]['cycle_number'];//x
				data_point_y=$scope.regression_point_array[j]['working_time'];//y
				if(data_point_x>0 && data_point_y>0){
					$scope.data_point_arr.push([data_point_x,data_point_y]);
				}
				
			}
			$scope.data_point_arr.sort(function(a, b){return a[0] - b[0]});
			$scope.lc_result = regression.exponential($scope.data_point_arr, { order: 3 });
			console.log($scope.lc_result);
				
			var coefficent_1 = $scope.lc_result['equation'][0];
			var coefficent_2 = $scope.lc_result['equation'][1];
			if(coefficent_1==null || coefficent_1==undefined
				|| coefficent_2==null || coefficent_2==undefined){
				alert('Unable to plot learning curve due to invalid coefficents. Please re-perform the experiment');
			}else{
				$scope.plot_graph(coefficent_1,coefficent_2);
				$scope.result_display_flag=true;
			}
	
			$('#processing_spinner').hide();
		}else{
			$('#processing_spinner').hide();
			alert('There is not enough data to compute. Please enter atleast 2 positive datapoints and try again.');
		}
		
	}
	
	$scope.plot_graph=function(slope, intercept){
		draw_grids();//50x35
		drawAxis();//45x30
		scale_x = 35/($scope.data_point_arr[$scope.data_point_arr.length-1][0] - $scope.data_point_arr[0][0]);
		scale_y = 25/($scope.data_point_arr[$scope.data_point_arr.length-1][1] - $scope.data_point_arr[0][1]);
		if(scale_x<=0){
			scale_x=1/$scope.data_point_arr[$scope.data_point_arr.length-1][0];
		}
		if(scale_y<=0){
			scale_y=1/$scope.data_point_arr[$scope.data_point_arr.length-1][1];
		}
		ctx.beginPath();
		ctx.strokeStyle="red";
		var abs_x = parseInt(scale_x*$scope.data_point_arr[0][0]);
		var abs_y = parseInt(scale_y*$scope.data_point_arr[0][1]);
		ctx.moveTo(blocks(5+abs_x), blocks(30-abs_y));
		//ctx.strokeText($scope.data_point_arr[0][0].toString()+","+$scope.data_point_arr[0][1].toString(),blocks(5+$scope.data_point_arr[0][0]), blocks(32-$scope.data_point_arr[0][1]));
		for(var j=1;j<$scope.data_point_arr.length;j++){
			var exp_point_x = $scope.data_point_arr[j][0];
			var exp_point_y = $scope.data_point_arr[j][1];
			
			//ctx.strokeText(exp_point_x.toString()+","+exp_point_y.toString(),blocks(5+exp_point_x), blocks(32-exp_point_y));
			abs_x = parseInt(scale_x*exp_point_x);
			abs_y = parseInt(scale_y*exp_point_y);
			ctx.lineTo(blocks(5+abs_x), blocks(30-abs_y));
			ctx.stroke();
		}
		//plot the best fit line
		ctx.beginPath();
		ctx.strokeStyle="black";
		var fit_abs_x = parseInt(scale_x);
		var fit_abs_y = parseInt(slope*Math.exp(scale_x*intercept));
		ctx.moveTo(blocks(5+fit_abs_x), blocks(30-fit_abs_y));
		for(var j=2;j<100;j++){
			exp_point_x = scale_x*j;
			exp_point_y = slope*Math.exp(exp_point_x*intercept);
			
			//ctx.strokeText(exp_point_x.toString()+","+exp_point_y.toString(),blocks(5+exp_point_x), blocks(32-exp_point_y));
			fit_abs_x = parseInt(exp_point_x);
			fit_abs_y = parseInt(exp_point_y);
			ctx.lineTo(blocks(5+fit_abs_x), blocks(30-fit_abs_y));
			ctx.stroke();
		}
	}

	function draw_grids(){
		ctx.beginPath();
		while(grid_x<lc_canvas.height){
			ctx.moveTo(0,grid_x);
			ctx.lineTo(lc_canvas.width,grid_x);
			grid_x+=10;
		}
		while(grid_y<lc_canvas.width){
			ctx.moveTo(grid_y,0);
			ctx.lineTo(grid_y, lc_canvas.height);
			grid_y+=10;
		}
		ctx.strokeStyle="gray";
		ctx.stroke();
	}
	
	//35x25 grid coordinate
	function drawAxis(){
		ctx.beginPath();
		ctx.strokeStyle="black";
		ctx.moveTo(blocks(5), blocks(5));
		ctx.lineTo(blocks(5), blocks(30));
		ctx.moveTo(blocks(5), blocks(30));
		ctx.lineTo(blocks(40), blocks(30));
		ctx.stroke();
		ctx.moveTo(blocks(5), blocks(30));//origin
	}
	
	function blocks(count){
		return count*10;
	}
	
	function plot_blocks(count){
		return count*10;
	}
	
	$scope.exit_lc_experiment=function(){
		if($scope.experiment_flag){
			window.alert("Experiment is interrupted in between. Click on OK to restart the experiment.");
			$window.location.reload();
		}
	}
	
	$scope.create_target();
	
};