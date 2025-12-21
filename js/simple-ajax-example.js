$(function(){
    $(".existDay").click(function () {

        $('.existDay h2').css({ 'border' : '.7vw solid transparent', 'background' : 'transparent', 'color' : 'inherit', '-webkit-text-stroke-color' : 'inherit' });
        $(this).find('h2').css({ 'border' : '.7vw solid black', 'background' : 'black', 'color' : '#ff0034', '-webkit-text-stroke-color' : '#ff0034' });

        var today = new Date();
        //white today date
        $('.tableDay').each(function() {
            if( today.yyyymmdd() == $(this).data("date") )
                $(this).find('h2').css({ 'color' : 'white' });
        });

        $('.existDay').hover(function(){
            $('.existDay h2').css({ 'border' : '.7vw solid transparent' });
            $(this).find('h2').css({ 'border' : '.7vw solid black' });
        });

        // We'll pass this variable to the PHP function example_ajax_request
        var selected = $(this).data("date");

        // This does the ajax request
        $.ajax({
            url: example_ajax_obj.ajaxurl, // or example_ajax_obj.ajaxurl if using on frontend
            type: 'POST',
            data: {
                'action': 'example_ajax_request',
                'date' : selected
            },
            success:function(data) {
                // This outputs the result of the ajax request
                console.log(data);

                var obj = JSON.parse(data);

                // Function
                Date.prototype.yyyymmdd = function() {
                    var yyyy = this.getFullYear().toString();
                    var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
                    var dd  = this.getDate().toString();
                    return yyyy + "/" + (mm[1]?mm:"0"+mm[0]) + "/" + (dd[1]?dd:"0"+dd[0]); // padding
                };

                var date = new Date(obj.date);
                var weekday = new Array(7);
                weekday[0]="Sunday";
                weekday[1]="Monday";
                weekday[2]="Tuesday";
                weekday[3]="Wednesday";
                weekday[4]="Thursday";
                weekday[5]="Friday";
                weekday[6]="Saturday";
                var day = weekday[date.getDay()];
                var months = new Array(12);
                months[0]="Jan";
                months[1]="Feb";
                months[2]="Mar";
                months[3]="Apr";
                months[4]="May";
                months[5]="Jun";
                months[6]="Jul";
                months[7]="Aug";
                months[8]="Sep";
                months[9]="Oct";
                months[10]="Nov";
                months[11]="Dec";
                var month = months[date.getMonth()];
                var number  = date.getDate().toString();
                    number = number[1]?number:"0"+number[0];

                $(document).ready(function(){
                    $('#scheduleHeading h2').html(day + " " + number + "." + month);
                    $("#eventsList").html(obj.response);
                    Hyphenator.run();

                    console.log(today.yyyymmdd());
                });

            },
            error: function(errorThrown){
                console.log(errorThrown);
            }
        });

    });
});
