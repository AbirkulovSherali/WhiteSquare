$(document).ready(function(){

    $('#getGroupStudents').change(function(){
        var groupName = $('#getGroupStudents > option:selected').text();
        location.href = '/students/group/' + groupName;
    });

    $('.editStudent').click(function(){
        var studentId = $(this).attr('studentId');
        $.ajax({
            type: "get",
            url: '/students/edit',
            data: {student_id: studentId},
            success: function(res){
                res = JSON.parse(res);
                console.log(res.student_id, res.student_name, res.group_id);
                $('.studentForm').slideDown(500).attr('action', '/students/edit');
                $('#hiddenStudentForm').stop().fadeIn(500);
                $("input[name='student_name']").val(res.student_name);
                $("select[name='group_id']").val(res.group_id);
                $("input[name='student_id']").val(res.student_id);
            }
        });
        return false;
    });

    $('#addStudent').click(function(){
        $('.studentForm').stop().slideDown(500);
        $('#hiddenStudentForm').stop().fadeIn(500).attr('action', '/students/add');
        $("input[name='student_name']").val("");
        $("select[name='group_id']").val("");
        $("input[name='student_id']").val("");
    });

    $('#hiddenStudentForm').click(function(){
        $('.studentForm').stop().slideUp(500);
        $(this).stop().fadeOut(500);
        $('.errors').slideUp(500);
    });

    $("#saveStudent").click(function(){
        if(!$("select[name='group_id']").val()){
            setError("<li class='errorText'>Не выбрана группа!</li>");
            return false;
        }
    });

    $("select[name='group_id']").change(function(){
        if(!$("select[name='group_id'] option:selected").val()){
            setError("<li class='errorText'>Не выбрана группа!</li>");
        }else{
            $('.errors').slideUp(500);
        }
    });

    $(".removeStudent").click(function(){
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

    $('#group-for-ttable').change(function(){
        var groupName = $('#group-for-ttable > option:selected').text();
        if(groupName == "Выберите группу"){
            location.href = '/ttable';
        }
        else{
            location.href = '/ttable/group/' + groupName;
        }

    });

    $("#drop-ttable").click(function(){
        var res = confirm("Удалить расписание?");
        if(res == false){
            return false;
        }
    });

    $("#select-group-for-add-mark").change(function(){
        var groupName = $("#select-group-for-add-mark > option:selected").text();
        //location.href = "/marks/add/group/" + groupName;
    });

    $("#group-for-add-marks").change(function(){
        var groupName = $("#group-for-add-marks > option:selected").text();
        if(groupName === 'Выберите группу') return false;
        location.href = "/marks/add/group/" + groupName;
    });


    $('.edit-tooltip').tooltip({
        title: 'Изменить',
        trigger: 'hover'
    });

    $('.remove-tooltip').tooltip({
        title: 'Удалить',
        trigger: 'hover'
    });

    $('#addSubject').click(function(){
        $('.addSubjectForm').slideDown(500);
        $('#hiddenSubjectForm').fadeIn(500);
        $('.addSubjectForm').attr('action', '/subjects/add');
        $('#subjectName').val("");
        $('input[type="hidden"]').val("");
    });

    $('#hiddenSubjectForm').click(function(){
        $('.addSubjectForm').slideUp(500);
        $(this).fadeOut(500);
    });

    $('.editSubject').click(function(){
        $.ajax({
            type: 'get',
            url: '/subjects/edit',
            data: {subject_id: $(this).attr('subjectId')},
            success: function(res){
                res = JSON.parse(res);
                console.log(res.subject_id, res.subject_name);
                $('.addSubjectForm').slideDown(500).attr('action', '/subjects/edit');
                $('#hiddenSubjectForm').fadeIn(500);
                $('#subjectName').val(res.subject_name);
                $('input[type="hidden"]').val(res.subject_id);
            }
        });
        return false
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

    $('#addTtable, #saveTtable').click(function(){
        var errorMessages = '';
        var subjectId = $('select[name="subject_id"]').val();
        var groupId = $('select[name="group_id"]').val();
        var date = $('input[name="date"]').val();

        if(!groupId){
            errorMessages = errorMessages + "<li class='errorText'>Не выбрана группа!</li>";
        }

        if(!subjectId){
            errorMessages = errorMessages + "<li class='errorText'>Не выбран предмет!</li>";
        }

        if(!date){
            errorMessages = errorMessages + "<li class='errorText'>Не указана дата!</li>";
        }

        if(errorMessages){
            setError(errorMessages);
            return false;
        }
    });

    $('#add-ttable').click(function(){
        if($('select[name="group_id"]').val() == ""){
            setError("<li class='errorText'>Не выбрана группа!</li>");
            return false;
        }
    });

});
