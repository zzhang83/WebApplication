window.onload = function(){
            var counter = 5;
            var interval = setInterval(function(){
                counter --;
                $("#time_count").text(counter);
                if(counter === 0){
                    redirect()
                    clearInterval(interval);

                }
            }, 1000);
        };

        function redirect() {
            document.getElementById("form_redirect").submit();
        }
