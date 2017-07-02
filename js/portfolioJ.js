(function($){
$(document).ready(function(){
   $(document).on('click','.paginat ul li a',function(){
     $(document).scrollTop(510);
   });
   $('.media-left').livequery(function(){
     $(this).find('div').zoom();
   });
});
})(jQuery)
