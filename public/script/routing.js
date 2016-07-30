$(document).ready(function(){
	$("#shop_tab").show();
	$(".myshop").addClass("active");
    
    $("#a_status").show();
    $(".status").addClass("active");
});

function loadPage(page) {
    
    $(function() {
       $('body').scrollTop(0);
    });
    
	$("#shop_tab").hide();
	$("#cart_tab").hide();
	$("#orders_tab").hide();
	$("#checkout_tab").hide();
	$("#success_tab").hide();
	$("#failure_tab").hide();
	$("#"+page+"_tab").show();
	$(".mytab").removeClass("active");
	$(".my"+page).addClass("active");
}

function loadAdminPage(page) {
    
    $(function() {
       $('body').scrollTop(0);
    });
    
    $("#people_r").hide();
    $("#inv_r").hide();
    $("#search_n").val('');
    $("#search_o").val('');
    $("#search_i").val('');
    
    $("#a_status").hide();
    $("#a_orders").hide();
    $("#a_inventory").hide();
    $("#a_people").hide();
    $("#a_"+page).show();
    $(".mytab").removeClass("active");
	$("."+page).addClass("active");
}