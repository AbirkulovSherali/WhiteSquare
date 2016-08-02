$(document).ready(function(){

    /* Подключение Bootstrap DataPicker */
    $('#dataPicker').datetimepicker({
        locale: 'ru',
        viewMode: 'years',
        format: 'DD.MM.YYYY'
    });

    /* Подключение Bootstrap DataPicker */
    $('#dataPickerAdd').datetimepicker({
        locale: 'ru',
        viewMode: 'years',
        format: 'MM.YYYY'
    });
    
})
