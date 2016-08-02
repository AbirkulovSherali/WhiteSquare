$(document).ready(function(){

    $("#getGroupStudents").on("change", function(){
        var groupId = $(this).val();
        if(groupId){
            location.href = "/students/group/" + groupId;
        }
    });

    $(".removeStudent").click(function(){
        var res = confirm("Удалить студента?");
        if(!res) return false;
        var studentId = $(this).attr('studentId');
        $.ajax({
            type: "get",
            url: '/students/drop',
            data: {student_id: studentId},
            success: function(res){
                if(res){
                    console.log(res);
                    $("tr").children("td:contains('" + res + "')").parent().remove();
                }
            }
        });
        return false;
    });

    /* Множественное удаление студентов */
        var checkedStudents = [];
        $(".checkedStudent").click(function(){
            if($(this).is(":checked")){
                checkedStudents.push($(this).val());
            }
            else{
                checkedStudents.pop();
            }

            if(checkedStudents.length > 0){
                $("#dropCheckedStudents").stop().fadeIn(500);
            }
            else{
                $("#dropCheckedStudents").stop().fadeOut(500);
            }
        });

        $("#dropCheckedStudents").click(function(){
            var res = confirm("Удалить отмеченных студентов?");
            if(!res) return false;
            var studentsId = checkedStudents.join(", ");
            $.ajax({
                url: "/students/drop",
                type: "GET",
                data: {checkedStudents: studentsId},
                success: function(res){
                    if(res === "Dropped"){
                        $(".checkedStudent:checked").parent().parent().remove();
                        checkedStudents = [];
                        $("#dropCheckedStudents").fadeOut();
                    }
                    else if(res === "Failed"){
                        console.log(res);
                    }
                },
            });
        });
    /* Множественное удаление студентов */

    /* Множественное удаление предметов */
        var checkedSubjects = [];
        $(".checkedSubject").click(function(){
            if($(this).is(":checked")){
                checkedSubjects.push($(this).val());
            }
            else{
                checkedSubjects.pop();
            }

            if(checkedSubjects.length > 0){
                $("#dropCheckedSubjects").stop().fadeIn(500);
            }
            else{
                $("#dropCheckedSubjects").stop().fadeOut(500);
            }
        });

        $("#dropCheckedSubjects").click(function(){
            var res = confirm("Удалить предметы?");
            if(!res) return false;
            checkedSubjects = checkedSubjects.join(", ");
            $.ajax({
                url: "/subjects/drop",
                type: "GET",
                data: {checkedSubjects: checkedSubjects},
                success: function(res){
                    if(res === "Dropped"){
                        $(".checkedSubject:checked").parent().parent().remove();
                        checkedSubjects = [];
                        $("#dropCheckedSubjects").fadeOut();
                    }
                    else if(res === "Failed"){
                        console.log(res);
                    }
                },
            });
        });
    /* Множественное удаление предметов */

    $('#group-for-ttable').on("change", function(){
        var groupId = $('#group-for-ttable').val();
        if(!groupId){
            return false;
        }
        else{
            location.href = '/ttable/group/' + groupId;
        }
    });

    $("#drop-ttable").click(function(){
        var res = confirm("Удалить расписание?");
        if(res == false){
            return false;
        }
    });

    $("#select-group-for-view-mark").change(function(){
        var groupName = $("#select-group-for-add-mark > option:selected").text();
        //location.href = "/marks/add/group/" + groupName;
    });

    $("#group-for-add-marks").change(function(){
        var groupId = $("#group-for-add-marks").val();
        if(!groupId) return false;
        location.href = "/marks/add/group/" + groupId;
    });


    $('.edit-tooltip').tooltip({
        title: 'Изменить',
        trigger: 'hover'
    });

    $('.remove-tooltip').tooltip({
        title: 'Удалить',
        trigger: 'hover'
    });

    $('.download-tooltip').tooltip({
        title: 'Скачать документ',
        trigger: 'hover'
    });

    $('#addSubject').click(function(){
        $('.addSubjectForm').slideDown(500);
        $('#hiddenSubjectForm').fadeIn(500);
        $('.addSubjectForm').attr('action', '/subjects/add');
        $('#subjectName').val("");
        $('input[type="hidden"]').val("");
        $("#plusSubject, #minusSubject").fadeIn(500);
    });

    $("#plusSubject").click(function(){
        var countStudInput = $(".input-group").size();
        if(countStudInput >= 10){
            return false;
        }
        $(".input-group:last").after('<div class="input-group" style="margin-bottom: 10px"> \n' +
            '<span class="input-group-addon"><span class="glyphicon glyphicon-bookmark"></span></span>\n' +
            '<input required class="form-control subjects" type="text" name="subjects[]" value="">\n </div>'
        );
    });

    $("#minusSubject").click(function(){
        var countStudInput = $(".input-group").size();
        if(countStudInput == 1){
            return false;
        }
        $(".input-group:last").remove();
    });

    $('#hiddenSubjectForm').click(function(){
        $('.addSubjectForm').slideUp(500);
        $(this).fadeOut(500);
        $("#plusSubject, #minusSubject").fadeOut(500);
        $(".input-group").not(".input-group:first").remove();
    });

    $("#saveSubject").on("click", function(e){
        e.preventDefault();
        var subjects = [];
        var subjectId = $('input[type="hidden"]').val();

        console.log($(".addSubjectForm").attr('action'));

        for(var i = 0; i <= $(".subjects").length - 1; i++){
            if(!$(".subjects")[i].value){
                setError("<li>Заполните все поля!</li>");
                removeError();
                return false;
            }
            subjects.push($(".subjects")[i].value);
        }

        $.ajax({
            type: "GET",
            url: $(".addSubjectForm").attr('action'),
            data: {subject_id_save: subjectId, subjects: subjects},
            success: function(res){
                if(res === "__SUBJECT_EXISTS__"){
                    setError("<li>Один или несколько указанных вами предметов уже существуют. Укажите другое наименование!</li>");
                }
                else if(res === "__SUCCESS__"){
                    location.href = "/subjects";
                }
            }
        });
    });

    $('.editSubject').on("click", function(){
        $(".input-group").not(".input-group:first").remove();
        $.ajax({
            type: 'get',
            url: '/subjects/edit',
            data: {subject_id: $(this).attr('subjectId')},
            success: function(res){
                res = JSON.parse(res);
                console.log(res.subject_id, res.subject_name);
                $('.addSubjectForm').slideDown(500).attr('action', '/subjects/edit');
                $('#hiddenSubjectForm').fadeIn(500);
                $('.subjects:first').val(res.subject_name);
                $('input[type="hidden"]').val(res.subject_id);
            }
        });
        return false
    });

    $(".removeSubject").click(function(){
        var res = confirm("Удалить предмет?");
        if(!res) return false;
        var subjectId = $(this).attr("subjectId");
        $(this).parent().parent().remove();
        $.ajax({
            type: "GET",
            url: "/subjects/drop",
            data: {subject_id: subjectId},
            success: function(res){
                if(res === "Dropped"){
                    return true;
                }
                else{
                    return false;
                }
            }
        });
        return false;
    });

    /* Пользовательские фукции */
        /* Функция выводящая оповещения пользователю */
            function setError(error){
                $('.errors').remove();
                $('.container').prepend('<ul class="errors alert alert-danger" style="display: none">' +
                    error
                + '</ul>');
                $('.errors').slideDown(500);
            }
        /* Функция выводящая оповещения пользователю */

        /* Проверка элемента в массиве */
            function inArray(array, item){
                var getMatch = null;
                for(var i = 0; i <= array.length - 1; i++){
                    if(array[i] === item){
                        getMatch = array[i];
                    }
                    else{
                        continue;
                    }
                }
                return getMatch;
            }
        /* Проверка элемента в массиве */

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
    /* Пользовательские фукции */

    $('#saveTtable').click(function(){
        var errorMessages = '';
        var subjectId = $('select[name="subject_id"]').val();
        var groupId = $('select[name="group_id"]').val();
        var date = $('input[name="date"]').val();

        if(!groupId){
            errorMessages += "<li class='errorText'>Не выбрана группа!</li>";
        }

        if(!subjectId){
            errorMessages += "<li class='errorText'>Не выбран предмет!</li>";
        }

        if(!date){
            errorMessages += "<li class='errorText'>Не указана дата!</li>";
        }

        if(errorMessages){
            setError(errorMessages);
            return false;
        }
    });

    $('#saveTtable').click(function(){
        if($('select[name="group_id"]').val() == ""){
            setError("<li class='errorText'>Не выбрана группа!</li>");
            return false;
        }
    });

    /* Авторизация пользователя */
        $("#auth").click(function(){
            var login = $(".login").val();
            var password = $(".password").val();
            if(!login || !password){
                $('.top-right').notify({
                    message: { text: 'Заполните все поля! ' + login + ' ' + password},
                    closable: false,
                    transition: 'fade',
                    type: 'danger'
                }).show();
            }
            else{
                $.ajax({
                    type: 'GET',
                    url: '/login',
                    data: {login: login, password: password},
                    success: function(res){
                        if(res === 'Granted'){
                            location.href = '/'
                        }
                        else if(res === 'Failed'){
                            $('.top-right').notify({
                                message: { text: 'Неправильный логин или пароль!'},
                                closable: false,
                                transition: 'fade',
                                type: 'danger'
                            }).show();
                        }
                    }
                });
            }
        });
    /* Авторизация пользователя */

    /* Множественное удаление новостей */
        var checkedNews = [];
        $(".checkedNews").click(function(){
            if($(this).is(":checked")){
                checkedNews.push($(this).val());
            }
            else{
                checkedNews.pop();
            }

            if(checkedNews.length > 0){
                $("#dropCheckedNews").stop().fadeIn(500);
            }
            else{
                $("#dropCheckedNews").stop().fadeOut(500);
            }
        });

        $("#dropCheckedNews").click(function(){
            var res = confirm("Удалить отмечененные новости?");
            if(!res) return false;
            checkedNews = checkedNews.join(", ");
            $.ajax({
                url: "/news/drop",
                type: "GET",
                data: {checkedNews: checkedNews},
                success: function(res){
                    if(res === "Dropped"){
                        $(".checkedNews:checked").parent().remove();
                        $("#dropCheckedNews").fadeOut();
                    }
                    else if(res === "Failed"){
                        console.log(res);
                    }
                },
            });
        });
    /* Множественное удаление новостей */

    $(".dropNews").click(function(){
        var res = confirm("Удалить новость?");
        if(!res) return false;
        var newsId = $(this).attr("dropNews");
        $(".dropNews[dropNews=" + newsId + "]").parent().remove();
        $.ajax({
            type: "GET",
            url: "/news/drop",
            data: {news_id: newsId},
            success: function(res){
                if(res === "Dropped"){
                    return true;
                }
                else{
                    return false;
                }
            }
        });
    });

    /* Методические работы */
        $("#saveMetWork").click(function(){
            var errors = "";
            var fileName = $("input[type='file']").val();
            var name = $("input[name='metWorksName']").val();
            var extensions = ['doc', 'docx', 'txt', 'pdf'];
            var fileExt = fileName.replace(/.+\.([a-z]+)$/gim, "$1");

            if(!name){
                errors += "<li class='errorText'>Введите наименование!</li>"
            }
            if(!fileName){
                errors += "<li class='errorText'>Выберите файл!</li>"
            }
            else{
                if(!inArray(extensions, fileExt)){
                    errors += "<li class='errorText'>Недопустимый формат!</li>"
                }
            }

            if(errors){
                setError(errors);
                return false;
            }
        });

        $(".removeMetwork").click(function(){
            var res = confirm("Удалить документ?");
            var metworkId = $(this).attr("metworkId");

            if(!res) return false;

            $(this).parent().parent().remove();
            $.ajax({
                type: "GET",
                url: "/met-works/drop",
                data: {metworkId: metworkId},
                success: function(res){
                    if(res === "Dropped"){
                        console.log(res);
                    }
                    else{
                        console.log(res);
                    }
                }
            });
            return false;
        });

        $("#addMetwork").click(function(){
            $(".metWorksAddForm").stop().slideDown(500);
            $("#hiddenMetworkForm").stop().fadeIn(500);
        });

        $("#hiddenMetworkForm").click(function(){
            $(".metWorksAddForm").stop().slideUp(500);
            $(this).stop().fadeOut(500);
            $(".errors").slideUp(500);
        });

        /* Множественное удаление методических работ */
            var checkedMetworks = [];
            $(".checkedMetworks").click(function(){
                if($(this).is(":checked")){
                    checkedMetworks.push($(this).val());
                }
                else{
                    checkedMetworks.pop();
                }

                if(checkedMetworks.length > 0){
                    $("#dropCheckedMetworks").stop().fadeIn(500);
                }
                else{
                    $("#dropCheckedMetworks").stop().fadeOut(500);
                }
            });

            $("#dropCheckedMetworks").click(function(){
                checkedMetworks = checkedMetworks.join(", ");
                var res = confirm("Удалить отмеченные документы?");
                if(!res) return false;
                $.ajax({
                    url: "/met-works/drop",
                    type: "GET",
                    data: {checkedMetworks: checkedMetworks},
                    success: function(res){
                        if(res === "Dropped"){
                            $(".checkedMetworks:checked").parent().parent().remove();
                            $("#dropCheckedMetworks").stop().fadeOut(500);
                            checkedMetworks = [];
                        }
                        else if(res === "Failed"){
                            console.log(res);
                        }
                    },
                });
            });
        /* Множественное удаление методических работ */
    /* Методические работы */

    /* Посещаемость */
        $("#group-for-add-attendance").change(function(){
            var groupId = $('#group-for-add-attendance').val();
            if(!groupId) return false;
            location.href = '/attendance/add/group/' + groupId;
        });

        $("#insertAttend").click(function(){
            var errors = "";
            var groupId = $("#select-group-for-add-attend").val();
            var date = $("#dateAttend").val();

            if(!groupId){
                errors += "<li class='errorText'>Выберите группу!</li>"
            }

            if(!date){
                errors += "<li class='errorText'>Заполните дату!</li>"
            }

            if(errors){
                setError(errors);
            }
            else{
                location.href = '/attendance/view/' + groupId + "/" + date;
            }

        });

        $("#saveEditAttendance").click(function(){
            var errors = "";
            var groupId = $("#group-for-add-attendance").val();
            var date = $("#dateAttend").val();

            if(!groupId){
                errors += "<li class='errorText'>Выберите группу!</li>"
            }

            if(!date){
                errors += "<li class='errorText'>Заполните дату!</li>"
            }

            if(errors){
                setError(errors);
                return false;
            }
        });
    /* Посещаемость */

    /* Группы */
        $('#addGroup').click(function(){
            $('.addGroupsForm').slideDown(500);
            $('#hiddenGroupForm').fadeIn(500);
            $('.addGroupsForm').attr('action', '/groups/add');
            $('#groupName').val("");
            $('input[type="hidden"]').val("");
            $("#plusGroup, #minusGroup").fadeIn(500);
        });

        $("#plusGroup").click(function(){
            var countGroupInput = $(".input-group").size();
            if(countGroupInput >= 10){
                return false;
            }
            $(".input-group:last").after('<div class="input-group" style="margin-bottom: 10px"> \n' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-bookmark"></span></span>\n' +
                '<input required class="form-control groups" type="text" name="groups[]" value="">\n </div>'
            );
        });

        $("#minusGroup").click(function(){
            var countGroupInput = $(".input-group").size();
            if(countGroupInput == 1){
                return false;
            }
            $(".input-group:last").remove();
        });

        $("#saveGroup").click(function(){
            var groups = [];
            var groupId = $('input[type="hidden"]').val();

            console.log($('.addGroupsForm').attr('action'));

            for(var i = 0; i <= $(".groups").length - 1; i++){
                if(!$(".groups")[i].value){
                    setError("<li>Заполните все поля!</li>");
                    removeError();
                    return false;
                }
                groups.push($(".groups")[i].value);
            }

            $.ajax({
                type: "GET",
                url: $('.addGroupsForm').attr('action'),
                data: {group_id_save: groupId, groups: groups},
                success: function(res){
                    if(res === "__GROUP_EXISTS__"){
                        setError("<li>Одна или несколько указанных вами групп уже существуют. Укажите другое наименование!</li>");
                    }
                    else if(res === "__SUCCESS__"){
                        location.href = "/groups";
                    }
                }
            });

            return false;
        });

        $('#hiddenGroupForm').click(function(){
            $('.addGroupsForm').slideUp(500);
            $(this).fadeOut(500);
            $("#plusGroup, #minusGroup").fadeOut(500);
            $(".input-group").not(".input-group:first").remove();
        });

        $('.editGroup').click(function(){
            $(".input-group").not(".input-group:first").remove();
            $.ajax({
                type: 'get',
                url: '/groups/edit',
                data: {group_id: $(this).attr('groupId')},
                success: function(res){
                    res = JSON.parse(res);
                    console.log(res.group_id, res.group_name);
                    $('.addGroupsForm').slideDown(500).attr('action', '/groups/edit');
                    $('#hiddenGroupForm').fadeIn(500);
                    $('#groupName').val(res.group_name);
                    $('input[type="hidden"]').val(res.group_id);
                }
            });
            return false
        });

        $(".removeGroup").click(function(){
            var res = confirm("Удалить группу?");
            if(!res) return false;
            var groupId = $(this).attr("groupId");
            $(this).parent().parent().remove();
            $.ajax({
                type: "GET",
                url: "/groups/drop",
                data: {group_id: groupId},
                success: function(res){
                    if(res === "Dropped"){
                        return true;
                    }
                    else{
                        return false;
                    }
                }
            });
            return false;
        });
        /* Множественное удаление групп */
            var checkedGroups = [];
            $(".checkedGroups").click(function(){
                if($(this).is(":checked")){
                    checkedGroups.push($(this).val());
                }
                else{
                    checkedGroups.pop();
                }

                if(checkedGroups.length > 0){
                    $("#dropCheckedGroups").stop().fadeIn(500);
                }
                else{
                    $("#dropCheckedGroups").stop().fadeOut(500);
                }
            });

            $("#dropCheckedGroups").click(function(){
                var res = confirm("Удалить отмеченные группы?");
                if(!res) return false;
                checkedGroups = checkedGroups.join(", ");
                $.ajax({
                    url: "/groups/drop",
                    type: "GET",
                    data: {checkedGroups: checkedGroups},
                    success: function(res){
                        if(res === "Dropped"){
                            $(".checkedGroups:checked").parent().parent().remove();
                            $("#dropCheckedGroups").stop().fadeOut(500);
                            checkedGroups = [];
                        }
                        else if(res === "Failed"){
                            console.log(res);
                        }
                    },
                });
            });
        /* Множественное удаление групп */
    /* Группы */

    /* Заявки пользователей */
        $(".acceptRequest").click(function(){
            var id = $(this).attr('userId');
            var typeUser = $(this).attr('type-user');
            var res = confirm("Принять заявку?");
            if(!res) return false;
            $(this).parent().parent().remove();
            $.ajax({
                url: "/requests/accept",
                type: "GET",
                data: {user_id: id, type_user: typeUser},
                success: function(res){
                    if(res === "__SUCCESS__"){
                        alert("Пользователь успешно авторизован!");
                    }
                    else{
                        console.log(res);
                    }
                }
            });
        });

        $(".declineRequest").click(function(){
            var id = $(this).attr('userId');
            var typeUser = $(this).attr('type-user');
            var res = confirm("Отклонить заявку?");
            if(!res) return false;
            $(this).parent().parent().remove();
            $.ajax({
                url: "/requests/decline",
                type: "GET",
                data: {user_id: id, type_user: typeUser},
                success: function(res){
                    if(res === "__SUCCESS__"){
                        alert("Заявка отклонена, пользователь удален!");
                    }
                    else{
                        console.log(res);
                    }
                }
            });
        });
    /* Заявки пользователей */

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
                    url: "/change-user",
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

        $("#showPassword").on("click", function(){
            if($(this).is(":checked")){
                $("#password, #repeatPassword").attr("type", "text");
            }
            else{
                $("#password, #repeatPassword").attr("type", "password");
            }
        });
    /* Изменения данных пользователя */
});
