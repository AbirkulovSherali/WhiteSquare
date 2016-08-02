$(document).ready(function(){

    $('#getGroupStudents').change(function(){
        var groupName = $('#getGroupStudents > option:selected').text();
        location.href = '/stud/group/' + groupName;
    });

    $('#group-for-ttable').change(function(){
        var groupName = $('#group-for-ttable > option:selected').text();
        if(groupName == "Выберите группу"){
            location.href = '/time-table';
        }
        else{
            location.href = '/time-table/group/' + groupName;
        }
    });

    /* Функция выводящая оповещения пользователю */
        function setError(error){
            $('.errors').remove();
            $('.container').prepend('<ul class="errors alert alert-danger" style="display: none">' +
                error
            + '</ul>');
            $('.errors').slideDown(500);
        }
    /* Функция выводящая оповещения пользователю */

    /* Функция выводящая оповещения пользователю */
        function removeError(){
            setTimeout(function(){
                $(".errors").slideUp(500, function(){
                    $(this).remove();
                });
                console.log();
            }, 5000);
        }
    /* Функция выводящая оповещения пользователю */

    /* Авторизация */
        $("#auth").click(function(){
            var login = $(".login").val();
            var password = $(".password").val();
            var typeUser = $(".typeUser:checked").val();
            var errors = "";

            if(!login) errors += "<li>Не заполнено поле с логином!</li>";
            if(!password) errors += "<li>Не заполнено поле с паролем!</li>";
            if(!typeUser) errors += "<li>Не выбран тип пользователя!</li>";

            if(errors){
                setError(errors);
            }
            else{
                $.ajax({
                    type: 'GET',
                    url: '/user-login',
                    data: {login: login, password: password, type_user: typeUser},
                    success: function(res){
                        if(res === 'Granted'){
                            location.href = '/'
                        }
                        else if(res === 'Failed'){
                            setError('<li>Неправильный логин или пароль либо не верно указан тип пользователя!</li>');
                        }
                    }
                });
            }

            removeError();
        });
    /* Авторизация */

    /* Обработка формы регистрации */
        $("#regUserBtn").click(function(){
            var userName = $("#userNameInput").val();
            var userEmail = $("#userEmailInput").val();
            var userLogin= $("#userLoginInput").val();
            var userPassword = $("#userPasswordInput").val();
            var typeUser = $("#userTypeInput").val();
            var chosenStud = $("#chosenStud").val();
            var group = $("#userGroupInput").val();
            var errors = "";
            var user = null;

            if(!userName) errors += "<li>Не заполнено поле с именем!</li>";
            if(!userLogin) errors += "<li>Не заполнено поле с логином!</li>";
            if(!userPassword) errors += "<li>Не заполнено поле с паролем!</li>";

            if(!userEmail){
                errors += "<li>Не заполнено поле с почтой!</li>";
            }
            else{
                var res = userEmail.search(/\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6}/ig);
                if(res == -1) errors += "<li>Не правильно заполнено поле для электронной почты!</li>";
            }

            if(typeUser === "null"){
                errors += "<li>Не выбран тип пользователя!</li>";
            }
            else{
                if(typeUser === "parent" && !chosenStud){
                    errors += "<li>Не выбран ваш сын или ваша дочь!</li>";
                }
                else if(typeUser === "student" && group === "null"){
                    errors += "<li>Не выбрана группа!</li>";
                }
            }

            if(errors){
                setError(errors);
            }
            else{
                user = {
                    name: userName,
                    email: userEmail,
                    login: userLogin,
                    password: userPassword,
                    type_user: typeUser
                }

                if(typeUser === "parent"){
                    user.chosen_stud = chosenStud;
                }
                else if(typeUser === "student"){
                    user.group_id = group;
                }

                $.ajax({
                    type: "GET",
                    url: "/user-reg",
                    data: user,
                    success: function(res){
                        if(res === "__SUCCESS__"){
                            $(".userRegForm").fadeOut(500, function(){
                                $('.container').prepend('<ul class="alert alert-success">' +
                                    '<li>Вы успешно подали заявку на регистрацию.</li>'
                                + '</ul>');
                            });
                        }
                        else if(res === "__MAIL_EXISTS__"){
                            setError("<li>Пользователь с такой электронной почтой уже существует! Введите другую электронную почту!</li>");
                        }
                        else if(res === "__LOGIN_EXISTS__"){
                            setError("<li>Пользователь с таким логином уже существует! Введите другой логин!</li>");
                        }
                        else if(res === "__FAILED__"){
                            setError("<li>" + res + "</li>");
                        }
                    }
                });
            }

            removeError();

            return false;
        });

        $("#userTypeInput").change(function(){
            var val = $(this).val();
            if(val === "parent"){
                $(".chosenStud").show();
                $(".userGroupInput").hide();
                $(".userGroupInput").val("null");
                $("#chosenStud").chosen({max_selected_options: 5});
            }
            else if(val === "student"){
                $(".userGroupInput").show();
                $(".chosenStud").hide();
            }
            else if(val === "null"){
                $(".userGroupInput").hide();
                $(".chosenStud").hide();
                $(".userGroupInput").val("null");
            }
        });
    /* Обработка формы регистрации */

    $("#addAttend").click(function(){
        var errors = "";
        var childId = null;
        var date = $("#dateAttend").val();

        if($("#chilrendStudents").length){
            childId = $("#chilrendStudents").val();
        }
        else if($("input[name='student_id']").length){
            childId = $("input[name='student_id']").val();
        }

        if(!date) errors += "<li class='errorText'>Заполните дату!</li>";
        if(!childId) errors += "<li class='errorText'>Выберите вашего студента!</li>";

        if(!errors){
            location.href = '/attend/view-attend/' + childId + '/' + date;
        }
        else{
            setError(errors);
        }
    });

    /* Изменения данных пользователя */
        $("#changeUser").click(function(e){
            e.preventDefault();
            var userName = $("#userName").val();
            var email = $("#email").val();
            var login = $("#userLogin").val();
            var password = $("#password").val();
            var repeatPassword = $("#repeatPassword").val();
            var role = $("#role").val();
            var userId = $("#userId").val();

            var errors = "";

            if(!userName) errors += "<li>Не заполнено поле с именем!</li>";
            if(!login) errors += "<li>Не заполнено поле с логином!</li>";
            if(!password) errors += "<li>Не заполнено поле с паролем!</li>";
            if(!repeatPassword) errors += "<li>Не заполнено поле с повторным паролем!</li>";
            if(password !== repeatPassword) errors += "<li>Не совпадают значения в полях для паролей</li>";
            if(!email){
                errors += "<li>Не заполнено поле с почтой!</li>";
            }
            else{
                var res = email.search(/\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6}/ig);
                if(res == -1) errors += "<li>Не правильно заполнено поле для электронной почты!</li>";
            }

            if(errors){
                $(".form-control").each(function(){
                    if(!$(this).val()){
                        $(this).css({
                            'border': '1px solid #D64D4B',
                        });
                    }
                    else{
                        $(this).css({
                            'border': '1px solid #cccccc'
                        });
                    }
                });

                setError(errors);
                removeError();
            }
            else {
                $.ajax({
                    url: "/change-info",
                    type: "GET",
                    data: {
                        user_name: userName,
                        email: email,
                        login: login,
                        password: password,
                        repeat_password: repeatPassword,
                        user_id: userId,
                        role: role
                    },
                    success: function(res){
                        if(res === "__SUCCESS__"){
                            $(".changeUserForm").fadeOut(500, function(){
                                $('.change-user').prepend('<ul class="alert alert-success">' +
                                    '<li>Ваши данные успешно изменены!</li><br>' +
                                    '<li><a href="/">На главную</a></li>'
                                + '</ul>');
                            });
                        }
                        else{
                            console.log(res);
                        }
                    }
                });
            }
        });

        $("#showPassword").click(function(){
            if($(this).is(":checked")){
                $("#password").attr("type", "text");
                $("#repeatPassword").attr("type", "text");
            }
            else{
                $("#password").attr("type", "password");
                $("#repeatPassword").attr("type", "password");
            }
        });
    /* Изменения данных пользователя */

});
