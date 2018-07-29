

scene_data=[];
var room = 0;
function form_fields() {
	for(i=room;i>0;i--){
		$('#submit').css("display","none");
        $('#lable').css("display","none");
		$('.removeclass'+i).remove();
	   }
	   room=0;
	count = $('#rack').val();
	if(count>0){
		$('#submit').css("display","inline");
        $('#lable').css("display","inline");
		for(i=0;i<count;i++){
		room++;
		var objTo = document.getElementById('form_fields')
		var divtest = document.createElement("div");
		divtest.setAttribute("class", "form-group removeclass"+room);
		var rdiv = 'removeclass'+room;
		divtest.innerHTML = `
        <div class="col-sm-3 nopadding">
            <div class="form-group"> 
                <input type="text" class="form-control name-${room}" id="RackName" name="RackName[]" value="Rack ${room}" placeholder="School name">
            </div>
        </div>
        <div class="col-sm-3 nopadding">
            <div class="form-group"> 
                <input type="number" class="form-control comp-${room}" id="Compartment" name="Compartment[]" value="0" placeholder="Number Of Compartment">
            </div>
        </div>
        <div class="col-sm-3 nopadding">
            <div class="form-group"> 
                <input type="number" class="form-control div-${room}" id="Division" name="Division[]" value="0" placeholder="Number Of Partition Per Compartment">
            </div>
        </div>
        <div class="col-sm-3 nopadding">
            <div class="form-group">
                <div id="cp2${room}" class="input-group colorpicker-component">
                    <input type="text" value="#00AABB" class="form-control col-${room}" /> 
                        <span class="input-group-addon"><i></i></span>
                </div>
            </div>
        </div>`;
		
		objTo.appendChild(divtest)
        $('#cp2'+room).colorpicker()
 }
	}else{
		$('#submit').css("display","none");
        $('#lable').css("display","none");
	}
 
    
}
   function fetch_data(){
	   for(i=1;i<=room;i++){
           scene_data[i-1]={
               name:($(`.name-${i}`).val()=="")?"Rack-1":$(`.name-${i}`).val(),
               compartment:($(`.div-${i}`).val()=="")?0:$(`.div-${i}`).val(),
               division:($(`.comp-${i}`).val()=="")?0:$(`.comp-${i}`).val(),
               color:($(`.col-${i}`).val()=="")?0:$(`.col-${i}`).val(),
           }
	   }
       $.ajax({
        type: 'POST',
        data: {data:scene_data},
        url: 'save.php',
        success: function(data){
            if(data){
                window.location="http://localhost/Docyard/Scene.html";
            }
        },
        error: function(e){
            console.log("error"+JSON.stringify(e));
        }
    });
   }
